import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { paymentMethod, order, paymentData } = body;

    if (!paymentMethod || !order || !paymentData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID;
    const applicationIdentifier = process.env.NOON_APP_ID;
    const applicationKey = process.env.NOON_API_KEY;
    const baseUrl = process.env.NOON_API_BASE;

    if (!businessIdentifier || !applicationIdentifier || !applicationKey) {
      return NextResponse.json({ error: 'Missing Noon environment variables' }, { status: 500 });
    }

    const basicAuth = `Key ${Buffer.from(`${businessIdentifier}.${applicationIdentifier}:${applicationKey}`).toString(
      'base64',
    )}`;

    let paymentType: 'GooglePay' | 'SamsungPay';

    if (paymentMethod === 'google') {
      paymentType = 'GooglePay';
    } else if (paymentMethod === 'samsung') {
      paymentType = 'SamsungPay';
    } else {
      return NextResponse.json({ error: 'Unsupported payment method' }, { status: 400 });
    }

    const noonPayload = {
      apiOperation: 'INITIATE',
      order, // orderReference, amount, currency, etc.
      paymentData: {
        type: paymentType,
        data: paymentData, // Google Pay token or SamsungPay JWE token
      },
      configuration: {
        paymentAction: 'AUTHORIZE,SALE',
        returnUrl: `http://localhost:3000/order-confirmation/orderId`,
      },
    };

    const response = await fetch(`${baseUrl}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuth,
      },
      body: JSON.stringify(noonPayload),
    });

    const data = await response.json();
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
