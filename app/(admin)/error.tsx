'use client';

import { useEffect } from 'react';

const testMode = process.env.TEST_MODE !== 'false';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <code>{error.message}</code>
      {testMode && <code>{error.stack}</code>}
      <button
        type="button"
        className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
                    // Attempt to recover by trying to re-render
                    () => reset()
                }
      >
        Try again
      </button>
    </main>
  );
}
