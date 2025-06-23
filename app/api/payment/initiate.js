import axios from 'axios';
import { getNoonAuthHeader } from '../../../lib/noonAuth.js';

export default async function handler(req, res) {
  console.log('🚀 ~ handler ~ req, res:', req, res);
  console.log('🚀 ~ handler ~ process.env.NOON_API_BASE:', process.env.NOON_API_BASE);

  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  try {
    const response = await axios.post(
      `${process.env.NOON_API_BASE}/order`,
      {
        apiOperation: 'INITIATE',
        order: {
          amount: '10.00',
          currency: 'AED',
          name: 'Test Order',
          reference: `NPORD-${Date.now()}`,
          category: 'pay',
          channel: 'web',
          items: [{ name: 'iPhone', quantity: 1, unitPrice: 10.0 }],
        },
        configuration: {
          locale: 'en',
          paymentAction: 'AUTHORIZE,SALE',
          returnUrl: 'http://localhost:3000/success',
        },
      },
      {
        headers: {
          Authorization: getNoonAuthHeader(),
          'Content-Type': 'application/json',
        },
      },
    );

    const postUrl = response.data.result?.checkoutData?.postUrl;

    if (!postUrl) {
      return res.status(400).json({ error: 'Checkout URL not received' });
    }

    return res.status(200).json({ checkoutUrl: postUrl });
  } catch (error) {
    console.error('INITIATE error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to initiate payment' });
  }
}
