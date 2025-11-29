import {NextResponse} from 'next/server';
import {fetchOrCreateProfileByEmail} from '@util/profileActions';
import {handleCheckout} from "@util/checkout";
import {FeeType} from "@types";

type Params = Promise<{ feeType: FeeType }>;

export async function POST(
    request: Request,
    {params}: { params: Params }
) {
    const {feeType} = await params;
    const body = await request.json().catch(() => ({}));
    const emailRaw = (body?.email ?? '').toString().trim().toLowerCase();
    if (!emailRaw) {
        return NextResponse.json({message: 'Email is required for public checkout'}, {status: 400});
    }

    // Fetch or create a profile based on email; no session required
    const profileData = await fetchOrCreateProfileByEmail(emailRaw);
    return handleCheckout(profileData, feeType);

}
