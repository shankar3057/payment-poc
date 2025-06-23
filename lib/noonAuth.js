export function getNoonAuthHeader() {
  const biz = process.env.NOON_BUSINESS_ID.trim();
  const app = process.env.NOON_APP_ID.trim();
  const key = process.env.NOON_APP_KEY.trim();
  const raw = `${biz}.${app}:${key}`;
  const base64 = Buffer.from(raw).toString('base64');
  return `Key ${base64}`;
}
