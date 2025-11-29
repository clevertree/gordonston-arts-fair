import Link from 'next/link';
import {Stack} from '@mui/material';
import {SignedIn, SignedOut} from "@clerk/nextjs";

export const metadata = {
    title: 'Payment Error',
};

export default async function PaymentFailurePage() {
    return (
        <Stack spacing={2}>
            <h1 className="m-auto text-red-400 italic">Payment failed</h1>

            <SignedOut>
                <Link href="/">Click here to return to the home page</Link>
            </SignedOut>
            <SignedIn>
                <Link href="/profile">Click here to return to your profile</Link>
            </SignedIn>
        </Stack>
    );
}
