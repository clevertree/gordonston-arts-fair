'use client'

import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';

interface RegisterFormProps {
    redirectURL: string
}

function RegisterForm({
                          redirectURL
                      }: RegisterFormProps) {

    const [status, setStatus] = useState<'loaded' | 'submitting' | 'submitted' | 'error'>('loaded');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setStatus('submitting');
        setMessage('');

        const registerRequest = {
            email,
            password
        }
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerRequest),
            })
            const responseData = await response.json();
            // Check if the response was successful (e.g., status code 200-299)
            if (!response.ok) {
                setStatus('error');
                setMessage(responseData.error || `HTTP error! status: ${response.status}`);
            } else {
                setStatus('submitted');
                document.location.href = responseData.redirectURL || redirectURL;
                setMessage(responseData.message || `Registration was successful`);
            }
        } catch (e: any) {
            setStatus('error');
            setMessage(e.message);
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
                Register an Artist Account
            </Typography>
            {message && <Typography variant="caption" color={status === 'error' ? "red" : "blue"} align="center">
                {message}
            </Typography>}
            <TextField
                label="Email Address"
                variant="outlined"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true
                    }
                }}
            />
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
                Register
            </Button>
        </Box>
    );
}

export default RegisterForm;
