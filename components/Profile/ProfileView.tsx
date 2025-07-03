import React from 'react';
import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { getStatusName, UserProfile, UserProfileInfo } from '@util/profile';
import ReloadingImage from '@components/Image/ReloadingImage';
import Link from 'next/link';

interface ProfileViewProps {
  userProfile: UserProfile
}

function ProfileView({ userProfile }: ProfileViewProps) {
  const { uploads: profileUploads = {}, info: profileInfo = {}, status } = userProfile;

  const profileInfoLabels: {
    [key in keyof UserProfileInfo]: string
  } = {
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Primary Phone',
    phone2: 'Contact Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zip: 'Zipcode',
    category: 'Category',
  };
  const profileInfoFields = Object.keys(profileInfoLabels) as (keyof UserProfileInfo)[];
  const uploadList = Object.values(profileUploads);

  return (
    <Box className="flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell colSpan={2}>
                Contact Information
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Status
              </TableCell>
              <TableCell>
                <Alert severity={status === 'paid' ? 'success' : 'info'}>
                  {getStatusName(status)}
                </Alert>
              </TableCell>
            </TableRow>
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

      <Typography component="h2" id="step1">
        Uploaded files
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-green-700 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell colSpan={2}>
                File uploads:
                {uploadList.length}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {uploadList.map(({ title, description, url }) => (
              <TableRow key={url + title}>
                <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
                  <Typography component="h2">
                    {title}
                  </Typography>
                  {description && (
                  <Typography variant="body2">
                    {description}
                  </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ position: 'relative', width: '20rem', height: '20rem' }}>
                  {url && (
                  <Link href={url} target="_blank" rel="noreferrer">
                    <ReloadingImage
                      loading="lazy"
                      src={url}
                      alt={title}
                      fill
                    />
                  </Link>
                  )}
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
