'use client'

import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';

function PasswordResetForm() {
    const [status, setStatus] = useState<'loaded' | 'submitting' | 'submitted' | 'error'>('loaded');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setMessage('');
        setStatus('submitting')

        const resetRequest = {
            email,
        }
        try {
            const response = await fetch('/api/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(resetRequest),
            })
            // Check if the response was successful (e.g., status code 200-299)
            const responseData = await response.json();
            if (!response.ok) {
                setStatus('error')
                setMessage(responseData.error || `HTTP error! status: ${response.status}`);
            } else {
                setStatus('submitted')
                setMessage(responseData.message)
            }
        } catch (e: any) {
            setStatus('error')
            setMessage(e.message)
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
            {message && <Typography variant="caption" color={status === 'error' ? "red" : "blue"} align="center">
                {message}
            </Typography>}
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
