'use client';

import React, { Suspense } from 'react';
import { SuspenseContent } from '@app/suspenseContent';

export default function Template({
  children
} : {
  children: React.ReactNode;
}) {
  console.log('Admin Template');
  return <Suspense fallback={<SuspenseContent />}>{children}</Suspense>;
}
