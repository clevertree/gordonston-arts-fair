'use client'

import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';

interface PasswordResetValidationFormProps {
    email: string,
    code: string,
    redirectURL: string
}

function PasswordResetValidationForm({email, code, redirectURL}: PasswordResetValidationFormProps) {
    const [status, setStatus] = useState<'loaded' | 'submitting' | 'submitted' | 'error'>('loaded');
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setMessage('');
        setStatus('submitting')

        const resetRequest = {
            email,
            code,
            password
        }
        try {
            const response = await fetch('/api/password/validate', {
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
                document.location.href = redirectURL;
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
                Set a new password
            </Typography>
            {message && <Typography variant="caption" color={status === 'error' ? "red" : "blue"} align="center">
                {message}
            </Typography>}
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true
                    }
                }}
            />
            <Button type="submit" variant="contained" color="primary"
                    disabled={status !== 'loaded' && status !== 'error'}>
                Reset Password
            </Button>
        </Box>
    );
}

export default PasswordResetValidationForm;
