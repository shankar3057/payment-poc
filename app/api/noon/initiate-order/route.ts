import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🚀 ~ POST ~ body:', body);
    const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID;
    const applicationIdentifier = process.env.NOON_APP_ID;
    const applicationKey = process.env.NOON_API_KEY;

    const basicAuth = `Key ${Buffer.from(`${businessIdentifier}.${applicationIdentifier}:${applicationKey}`).toString(
      'base64',
    )}`;
    console.log('🚀 ~ POST ~ basicAuth:', basicAuth);

    const response = await fetch('https://api.noonpayments.com/payment/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Key ZWVfcmVlbGNpbmVtYS5zaGFua2FyX3Rlc3Q6MDM5ZGM1ODA4ZWNjNDQ5OGFjM2MyOTYyYzhjNjFjODY=', // make sure this is defined
      },
      body: JSON.stringify({
        apiOperation: 'INITIATE',
        order: body.order,
        paymentData: {
          type: 'GooglePay',
          data: body.paymentData,
        },
        configuration: {
          paymentAction: 'AUTHORIZE,SALE',
          returnUrl: 'https://yourdomain.com/payment/response',
        },
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error calling Noon API:', error);
    return NextResponse.json(error);
  }
}
