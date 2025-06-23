// types/apple-pay.d.ts
declare interface ApplePayJS {
  version: number;
  ApplePaySession: unknown;
}

interface Window {
  ApplePaySession?: unknown;
}
