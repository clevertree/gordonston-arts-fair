import React from 'react';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {UserProfile, UserProfileInfo} from "@util/profile";

interface ProfileViewProps {
    userProfile: UserProfile,
}

function ProfileView({userProfile}: ProfileViewProps) {
    const {uploads: profileUploads = {}, info: profileInfo = {}} = userProfile;

    const profileInfoLabels: {
        [key in keyof UserProfileInfo]: string
    } = {
        firstName: "First Name",
        lastName: "Last Name",
        phone: "Primary Phone",
        phone2: "Contact Phone",
        address: "Address",
        city: "City",
        state: "State",
        zip: "Zipcode",
        category: "Category",
    }
    const profileInfoFields = Object.keys(profileInfoLabels) as (keyof UserProfileInfo)[];


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '100%',
                gap: 2,
                margin: 'auto',
                padding: 3,
                border: '1px solid #ccc',
                borderRadius: 4,
            }}
        >
            <Typography variant="h6" id='step1'>
                Contact Information
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: '#1976d2',
                            '& th': {
                                fontWeight: 'bold',
                                color: 'white',
                                padding: '0.5rem'
                            }
                        }}>
                            <TableCell colSpan={2}>Profile</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {profileInfoFields.map((profileInfoField) => (
                            <TableRow key={profileInfoField}>
                                <TableCell component="th" scope="row">
                                    {profileInfoLabels[profileInfoField]}
                                </TableCell>
                                <TableCell>
                                    {profileInfo[profileInfoField]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ProfileView;
