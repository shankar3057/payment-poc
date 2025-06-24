// app/api/apple-pay/validate-merchant/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('🚀 ~ Apple Pay validation ~ body:', body);

  const { validationUrl } = body;

  const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID;
  const applicationIdentifier = process.env.NOON_APP_ID;
  const applicationKey = process.env.NOON_API_KEY;
  const baseUrl = process.env.NOON_API_BASE + '/order';

  const authHeader = `Key ${Buffer.from(`${businessIdentifier}.${applicationIdentifier}:${applicationKey}`).toString(
    'base64',
  )}`;

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiOperation: 'INITIATE',
      order: {
        amount: 1.2,
        currency: 'AED',
        name: 'Test Order',
        reference: 'NPORDTEST0001',
        category: 'applepay',
        channel: 'web',
      },
      configuration: {
        paymentAction: 'AUTHORIZE',
      },
      paymentData: {
        type: 'ApplePay',
        data: {
          validationUrl,
        },
      },
    }),
  });

  const data = await response.json();
  console.log('🚀 ~ POST ~ data:', data);

  return NextResponse.json(JSON.parse(data?.result.paymentData.data.validationData));
}
