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
    <>
      <h2 className="m-auto text-[color:var(--gold-color)] italic">Artist Logout</h2>

      <LogoutForm logoutAction={logoutAction} />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/logout">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
