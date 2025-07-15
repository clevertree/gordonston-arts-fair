/* eslint-disable no-console */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addTransaction } from '@util/transActions';
import { FeeMetaData } from '@app/api/checkout-sessions/[feeType]/route';
import { fetchProfileByID, updateUserStatus } from '@util/profileActions';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get('stripe-signature');

  if (!sig) {
    console.error('No stripe signature found');
    return NextResponse.json(
      { error: 'No stripe signature found' },
      { status: 400 }
    );
  }

  let event;

  // Initialize Stripe with type checking for the secret key
  if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
    throw new Error('STRIPE_SECRET_WEBHOOK_KEY is not defined');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_WEBHOOK_KEY);

  // Type check webhook secret
  if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
    throw new Error('STRIPE_SECRET_WEBHOOK_KEY is not defined');
  }

  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error verifying webhook signature:', error);
    return NextResponse.json(
      { error: `Webhook Error: ${error}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Checkout complete', event);
      // Handle successful payment
      break;
      // case 'charge.dispute.funds_reinstated':
      // case 'charge.dispute.funds_withdrawn':
      // case 'charge.refund.updated':
    // case 'charge.expired':
    // case 'charge.pending':
    case 'charge.refunded':
    case 'charge.succeeded': {
      const {
        amount,
        metadata,
        billing_details: {
          email,
          phone
        }
      } = event.data.object;
      const {
        userID,
        feeType
      } = metadata as unknown as FeeMetaData;
      console.log('STRIPE', amount / 100, event.type);
      await addTransaction(userID, event.type, amount / 100, event.data.object);
      const profileInfo = await fetchProfileByID(userID);

      switch (feeType) {
        case 'registration':
          if (profileInfo.status === 'registered') {
            await updateUserStatus(userID, 'submitted', 'Registration fee paid');
          }
          break;
        case 'booth':
          if (profileInfo.status === 'approved') {
            await updateUserStatus(userID, 'paid', 'Booth fee paid');
          }
          break;
        default:
      }

      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ message: 'Webhook received' });
}
