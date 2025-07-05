import { getPGSQLClient } from '@util/pgsql';
import { fetchProfileByEmail } from '@util/profileActions';

export const metadata = {
  title: 'Admin Test Reset',
};

export default async function ResetTests() {
  async function resetTests() {
    'use server';

    try {
      const testProfile = await fetchProfileByEmail('test@test.com');
      const sql = getPGSQLClient();
      await sql`DELETE
                  FROM gaf_user_log
                  WHERE user_id = ${testProfile.id}`;
      await sql`DELETE
                  FROM gaf_user
                  WHERE email = 'test@test.com'`;
      // eslint-disable-next-line no-console
      console.info('Test have been reset');
      return true;
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.info('Test could not be reset', e);
      return false;
    }
  }

  return (
    <form
      action={resetTests}
      method="post"
    >
      <button type="submit">Reset</button>
    </form>
  );
}
