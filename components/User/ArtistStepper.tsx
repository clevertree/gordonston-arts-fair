import { UserTableRow } from '@util/schema';
import { isProfileComplete } from '@util/profile';
import {
  Alert, Step, StepLabel, Stepper
} from '@mui/material';
import Link from 'next/link';
import React from 'react';

interface ArtistStepperProps {
  profileData: UserTableRow,
  showAlert?: boolean
}

export function ArtistStepper({ profileData, showAlert }: ArtistStepperProps) {
  let activeStep = 0;
  let message: ['info' | 'success', string] = ['info', 'Please complete your Artist profile.'];
  const profileStatus = isProfileComplete(profileData);
  let redirectURL: React.JSX.Element;
  if (profileStatus[0]) {
    activeStep = 1;
    message = ['info', 'Please pay the artist registration fee to submit your profile for approval.'];
    redirectURL = <Link href="/payment/registration">Click here to pay Registration Fee</Link>;
  } else {
    message = ['info', profileStatus[1]];
    redirectURL = <Link href="/profile/edit">Click here to return to profile editor</Link>;
  }
  if (profileData.status === 'submitted') {
    activeStep = 2;
    message = ['info', 'Please wait for approval from the Gordonston Arts Fair Administrators.'];
    redirectURL = <Link href="/profile">Click here to return to profile</Link>;
  }
  if (profileData.status === 'approved') {
    activeStep = 3;
    message = ['info', 'Please pay the artist booth fee to complete your artist registration.'];
    redirectURL = <Link href="/payment/booth">Click here to pay Registration Fee</Link>;
  }
  if (profileData.status === 'paid') {
    activeStep = 4;
    message = ['success', 'Your artist registration is complete!'];
    redirectURL = <Link href="/profile">Click here to return to profile</Link>;
  }

  return (
    <>
      <Stepper activeStep={activeStep} sx={{ padding: '1rem' }}>
        <Step>
          <Link href="/profile/edit">
            <StepLabel>Artist Profile</StepLabel>
          </Link>
        </Step>
        <Step>
          <Link href="/payment/registration">
            <StepLabel>Registration Fee</StepLabel>
          </Link>
        </Step>
        <Step>
          <StepLabel>Approval</StepLabel>
        </Step>
        <Step>
          <Link href="/payment/booth">
            <StepLabel>Booth Fee</StepLabel>
          </Link>
        </Step>
        <Step>
          <StepLabel>Artist Registration Complete</StepLabel>
        </Step>
      </Stepper>

      {showAlert && (
      <Alert severity={message[0]}>
        {message[1]}
        {' '}
        {redirectURL}
      </Alert>
      )}
    </>
  );
}
