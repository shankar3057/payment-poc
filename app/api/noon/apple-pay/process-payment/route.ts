import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { payment } = await req.json();

    const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID!;
    const applicationIdentifier = process.env.NOON_APP_ID!;
    const applicationKey = process.env.NOON_API_KEY!;
    const baseUrl = `${process.env.NOON_API_BASE}/order`;

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
        apiOperation: 'PROCESS_AUTHENTICATION',
        order: {
          amount: 1.2,
          currency: 'AED',
          name: 'Test Order',
          reference: 'NPORDTEST0001',
          category: 'applepaypay', // ✅ correct based on Noon routes
          channel: 'web',
        },
        paymentData: {
          type: 'ApplePay',
          data: {
            paymentInfo: JSON.stringify(payment.token),
          },
        },
      }),
    });

    const data = await response.json();
    console.log('🚀 ~ Process-payment ~ data:', data);

    if (data?.result?.transaction?.status === 'SUCCESS') {
      return NextResponse.json({ success: true, transaction: data.result.transaction });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || 'Payment failed',
          code: data?.resultCode,
        },
        { status: 500 },
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('🔴 Apple Pay PROCESS_AUTHENTICATION error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
