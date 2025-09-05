// app/error.tsx

'use client';

// Error boundaries must be client components

import { useEffect } from 'react';
import { HttpError } from '@util/exception/httpError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // const router = useRouter();
  useEffect(() => {
    // Log the error to an error reporting service
    // if (error instanceof HttpError.Unauthorized) {
    //   router.push('/login');
    // }
    console.error(error);
  }, [error]);
  if (error instanceof HttpError) {
    console.log(error);
    // router.push('/login');

    return (
      <div>
        <h2>Login session ended. Please log in</h2>
        <button onClick={() => reset()}>Try again</button>
      </div>
    );
  }

  return (
    <div>
      <h2>
        Something went wrong!
        {error.code}
      </h2>
      {JSON.stringify(error, null, 2)}
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
