import RegisterForm from '@components/SessionForms/RegisterForm';
import { Stack } from '@mui/material';
import Link from 'next/link';
import { registerAction } from '@util/sessionActions';

export const metadata = {
  title: 'Artist Registration',
};

export default async function ArtistRegistration() {
  // const session = await validateSession()

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Registration</h1>

      <RegisterForm registerAction={registerAction} />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
        <Link href="/password">Click here to reset your password</Link>
      </Stack>
    </>
  );
}
