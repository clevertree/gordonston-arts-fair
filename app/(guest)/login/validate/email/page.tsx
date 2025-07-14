import { Stack } from '@mui/material';
import Link from 'next/link';
import LoginValidationForm from '@components/SessionForms/LoginValidationForm';
import { loginEmailValidationAction } from '@util/sessionActions';

export const metadata = {
  title: 'Artist Email Login Validation',
};

interface ArtistLoginEmailValidationPageProps {
  searchParams: Promise<{
    email: string,
    code: string,
  }>;
}
export default async function ArtistLoginEmailValidationPage(
  { searchParams }: ArtistLoginEmailValidationPageProps
) {
  const { code: defaultCode, email } = await searchParams;
  // const session = await validateSession()

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Login</h1>

      <LoginValidationForm
        loginValidationAction={async (code) => {
          'use server';

          return loginEmailValidationAction(email, code);
        }}
        defaultCode={defaultCode}
      />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
