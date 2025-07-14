import LoginEmailForm from '@components/SessionForms/LoginEmailForm';
import LoginPhoneForm from '@components/SessionForms/LoginPhoneForm';
import { Stack } from '@mui/material';
import Link from 'next/link';
import { loginPhoneAction } from '@util/phoneActions';
import { loginEmailAction } from '@util/emailActions';

export const metadata = {
  title: 'Artist Login',
};

export default async function ArtistLogin() {
  // const session = await validateSession()

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Login</h1>

      <LoginEmailForm loginEmailAction={loginEmailAction} />
      <LoginPhoneForm loginPhoneAction={loginPhoneAction} />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
