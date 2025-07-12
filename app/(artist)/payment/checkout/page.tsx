import { validateSession } from '@util/session';
import { fetchProfileByEmail } from '@util/profileActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Checkout from '@components/Payment/Checkout';

export const metadata = {
  title: 'Artist Checkout',
};

const stripePublishableKey = `${process.env.TEST_MODE === 'true'
  ? process.env.STRIPE_PUBLISHABLE_KEY_LIVE
  : process.env.STRIPE_PUBLISHABLE_KEY_TEST}`;

// TODO: setup userID in checkout session
export default async function CheckoutPage() {
  let sessionEmail: string | undefined;
  try {
    const session = await validateSession();
    sessionEmail = session.email;
  } catch (e: any) {
    return redirect(`/login?message=${e.message}`);
  }
  const profileData = await fetchProfileByEmail(sessionEmail);

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Checkout</h1>

      <Checkout stripePublishableKey={stripePublishableKey} />

      <Link href="/profile/edit">Click here to edit your profile</Link>
      {JSON.stringify(profileData)}
    </>
  );
}
