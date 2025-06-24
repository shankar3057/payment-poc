'use client';
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const GooglePayButton = () => {
  const router = useRouter();
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (window.google && window.google.payments) {
      setGoogleLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://pay.google.com/gp/p/js/pay.js';
    script.async = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleLoaded) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });

    const button = paymentsClient.createButton({
      onClick: onGooglePayClicked,
      buttonType: 'buy',
      buttonColor: 'black',
    });

    const gpayContainer = document.getElementById('gpay-button');
    if (gpayContainer && gpayContainer.children.length === 0) {
      gpayContainer.appendChild(button);
    }
  }, [googleLoaded]);

  const onGooglePayClicked = async () => {
    const paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'noonpayments',
              gatewayMerchantId: process.env.NEXT_PUBLIC_NOON_BUSINESS_ID,
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID!,
        merchantName: 'Your Merchant Name',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: '94.20',
        currencyCode: 'AED',
        countryCode: 'AE',
      },
    };

    const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: 'TEST' });
    const paymentData = await paymentsClient.loadPaymentData(paymentRequest);

    const res = await fetch('/api/noon/initiate-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentMethod: 'google',
        order: {
          amount: 70.2,
          currency: 'AED',
          name: 'Test Order',
          reference: 'NPORDTEST0001',
          category: 'googlepay',
          channel: 'web',
        },
        paymentData,
      }),
    });

    const result = await res.json();
    console.log('Noon PG response:', result);

    if (result?.resultCode === 0) {
      const orderId = result?.result?.order?.id;
      // Redirect to confirmation page with orderId
      router.push(`/order-confirmation/${orderId}`);
    }
  };

  return <div id="gpay-button" />;
};

export default GooglePayButton;
