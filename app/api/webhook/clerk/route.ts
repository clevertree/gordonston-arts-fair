// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { SessionWebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svixID = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svixID || !svixTimestamp || !svixSignature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: SessionWebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svixID,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as SessionWebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the event
  // const eventType = evt.type;
  // const email = `${evt.data.email_addresses[0].email_address}`.toLowerCase() || null;
  // if (!email) {
  //   return new Response('Error occurred. Invalid Email Address', {
  //     status: 400,
  //   });
  // }
  // const userProfile = await fetchOrCreateProfileByEmail(email);
  switch (evt.type) {
    // case 'sessions.created':
    //   await addUserUserLogModel(userProfile.id, 'log-in');
    //   break;
    default:
      console.log('Clerk event:', evt.type, evt.data);
      break;
  }

  return new Response('', { status: 200 });
}
