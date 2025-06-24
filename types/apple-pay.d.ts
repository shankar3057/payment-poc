declare interface Window {
  ApplePaySession?: typeof ApplePaySession;
}

declare let ApplePaySession: {
  new (version: number, request: ApplePayJS.ApplePayPaymentRequest): ApplePayJS.ApplePaySession;
  supportsVersion(version: number): boolean;
  canMakePayments(): boolean;
  STATUS_SUCCESS: number;
  STATUS_FAILURE: number;
};
