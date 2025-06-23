declare let ApplePaySession: any;

const ApplePayButton = () => {
  const initiateApplePay = async () => {
    if (typeof window !== 'undefined' && window.ApplePaySession && ApplePaySession.canMakePayments()) {
      const paymentRequest = {
        countryCode: 'AE',
        currencyCode: 'AED',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: { label: 'Reel Cinemas', amount: '99.00' },
      };

      const session = new ApplePaySession(3, paymentRequest);

      session.onvalidatemerchant = async (event: any) => {
        const res = await fetch('/api/validate-apple-merchant', {
          method: 'POST',
          body: JSON.stringify({ validationURL: event.validationURL }),
          headers: { 'Content-Type': 'application/json' },
        });
        const merchantSession = await res.json();
        session.completeMerchantValidation(merchantSession);
      };

      session.onpaymentauthorized = async (event: any) => {
        const res = await fetch('/api/confirm-apple-payment', {
          method: 'POST',
          body: JSON.stringify({ token: event.payment.token }),
          headers: { 'Content-Type': 'application/json' },
        });
        const result = await res.json();
        if (result.success) {
          session.completePayment(ApplePaySession.STATUS_SUCCESS);
        } else {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
      };

      session.begin();
    } else {
      alert('Apple Pay not supported on this device/browser.');
    }
  };

  return (
    <button onClick={initiateApplePay} className="bg-black text-white p-3 rounded-md">
      Pay via Apple Pay
    </button>
  );
};

export default ApplePayButton;
