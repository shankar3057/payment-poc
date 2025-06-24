import Confirmation from '../../../components/confirmation';

type Params = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PaymentConfirmation(props: { params: Params; searchParams: SearchParams }) {
  const params = await props.params;

  const businessIdentifier = process.env.NEXT_PUBLIC_NOON_BUSINESS_ID;
  const applicationIdentifier = process.env.NOON_APP_ID;
  const applicationKey = process.env.NOON_API_KEY;
  const baseUrl = process.env.NOON_API_BASE;

  const basicAuth = `Key ${Buffer.from(`${businessIdentifier}.${applicationIdentifier}:${applicationKey}`).toString(
    'base64',
  )}`;

  const handleGetOrder = async () => {
    const response = await fetch(`${baseUrl}/order/${params?.orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: basicAuth,
      },
    });
    const data = await response.json();
    return data?.result;
  };

  const data = await handleGetOrder();
  console.log('🚀 ~ PaymentConfirmation ~ data:', data);

  // if (loading) return <div className="p-10 text-center">Loading your order confirmation...</div>;

  return <Confirmation compData={data} />;
}
