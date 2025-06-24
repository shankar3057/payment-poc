import GooglePayButton from '@/components/GooglePay';
import ApplePay from '../../components/ApplePayButton';
import SamsungPay from '../../components/SamsungPay';

const Payment = () => {
  return (
    <main className=" flex flex-col items-center justify-center bg-gray-50">
      <div className="flex justify-center flex-col items-center h-screen bg-gray-50">
        <GooglePayButton />
        <ApplePay />
        <SamsungPay />
      </div>
    </main>
  );
};

export default Payment;
