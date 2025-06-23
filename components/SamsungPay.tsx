'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SamsungPay: any;
  }
}

const SamsungPayButton = () => {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Load Samsung Pay SDK script
    const script = document.createElement('script');
    script.src = 'https://img.mpay.samsung.com/gsmpi/sdk/samsungpay_web_sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('Samsung Pay SDK loaded');
      if (window.SamsungPay?.PaymentClient) {
        setSdkReady(true);
      } else {
        console.error('SamsungPay.PaymentClient is not available');
      }
    };
    script.onerror = () => console.error('Failed to load Samsung Pay SDK');
    document.body.appendChild(script);
  }, []);

  const handleSamsungPayClick = async () => {
    const SamsungPay = window.SamsungPay;
    if (!SamsungPay?.PaymentClient) {
      console.error('SamsungPay.PaymentClient is not available');
      return;
    }

    const samsungPayClient = new SamsungPay.PaymentClient({
      environment: 'STAGE', // Change to 'PRODUCTION' for live
    });

    const paymentMethods = {
      version: '2',
      serviceId: 'dcc1cbb25d6a470bb42926', // 🔁 Replace with your Samsung service ID
      protocol: 'PROTOCOL_3DS',
      allowedBrands: ['visa', 'mastercard'],
    };

    const transactionDetail = {
      orderNumber: 'ORDER' + Date.now(),
      merchant: {
        name: 'Virtual Shop',
        url: 'virtualshop.com',
        id: 'xn7qfnd', // 🔁 Replace with your merchant ID
        countryCode: 'AE',
      },
      amount: {
        option: 'FORMAT_TOTAL_ESTIMATED_AMOUNT',
        currency: 'AED',
        total: 100.0,
      },
    };

    try {
      const ready = await samsungPayClient.isReadyToPay(paymentMethods);
      if (!ready.result) {
        console.error('Samsung Pay is not available');
        return;
      }

      const paymentCredential = await samsungPayClient.loadPaymentSheet(paymentMethods, transactionDetail);
      const jweToken = paymentCredential['3DS']?.data;

      console.log('Samsung Pay JWE Token:', jweToken);

      // Send to Noon API for order creation
      const res = await fetch('/api/noon/initiate-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'samsung',
          order: {
            reference: 'ORDER456',
            amount: 120,
            currency: 'AED',
          },
          paymentData: jweToken,
        }),
      });

      const data = await res.json();
      console.log('Noon API response:', data);

      // Notify Samsung Pay of the result (optional)
      samsungPayClient.notify({
        status: 'CHARGED',
        provider: 'NOON',
      });
    } catch (error) {
      console.error('Samsung Pay error:', error);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {sdkReady && (
        <button
          id="samsung-pay-btn"
          onClick={handleSamsungPayClick}
          className="bg-black cursor-pointer hover:bg-gray-800 text-white py-2 px-6 rounded-xl shadow-lg flex items-center space-x-2"
        >
          <span>Pay with Samsung Pay</span>
        </button>
      )}
    </div>
  );
};

export default SamsungPayButton;
