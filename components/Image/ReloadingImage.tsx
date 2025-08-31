'use client';

import React from 'react';
import Image from 'next/image';
import { ImageProps } from 'next/dist/shared/lib/get-img-props';

export default function ReloadingImage({ alt, ...props }: ImageProps) {
  let retries = 0;
  return (
    <Image
      alt={alt}
      onError={(e: any) => {
        if (retries < 3) {
          retries += 1;
          setTimeout(() => {
            e.target.src += '?&';
          }, 5000);
        }
      }}
      loading="lazy"
      {...props}
    />
  );
}
