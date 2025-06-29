import React from 'react';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {UserProfile, UserProfileInfo} from "@util/profile";
import ReloadingImage from "@components/Image/ReloadingImage";
import Link from "next/link";

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
    const uploadList = Object.values(profileUploads);


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

            <Typography variant="h6" id='step1'>
                Uploaded files
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
                            <TableCell colSpan={2}>File uploads</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {uploadList.map(({title, description, url}) => (
                            <TableRow key={url + title}>
                                <TableCell component="th" scope="row" sx={{verticalAlign: 'top'}}>
                                    <Typography variant="h6">
                                        {title}
                                    </Typography>
                                    {description && <Typography variant="body2">
                                        {description}
                                    </Typography>}
                                </TableCell>
                                <TableCell sx={{position: 'relative', width: '20rem', height: '20rem'}}>
                                    {url && <Link href={url} target='_blank' rel='noreferrer'>
                                        <ReloadingImage
                                            loading='lazy'
                                            src={url}
                                            alt={title}
                                            fill
                                        />
                                    </Link>}
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
