'use client';

import React, { Suspense } from 'react';
import { SuspenseContent } from '@app/suspenseContent';

export default function Template({
  children
} : {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<SuspenseContent />}>{children}</Suspense>;
}
