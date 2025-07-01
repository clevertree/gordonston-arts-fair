import PasswordResetValidationForm from '@components/SessionForms/PasswordResetValidationForm';
import Link from 'next/link';
import { Stack } from '@mui/material';
import { passwordResetValidateAction } from '@util/sessionActions';

export const metadata = {
  title: 'Artist Registration: Set a new password',
};

export default async function PasswordResetValidationPage({
  params,
}: {
  params: Promise<{ email: string, code: string }>
}) {
  const { email, code } = await params;

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Registration</h1>

      <PasswordResetValidationForm
        passwordResetValidateAction={passwordResetValidateAction}
        email={email.replace('%40', '@')}
        code={code}
      />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
