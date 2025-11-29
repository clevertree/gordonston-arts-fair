import {fetchProfileFromSession} from '@util/profileActions';
import {handleCheckout} from "@util/checkout";
import {FeeType} from "@types";

type Params = Promise<{ feeType: FeeType }>;

export async function POST(
    request: Request,
    {params}: { params: Params }
) {
    const profileData = await fetchProfileFromSession();
    const {feeType} = await params;
    return handleCheckout(profileData, feeType);
}

