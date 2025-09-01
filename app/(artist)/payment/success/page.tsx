import Link from 'next/link';

export const metadata = {
  title: 'Payment Success',
};

export default async function PaymentSuccessPage() {
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Payment was successful</h1>

      <Link href="/profile">Click here to return to your profile</Link>
    </>
  );
}
