'use client';

import { loadStripe } from '@stripe/stripe-js';
import {
  Alert, Button, Paper, Stack
} from '@mui/material';
import React, { useState } from 'react';
import type { AlertColor } from '@mui/material/Alert';

interface CheckoutProps {
  stripePublishableKey: string,
  feeType: 'registration' | 'booth',
  feeText: string,
  buttonText: string
}

export default function Checkout({
  stripePublishableKey, feeType,
  buttonText,
  feeText
}: CheckoutProps) {
  const [message, setMessage] = useState<[AlertColor, string]>(['info', feeText]);

  const handleCheckout = async () => {
    const stripePromise = loadStripe(stripePublishableKey);
    setMessage(['info', "Redirecting to Stripe's checkout page..."]);
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Invalid stripe instance');
    const response = await fetch(`/api/checkout-sessions/${feeType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originUrl: window.location.origin,
      }),
    });
    const { sessionId, message: statusMessage } = await response.json();
    if (response.status !== 200) {
      setMessage(['error', statusMessage]);
    } else {
      await stripe.redirectToCheckout({ sessionId });
    }
  };

  return (
    <Paper elevation={3}>
      <Stack spacing={2} padding={2}>
        <h1>Checkout</h1>
        {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
        )}
        <Button
          variant="outlined"
          onClick={handleCheckout}
        >
          {buttonText}
        </Button>
      </Stack>
    </Paper>
  );
}
