'use client';

import React, {SyntheticEvent, useRef, useState} from 'react';
import Image from 'next/image';
import {ImageProps} from 'next/dist/shared/lib/get-img-props';

export default function ReloadingImage({ alt, ...props }: ImageProps) {
  const [retries, setRetries] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <Image
      alt={alt}
      onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
        if (retries < 3) {
          // Clear existing timeout before setting a new one
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          setRetries((prev) => prev + 1);
          timeoutRef.current = setTimeout(() => {
              (e.target as HTMLImageElement).src += '?&';
          }, 5000);
        }
      }}
      loading="lazy"
      {...props}
    />
  );
}
