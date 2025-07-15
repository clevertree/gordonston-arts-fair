import React from 'react';
import {
  Alert,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { getStatusName } from '@util/profile';
import ReloadingImage from '@components/Image/ReloadingImage';
import Link from 'next/link';
import { UserTableRow } from '@util/schema';
import { formatPhone } from '@components/FormFields/formatting';

interface ProfileViewProps {
  userProfile: UserTableRow
}

function ProfileView({ userProfile }: ProfileViewProps) {
  const { uploads: profileUploads = {}, status } = userProfile;

  const profileInfoLabels: {
    [key in keyof UserTableRow]?: string
  } = {
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    phone: 'Primary Phone',
    phone2: 'Contact Phone',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipcode: 'Zipcode',
    category: 'Category',
  };
  const profileInfoFields = Object.keys(profileInfoLabels) as (keyof UserTableRow)[];
  const uploadList = Object.values(profileUploads);

  function val(profileInfoField: keyof UserTableRow) {
    const value = userProfile[profileInfoField] as string;
    switch (profileInfoField) {
      case 'phone':
      case 'phone2':
        return value ? <Link href={`tel:${value}`}>{formatPhone(`${value}`)}</Link> : 'N/A';
      case 'email':
        return value ? <Link href={`mailto:${value}`}>{`${value}`}</Link> : 'N/A';
      default:
        return value;
    }
  }

  return (
    <Box className="flex flex-col min-w-full m-auto p-6 gap-2 rounded-2xl border-2 border-[#ccca]">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-600 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
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
                  {val(profileInfoField)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography component="h2" id="step1">
        Uploaded files
      </Typography>

      <Stack direction="column">
        <Box className="bg-green-700 bold text-white p-4 py-2 rounded-md">
          File uploads:
          {uploadList.length}
        </Box>
        {uploadList.map(({
          title, description, url, width, height
        }) => (
          <Stack
            padding={1}
            spacing={2}
            key={url + title}
            direction={{ xs: 'column', sm: 'row' }}
          >
            <Stack
              spacing={2}
              sx={{
                width: { xs: '100%', sm: '50%' },
              }}
            >
              <Typography component="h2" className="break-words">
                {title}
              </Typography>
              {description && (
              <Typography variant="body2">
                {description}
              </Typography>
              )}
            </Stack>
            {url && (
            <Box
              sx={{
                width: { xs: '100%', sm: '50%' },
              }}
            >
              <Link href={url} target="_blank" rel="noreferrer" tabIndex={0}>
                <ReloadingImage
                  loading="lazy"
                  src={url}
                  alt={title}
                  width={width}
                  height={height}
                />
              </Link>
            </Box>
            )}
          </Stack>
        ))}
      </Stack>

    </Box>
  );
}

export default ProfileView;
