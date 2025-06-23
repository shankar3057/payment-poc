'use client';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleApplePay = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/payment/initiate');
      const { checkoutUrl } = res.data;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Payment URL not found');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 max-w-md w-full text-center border rounded-2xl shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4">Pay using Apple Pay</h1>
        <p className="text-gray-500 mb-6 text-sm">This is a Noon Payments sandbox integration.</p>
        <button
          onClick={handleApplePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-black rounded text-white px-2"
        >
          {loading && 'loading...'}
          {loading ? 'Processing...' : 'Pay with Apple Pay'}
        </button>
      </div>
    </main>
  );
}
