import { IProfileStatus } from '@util/profile';
import {
  Alert, Step, StepLabel, Stepper
} from '@mui/material';
import Link from 'next/link';
import React from 'react';

interface ArtistStepperProps {
  profileStatus: IProfileStatus,
  showAlert?: boolean
}

export function ArtistStepper({
  profileStatus: {
    status,
    complete,
    formFilled,
    message,
  }, showAlert
}: ArtistStepperProps) {
  let activeStep = 0;
  let returnMessage: ['info' | 'success', string] = ['info', message];
  let redirectURL: React.JSX.Element = <Link href="/profile/edit">Click here to return to profile editor</Link>;

  if (formFilled) {
    activeStep = 1;
    returnMessage = ['info', 'Please upload at least one image of your artwork to complete your profile.'];
    redirectURL = <Link href="/profile/upload">Click here to upload artist images</Link>;
  }

  if (complete) {
    activeStep = 2;
    returnMessage = ['info', 'Please pay the artist registration fee to submit your profile for approval.'];
    redirectURL = <Link href="/payment/registration">Click here to pay the Registration Fee</Link>;
  }

  if (status === 'submitted') {
    activeStep = 3;
    returnMessage = ['info', 'Please wait for approval from the Gordonston Arts Fair Administrators.'];
    redirectURL = <Link href="/profile">Click here to return to profile</Link>;
  }
  if (status === 'approved') {
    activeStep = 4;
    returnMessage = ['info', 'Please pay the artist booth fee to complete your artist registration.'];
    redirectURL = <Link href="/payment/booth">Click here to pay the Booth Fee</Link>;
  }
  if (status === 'paid') {
    activeStep = 5;
    returnMessage = ['success', 'Your artist registration is complete!'];
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
          <Link href="/profile/upload">
            <StepLabel>Upload Images</StepLabel>
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
        <Alert severity={returnMessage[0]}>
          {returnMessage[1]}
          {' '}
          {redirectURL}
        </Alert>
      )}
    </>
  );
}
