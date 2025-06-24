'use client';
import { useEffect, useState } from 'react';

const ApplePay = () => {
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ApplePaySession && ApplePaySession.canMakePayments()) {
      setCanPay(true);
    }
  }, []);

  const onApplePayClicked = async () => {
    const paymentRequest = {
      countryCode: 'AE',
      currencyCode: 'AED',
      supportedNetworks: ['visa', 'masterCard'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'Reel Cinemas',
        amount: '1.00',
      },
    };

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {
      const res = await fetch('/api/noon/apple-pay/validate-merchant', {
        method: 'POST',
        body: JSON.stringify({ validationUrl: event.validationURL }),
      });
      console.log('🚀 ~ session.onvalidatemerchant= ~ res:', res);
      const data = await res.json();
      session.completeMerchantValidation(data);
    };

    session.onpaymentauthorized = async (event) => {
      const res = await fetch('/api/noon/apple-pay/process-payment', {
        method: 'POST',
        body: JSON.stringify({ payment: event.payment }),
      });

      if (res.ok) {
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        window.location.href = '/confirmation';
      } else {
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    };

    session.begin();
  };

  if (!canPay) return null;

  return (
    <button
      onClick={onApplePayClicked}
      className="bg-black text-white px-5 py-2 rounded-xl shadow-lg hover:opacity-90 transition cursor-pointer"
    >
      Pay with  Apple Pay
    </button>
  );
};

export default ApplePay;
