import { Stack } from '@mui/material';
import Link from 'next/link';
import PasswordResetForm from '@components/SessionForms/PasswordResetForm';
import { passwordResetAction } from '@util/sessionActions';

export const metadata = {
  title: 'Artist Password Reset',
};

export default async function ArtistLogin() {
  // const session = await validateSession()

  return (
    <>
      <h2 className="m-auto text-[color:var(--gold-color)] italic">Artist Registration</h2>

      <PasswordResetForm passwordResetAction={passwordResetAction} />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
