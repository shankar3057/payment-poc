import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log('📥 Received Body:', body);

    // Extract payment method and data
    const { paymentMethod, order, paymentData } = body;

    if (!paymentMethod || !order || !paymentData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Env variables
    const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID;
    const applicationIdentifier = process.env.NOON_APP_ID;
    const applicationKey = process.env.NOON_API_KEY;

    if (!businessIdentifier || !applicationIdentifier || !applicationKey) {
      return NextResponse.json({ error: 'Missing Noon environment variables' }, { status: 500 });
    }

    const basicAuth = `Key ${Buffer.from(`${businessIdentifier}.${applicationIdentifier}:${applicationKey}`).toString(
      'base64',
    )}`;
    // console.log('🔐 Authorization Header:', { basicAuth, businessIdentifier, applicationIdentifier, applicationKey });

    // Determine payment type string
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
        returnUrl: 'https://yourdomain.com/payment/response',
      },
    };
    console.log('🚀 ~ POST ~ noonPayload:', JSON.stringify(noonPayload, null, 2));

    const response = await fetch('https://api-test.noonpayments.com/payment/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuth,
      },
      body: JSON.stringify(noonPayload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
