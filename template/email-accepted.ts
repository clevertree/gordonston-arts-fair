import { formatToLocal } from '@util/date';

const eventDate = new Date(`${process.env.NEXT_PUBLIC_EVENT_DATE}`);
const boothFee = process.env.NEXT_PUBLIC_BOOTH_FEE;
const registrationFeeDate = new Date(`${process.env.NEXT_PUBLIC_REGISTRATION_FEE_DATE}`);
const paymentURL = `${process.env.NEXT_PUBLIC_METADATA_URL}/payment`;

export const name = 'exhibit-accepted';
export const subject = 'Your exhibit has been accepted';
export const textBody = `Dear Artist,

Congratulations! After thoughtful consideration, the Gordonston Art Fair is pleased to inform you that you have been accepted to participate in our show on ${formatToLocal(eventDate)}. We are looking forward to an amazing, and successful day, we are thrilled that you will be a part of it!

To reserve your exhibit space, you must make payment of the ${boothFee}.00 booth fee by ${formatToLocal(registrationFeeDate)}, or your spot may be reassigned to another artist. Payment can be made by clicking the link below to return to our registration site. There you can make payment via our PayPal account. Checks may also be sent to Gordonston Art Fair, 117 Daisy Court, Savannah, GA, 31404.

${paymentURL}

Please feel free to use your social media contacts to spread the word about the event!

Again, congratulations, we look forward to seeing you in September!

Kind regards,
The Gordonston Art Fair Committee`;
