'use client';

import { InferAttributes } from 'sequelize';
import { UserFileUploadModel } from '@util/models';
import { IProfileStatus, IProfileStatusAction } from '@util/profile';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { ProfileUploadForm } from '@components/User/ProfileUploadForm';
import type { AlertColor } from '@mui/material/Alert';
import PaymentModal from '@components/Modal/PaymentModal';
import { useRouter } from 'next/navigation';

interface ProfileUploadsProps {
  userUploads: UserFileUploadModel[],

  uploadFile(file: File): Promise<{ result: IProfileStatus, message: string }>;

  updateFile(file: InferAttributes<UserFileUploadModel>): Promise<{
    result: IProfileStatus, message: string
  }>

  deleteFile(fileID: number): Promise<{ result: IProfileStatus, message: string }>
}

export function ProfileUploads({
  userUploads,
  uploadFile,
  updateFile,
  deleteFile
}: ProfileUploadsProps) {
  const fileUploadCount = userUploads.length;
  // const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['success', '']);
  const [showModal, setShowModal] = useState<'none' | IProfileStatusAction>('none');
  const uploadFilesRef = useRef<HTMLInputElement>(null);
  // const hasTriggeredUpload = useRef(false);

  const router = useRouter();
  const handleUserProfileUpdate = useCallback((newStatus: IProfileStatus) => {
    const {
      // complete: isUpdatedProfileComplete,
      action
    } = newStatus;
    if (action) {
      setShowModal(action);
    }
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (fileUploadCount === 0 && !hasTriggeredUpload.current) {
  //       hasTriggeredUpload.current = true;
  //       uploadFilesRef.current?.click();
  //     }
  //   }, 1000);
  // }, [fileUploadCount]);

  return (
    <>
      <Box className="flex flex-col min-w-full gap-2 mx-auto p-3 border border-gray-300 rounded">

        <Typography component="h2">
          Upload new images
        </Typography>

        <Stack spacing={2}>
          <label htmlFor="file-upload-multiple">
            <Button
              variant="outlined"
              component="span"
              color="secondary"
            >
              Click here to Upload multiple images
            </Button>
            <input
              ref={uploadFilesRef}
              style={{ display: 'none' }}
              id="file-upload-multiple"
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                e.stopPropagation();
                const input = e.target;
                if (input && input.files) {
                  let count = 0;
                  // setStatus('updating');
                  setMessage(['info', `Uploading ${input.files.length} files...`]);
                  let lastStatus: IProfileStatus | undefined;
                  try {
                    await Promise.all(Array.from(input.files).map(async (file) => {
                      lastStatus = (await uploadFile(file)).result;
                      count += 1;
                    }));
                  } catch (error: any) {
                    // eslint-disable-next-line no-console
                    console.error('Error uploading files', error);
                    // setStatus('error');
                    setMessage(['error', 'There was an error uploading your files.']);
                    return;
                  }
                  // setStatus('ready');
                  e.target.value = '';
                  if (count === 0) {
                    setMessage(['error', 'There was an error uploading your files.']);
                    return;
                  }

                  if (lastStatus) handleUserProfileUpdate(lastStatus);

                  setMessage(['success', `${count} file${count === 1 ? ' has been' : 's have been'} uploaded`]);
                  router.refresh();
                  // if (updatedUserProfile) {
                  //   setUserProfileClient((oldProfile) => ({
                  //     ...oldProfile,
                  //     ...updatedUserProfile
                  //   }));
                  // }
                }
              }}
            />
          </label>
        </Stack>
      </Box>
      <Box className="flex flex-col min-w-full gap-2 mx-auto p-3 border border-gray-300 rounded">
        {message && message[1] && (
        <Alert severity={message[0]}>
          {message[1]}
        </Alert>
        )}

        <Typography component="h2">
          Manage uploaded images
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                className={`${fileUploadCount > 0 ? 'bg-green-700' : 'bg-amber-700'} [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2`}
              >
                <TableCell colSpan={2}>
                  File uploads:
                  {' '}
                  {fileUploadCount}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userUploads.map((fileUpload) => (
                <ProfileUploadForm
                  key={fileUpload.id}
                  fileUpload={fileUpload}
                                    // uploadHooks={formUploadList}
                  deleteFile={deleteFile}
                  updateFile={updateFile}
                  onUpdate={handleUserProfileUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <PaymentModal
        text="Please pay the registration fee to submit your registration for review."
        title="Your Profile is complete."
        open={showModal === 'pay-fee-registration'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          document.location.href = '/payment/registration';
        }}
      />
      <PaymentModal
        text="Please pay the booth fee to complete your registration."
        title="Your Artist Profile has been Approved."
        open={showModal === 'pay-fee-booth'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          document.location.href = '/payment/booth';
        }}
      />
    </>
  );
}
