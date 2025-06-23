import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received Apple Pay token:', body.token);

  return NextResponse.json({
    success: true,
    message: 'Dummy payment completed',
  });
}
