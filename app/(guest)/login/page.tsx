/* eslint-disable max-len */
import LoginEmailForm from '@components/SessionForms/LoginEmailForm';
import LoginPhoneForm from '@components/SessionForms/LoginPhoneForm';
import { loginPhoneAction } from '@util/phoneActions';
import { loginEmailAction } from '@util/emailActions';
import { Stack } from '@mui/material';

export const metadata = {
  title: 'Artist Login',
};

export default async function ArtistLogin() {
  // const session = await validateSession()

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Registration & Login</h1>
      <p>
        As an entrant to The Gordonston Art Fair, I accept the decision of the Jury of Selection as final
        and will exhibit per regulations if selected. I will also allow my work to be used for advertising
        purposes by The Gordonston Art Fair Association.
      </p>
      <p>
        I hereby release The Gordonston Art Fair Association, its members, art festival director,
        and associates from any responsibility, personal liability (injury), loss damage or legal
        action that may arise or occur to me, my goods, my property or to the public from any condition
        whatsoever during the preparation, set-up, tear-down and duration of the art fair under this agreement.
        I am solely responsible for the selling of my items and any other conduct of my business.
        I am solely responsible for my person and my property during said event. This application for entry
        constitutes an agreement on my part that I accept the above statements as detailed.
        I also confirm that the work entered and exhibited is created by me and that the work I bring
        will be similar to the images I submitted in quality and style. I further attest that I have
        read, accept and agree to abide by all the rules and regulations outlined on the GordonstonArtFair.com
        &quot;Exhibitor Information&quot; and &quot;Application Process&quot; pages.
        I understand that if I am accepted for the festival, my booth fee is due within 30 days of acceptance.
        I also understand that I, as the artist, must be present for the duration of the event.
      </p>
      <p>
        By registering as an artist, I accept and agree to the terms and conditions above.
      </p>
      <div className="grid md:grid-cols-2 gap-4 p-3">
        <LoginEmailForm loginEmailAction={loginEmailAction} autoFocus />
        <LoginPhoneForm loginPhoneAction={loginPhoneAction} />
      </div>
    </Stack>
  );
}
