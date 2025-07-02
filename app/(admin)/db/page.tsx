import { importDBFromCSV } from '@util/dbActions';
import { validateAdminSession } from '@util/sessionActions';

export const metadata = {
  title: 'Admin User List',
};

export default async function InsertDBAdmin() {
  await validateAdminSession();
  const csvExport = await importDBFromCSV();
  return (
    <>
      <h1 className="m-auto text-[color:var(--gold-color)] italic">
        Insert DB
      </h1>

      Export:
      {' '}
      {JSON.stringify(csvExport)}
    </>
  );
}
