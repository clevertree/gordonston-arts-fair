import Link from 'next/link';

export const metadata = {
  title: 'Payment Error',
};

export default async function PaymentFailurePage() {
  return (
    <>
      <h1 className="m-auto text-red-400 italic">Payment failed</h1>

      <Link href="/profile">Click here to return to your profile</Link>
    </>
  );
}
