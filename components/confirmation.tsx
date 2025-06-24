'use client';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Confirmation = (props: any) => {
  const { compData } = props;
  const router = useRouter();
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl text-center border border-green-200">
        <h1 className="text-2xl font-bold text-green-700 mt-4">Payment Confirmed</h1>
        <p className="mt-2 text-green-600">Thank you! Your payment has been successfully processed.</p>

        <div className="mt-6 bg-green-100 p-4 rounded-xl">
          <p className="text-sm text-green-700">Order Reference</p>
          <p className="text-lg font-medium text-green-800">{compData?.order?.id}</p>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          A confirmation email has been sent. You can also view your order details in your account dashboard.
        </div>

        <button
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
