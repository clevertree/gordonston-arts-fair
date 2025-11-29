import {fetchProfileFromSession} from '@util/profileActions';
import {handleCheckout} from "@util/checkout";

type Params = Promise<{ feeType: string }>;

export async function POST(
    request: Request,
    {params}: { params: Params }
) {
    const profileData = await fetchProfileFromSession();
    const {feeType} = await params;
    return handleCheckout(profileData, feeType);
}

