'use client';

import React, { useState } from 'react';
import {
  Alert, Box, Button, Typography
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { ActionResponse } from '@util/sessionActions';

interface LogoutFormProps {
  logoutAction(): Promise<ActionResponse>
}

function LogoutForm({
  logoutAction
}: LogoutFormProps) {
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['warning', 'Please submit this form to log out.']);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage(['info', 'Submitting logout form...']);

    try {
      const response = await logoutAction();
      setMessage([response.status, response.message]);
      if (response.redirectURL) document.location.href = response.redirectURL;
    } catch (e: any) {
      setMessage(['error', e.message]);
    } finally {
      setStatus('ready');
    }
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: 'auto',
          padding: 3,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      >
        <Typography component="h2" align="center">
          Artist Logout
        </Typography>
        {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={status === 'submitting'}
        >
          Logout
        </Button>
      </Box>
    </form>
  );
}

export default LogoutForm;
