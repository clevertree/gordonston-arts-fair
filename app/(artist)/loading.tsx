import { SuspenseContent } from '@app/suspenseContent';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Loading Artist Dashboard...</h1>
      <SuspenseContent />
    </div>
  );
}
