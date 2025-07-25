import LogoutForm from '@components/SessionForms/LogoutForm';
import { Stack } from '@mui/material';
import Link from 'next/link';
import { logoutAction } from '@util/sessionActions';

export const metadata = {
  title: 'Artist Logout',
};

export default async function ArtistLogout() {
  // const session = await validateSession()

  return (
    <Stack spacing={2}>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Logout</h1>

      <LogoutForm logoutAction={logoutAction} />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </Stack>
  );
}
