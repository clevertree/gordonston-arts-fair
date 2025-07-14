import { Stack } from '@mui/material';
import Link from 'next/link';
import LoginValidationForm from '@components/SessionForms/LoginValidationForm';

import { loginPhoneValidationAction } from '@util/phoneActions';

export const metadata = {
  title: 'Artist Phone Login Validation',
};

interface ArtistLoginPhoneValidationPageProps {
  searchParams: Promise<{
    phone: string,
    code: string,
  }>;
}
export default async function ArtistLoginPhoneValidationPage(
  { searchParams }: ArtistLoginPhoneValidationPageProps
) {
  const { code: defaultCode, phone } = await searchParams;
  if (!phone) throw new Error('No phone number provided');
  // const session = await validateSession()

  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">Artist Login</h1>

      <LoginValidationForm
        loginValidationAction={async (code) => {
          'use server';

          return loginPhoneValidationAction(phone, code);
        }}
        defaultCode={defaultCode}
      />

      <Stack sx={{ margin: 'auto' }} direction="column">
        <Link href="/login">Click here to log in as an Artist</Link>
      </Stack>
    </>
  );
}
