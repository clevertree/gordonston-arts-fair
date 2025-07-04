import { getPGSQLClient } from '@util/pgsql';
import { fetchProfileByEmail } from '@util/profileActions';

export const metadata = {
  title: 'Admin Test Reset',
};

export default async function ResetTests() {
  try {
    const testProfile = await fetchProfileByEmail('test@test.com');
    const sql = getPGSQLClient();
    await sql`DELETE
                  FROM gaf_user_log
                  WHERE user_id = ${testProfile.id}`;
    await sql`DELETE
                  FROM gaf_user
                  WHERE email = 'test@test.com'`;
  } catch (e: any) {
    return (
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        {e.message}
      </h1>
    );
  }

  return (
    <h1 className="m-auto text-[color:var(--gold-color)] italic">
      Test Reset Successful
    </h1>
  );
}
