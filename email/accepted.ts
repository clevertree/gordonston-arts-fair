import { formatDate } from '@util/date';

const eventDate = new Date(`${process.env.NEXT_PUBLIC_EVENT_DATE}`);
const boothFee = process.env.NEXT_PUBLIC_BOOTH_FEE;
const registrationFeeDate = new Date(`${process.env.NEXT_PUBLIC_REGISTRATION_FEE_DATE}`);
const paymentURL = `${process.env.NEXT_PUBLIC_METADATA_URL}/payment`;

export const name = 'accepted';
export const subject = 'Your exhibit has been accepted';

export const htmlBody = () => `<p>Dear Artist,</p>

<p>Congratulations! After thoughtful consideration, the Gordonston Art Fair is pleased to inform you that you have been accepted to participate in our show on ${formatDate(eventDate)}. We are looking forward to an amazing, and successful day, we are thrilled that you will be a part of it!</p>

<p>To reserve your exhibit space, you must make payment of the ${boothFee}.00 booth fee by ${formatDate(registrationFeeDate)}, or your spot may be reassigned to another artist. Payment can be made by clicking the link below to return to our registration site. There you can make payment via our PayPal account. Checks may also be sent to Gordonston Art Fair, 117 Daisy Court, Savannah, GA, 31404.</p>

<a href="${paymentURL}">${paymentURL}</a>

<p>Please feel free to use your social media contacts to spread the word about the event!</p>

<p>Again, congratulations, we look forward to seeing you in September!</p>

<p>Kind regards,<br/>
The Gordonston Art Fair Committee</p>`;

export const textBody = () => htmlBody().replace(/<[^>]*>/g, '');
