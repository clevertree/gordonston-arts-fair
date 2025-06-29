'use client'

import React, {useState} from 'react';
import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import type {AlertColor} from "@mui/material/Alert";
import {ActionResponse} from "@util/sessionActions";

interface PasswordResetFormProps {
    passwordResetAction(email: string): Promise<ActionResponse>
}

function PasswordResetForm({passwordResetAction}: PasswordResetFormProps) {
    const [status, setStatus] = useState<'loaded' | 'submitting' | 'submitted' | 'error'>('loaded');
    const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setStatus('submitting');
        setMessage(['info', 'Submitting password reset form...']);

        try {
            const {message} = await passwordResetAction(email);
            setStatus('submitted');
            setMessage(['success', message]);
        } catch (e: any) {
            setStatus('error')
            setMessage(['error', e.message])
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
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
            <Typography variant="h6" align="center">
                Submit Password Reset Request
            </Typography>
            {message && message[1] && <Alert severity={message[0]}>
                {message[1]}
            </Alert>}
            <TextField
                label="Email Address"
                variant="outlined"
                type='email'
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                    setStatus('loaded')
                }}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true
                    }
                }}
                helperText="Enter the email you wish to send a reset request to"
            />
            <Button type="submit" variant="contained" color="primary" disabled={status !== 'loaded'}>
                Submit request
            </Button>
        </Box>
    );
}

export default PasswordResetForm;
