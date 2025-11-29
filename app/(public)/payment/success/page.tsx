import Link from 'next/link';
import {SignedIn, SignedOut} from "@clerk/nextjs";

export const metadata = {
    title: 'Payment Success',
};

export default async function PaymentSuccessPage() {
    return (
        <>
            <h1 className="m-auto text-[color:var(--gold-color)] italic">Payment was successful</h1>
            <SignedOut>
                <Link href="/">Click here to return to the home page</Link>
            </SignedOut>
            <SignedIn>
                <Link href="/profile">Click here to return to your profile</Link>
            </SignedIn>
        </>
    );
}
