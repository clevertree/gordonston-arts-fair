import { importDBFromCSV } from '@util/importActions';
import { validateAdminSession } from '@util/sessionActions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin User List',
};

export default async function InsertDBAdmin() {
  await validateAdminSession();
  async function importDB() {
    'use server';

    await importDBFromCSV();
    redirect('/db?success=true');
  }
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        Import DB
      </h1>
      <form
        action={importDB}
        method="post"
      >
        <button type="submit">Import DB</button>
      </form>
    </>
  );
}
