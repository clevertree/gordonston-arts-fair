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
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Login</h1>
      <div className="grid md:grid-cols-2 gap-4 p-3">
        <LoginEmailForm loginEmailAction={loginEmailAction} autoFocus />
        <LoginPhoneForm loginPhoneAction={loginPhoneAction} />
      </div>
    </Stack>
  );
}
