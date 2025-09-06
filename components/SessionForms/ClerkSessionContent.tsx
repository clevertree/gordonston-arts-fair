'use client';

import {
  SignedIn, SignedOut, SignInButton, UserButton, useUser
} from '@clerk/nextjs';
import React from 'react';
import { FaPaintBrush } from 'react-icons/fa';
import { RiAdminFill } from 'react-icons/ri';

export function ClerkSessionContent() {
  const { user } = useUser();
  const userType = user?.publicMetadata.type as string | undefined;

  return (
    <>
      <SignedOut>
        <SignInButton forceRedirectUrl="/redirect" />
      </SignedOut>
      <SignedIn>
        <UserButton
          showName
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-6 h-6', // Example using Tailwind CSS classes for width and height
            },
          }}
        >
          <UserButton.MenuItems>
            {userType !== 'admin' && (
              <UserButton.Link
                label="Artist Profile"
                labelIcon={<FaPaintBrush />}
                href="/profile"
              />
            )}
            {userType === 'admin'
                  && (
                  <UserButton.Link
                    label="Manage Artists"
                    labelIcon={<RiAdminFill />}
                    href="/user"
                  />
                  )}
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </>
  );
}
