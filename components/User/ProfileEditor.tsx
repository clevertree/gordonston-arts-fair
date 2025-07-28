'use client';

import React, { useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  MenuItem,
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

import {
  FormHookObject, SelectField, TextField, useFormHook
} from '@components/FormFields';
import type { AlertColor } from '@mui/material/Alert';
import Link from 'next/link';
import ReloadingImage from '@components/Image/ReloadingImage';
import { UserFileUploadDescription, UserTableRow } from '@util/schema';
import { getProfileCompletion } from '@util/profile';
import PaymentModal from '@components/Modal/PaymentModal';
import UploadsModal from '@components/Modal/UploadsModal';

export interface ProfileEditorProps {
  userProfile: UserTableRow,
  // isProfileComplete: [boolean, string],

  updateProfile(newUserProfile: UserTableRow): Promise<UserTableRow>

  uploadFile(file: File): Promise<UserTableRow>

  deleteFile(filename: string): Promise<UserTableRow>
}

function ProfileEditor({
  userProfile: userProfileServer,
  updateProfile,
  uploadFile,
  deleteFile
}: ProfileEditorProps) {
  const [showModal, setShowModal] = useState<'none' | 'payment' | 'uploads'>('none');
  const [userProfileClient, setUserProfileClient] = useState<UserTableRow>(userProfileServer);
  const [isProfileComplete, profileCompletionMessage] = getProfileCompletion(userProfileClient);
  const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(
    isProfileComplete
      ? ['success', 'Artist profile is complete']
      : ['info', profileCompletionMessage || 'Please complete your artist profile.']
  );
  // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
  // const formRef = useRef<HTMLFormElement>();
  const { uploads: profileUploads = {} } = userProfileClient;
  const formUploadList: { [filename: string]: FormHookObject<UserFileUploadDescription> } = {};
  const formRef = useRef<HTMLFormElement>(null);
  const uploadFilesRef = useRef<HTMLInputElement>(null);

  const formInfo = useFormHook(userProfileClient, (formData, isFormUnsaved) => {
    setUserProfileClient((oldUserProfile) => (
      { ...oldUserProfile, ...formData }));
    if (isFormUnsaved) {
      handleFormChange();
    }
    // setMessage('')
  }, status === 'error');
  const {
    formData: {
      category: categoryInput,
    }
  } = formInfo;

  const handleSubmit = async () => {
    // Validation
    const allForms = [formInfo, ...Object.values(formUploadList)];
    for (let i = 0; i < allForms.length; i++) {
      const form = allForms[i];
      const { firstError } = form;
      if (firstError) {
        const { message: firstErrorMessage, scrollToField } = firstError;
        setStatus('error');
        setMessage(['error', firstErrorMessage]);
        scrollToField();
        return;
      }
    }

    // Submit to server
    setStatus('updating');
    setMessage(['info', 'Submitting form...']);
    try {
      userProfileClient.uploads = profileUploads;
      const updatedUserProfile = await updateProfile(userProfileClient);
      const [isUpdatedProfileComplete, isUpdatedProfileCompleteMessage] = getProfileCompletion(updatedUserProfile);
      setStatus('ready');
      setMessage([isUpdatedProfileComplete ? 'success' : 'info', isUpdatedProfileCompleteMessage]);
      setUserProfileClient((oldProfile) => ({ ...oldProfile, ...updatedUserProfile }));
      if (isUpdatedProfileComplete) {
        setShowModal('payment');
      } else if (Object.values(profileUploads).length === 0) {
        setShowModal('uploads');
      }
    } catch (e: any) {
      setStatus('ready');
      setMessage(['error', e.message]);
    }
    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  function handleFormChange() {
    switch (status) {
      case 'ready':
        setMessage(['warning', 'Click "Update Profile" to save changes']);
        setStatus('unsaved');
        break;
      default:
        break;
    }
  }

  const fileUploadCount = Object.keys(profileUploads).length;

  return (
    <>
      <form
        method="post"
        ref={formRef}
          // onChange={handleFormChange}
        onSubmit={async (e: any) => {
          e.preventDefault();
          await handleSubmit();
        }}
        className="scroll-mt-8"
      >
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
          {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
          )}
          <Typography component="h2" id="step1">
            Contact Information
          </Typography>
          <fieldset disabled={status === 'updating'} className="grid md:grid-cols-4 gap-4">
            <TextField
              autoFocus
              helperText="Please enter your first name"
              {...formInfo.setupInput('first_name', 'First Name', 'required')}
              required
            />
            <TextField
              helperText="Please enter your first name"
              {...formInfo.setupInput('last_name', 'Last Name', 'required')}
              required
            />
            <TextField
              helperText="Optional company name"
              {...formInfo.setupInput('company_name', 'Company Name')}
            />
            <TextField
              helperText="Artist Website"
              {...formInfo.setupInput('website', 'Website')}
            />
          </fieldset>
          <fieldset disabled={status === 'updating'} className="grid md:grid-cols-3 gap-4">
            <TextField
              helperText="Primary Email"
              {...formInfo.setupInput('email', 'Primary Email', ['required', 'email'])}
              required
            />
            <TextField
              helperText="Primary Phone (i.e. home)"
              {...formInfo.setupInput('phone', 'Primary Phone', ['required', 'phone'], 'phone')}
              required
            />
            <TextField
              helperText="Contact Phone (i.e. cell)"
              {...formInfo.setupInput('phone2', 'Contact Phone', 'phone', 'phone')}
            />
          </fieldset>
          <fieldset disabled={status === 'updating'} className="grid md:grid-cols-4 gap-4">
            <TextField
              helperText="Enter your Address"
              placeholder="123 Art st."
              {...formInfo.setupInput('address', 'Address', 'required')}
              required
            />
            <TextField
              helperText="Enter your city name"
              placeholder="Savannah"
              {...formInfo.setupInput('city', 'City', 'required')}
              required
            />

            <SelectField
              required
              helperText="Enter your state"
              autoComplete="address-level1" // Crucial for browser autofill
              {...formInfo.setupInput('state', 'State', 'required')}
            >
              <MenuItem disabled value="">Select a state</MenuItem>
              {Object.entries(LIST_STATES).map(([state, name]) => (
                <MenuItem
                  key={state}
                  value={state}
                  selected={state === userProfileClient.state}
                >
                  {name}
                </MenuItem>
              ))}
            </SelectField>
            <TextField
              helperText="Enter your zipcode"
              placeholder="31404"
              {...formInfo.setupInput('zipcode', 'Zipcode', ['required', 'zipcode'])}
              required
            />
          </fieldset>
          <Typography component="h2">
            Exhibit Information
          </Typography>
          <fieldset disabled={status === 'updating'} className="grid md:grid-cols-2 gap-4">
            <SelectField
              fullWidth
              helperText="Select an exhibit category"
              {...formInfo.setupInput('category', 'Category', 'required')}
            >
              <MenuItem disabled value="">Select a category</MenuItem>
              {LIST_CATEGORIES.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
              {categoryInput
                  && !LIST_CATEGORIES.includes(categoryInput) && (
                  <MenuItem
                    key={categoryInput}
                    value={categoryInput}
                  >
                    {categoryInput}
                  </MenuItem>
              )}
            </SelectField>
            <Button
              variant="text"
              onClick={() => {
                // eslint-disable-next-line no-alert
                const category = window.prompt('Please enter a custom art category') || '';
                if (category) {
                  formInfo.setFieldValue('category', category);
                  setStatus('unsaved');
                }
              }}
            >
              Add a custom category
            </Button>
          </fieldset>
          <fieldset disabled={status === 'updating'}>
            <TextField
              multiline
              minRows={4}
              helperText="Describe your exhibit"
              placeholder="Information about my exhibit..."
              {...formInfo.setupInput('description', 'Description', 'required')}
              required
              slotProps={{
                htmlInput: {
                  maxLength: 600,
                },
                inputLabel: {
                  shrink: true
                }
              }}
            />
          </fieldset>

          <Typography component="h2">
            Upload images
          </Typography>

          <fieldset disabled={status === 'updating'}>
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
                      let updatedUserProfile: UserTableRow | null = null;
                      setStatus('updating');
                      setMessage(['info', `Uploading ${input.files.length} files...`]);
                      await Promise.all(Array.from(input.files).map(async (file) => {
                        updatedUserProfile = await uploadFile(file);
                        count += 1;
                      }));
                      setStatus('ready');
                      e.target.value = '';
                      if (!updatedUserProfile || count === 0) {
                        setMessage(['error', 'There was an error uploading your files.']);
                        return;
                      }

                      const [isUpdatedProfileComplete,
                        isUpdatedProfileCompleteMessage
                      ] = getProfileCompletion(updatedUserProfile);
                      setMessage([isUpdatedProfileComplete ? 'success' : 'info', isUpdatedProfileCompleteMessage]);
                      setUserProfileClient((oldProfile) => (
                        { ...oldProfile, ...updatedUserProfile }
                      ));
                      if (isUpdatedProfileComplete) {
                        setShowModal('payment');
                      }

                      // setMessage(['success', `${count} file${count === 1 ? '' : 's'} have been uploaded`]);
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
          </fieldset>

          <Typography component="h2">
            Manage uploaded images
          </Typography>

          <fieldset disabled={status === 'updating'}>
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
                  {Object.keys(profileUploads).map((filename: string) => (
                    <ProfileUploadForm
                      key={filename}
                      filename={filename}
                      userProfile={userProfileClient}
                      uploadHooks={formUploadList}
                      deleteFile={deleteFile}
                      status={status}
                      onUpdate={(updatedUserProfile, isFormUnsaved) => {
                        setUserProfileClient((oldProfile) => ({
                          ...oldProfile,
                          ...updatedUserProfile
                        }));
                        if (isFormUnsaved) handleFormChange();
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </fieldset>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!['unsaved', 'error'].includes(status)}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit().then();
            }}
          >
            Update Profile
          </Button>
        </Box>
      </form>
      <PaymentModal
        open={showModal === 'payment'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          document.location.href = '/payment/registration';
        }}
      />
      <UploadsModal
        open={showModal === 'uploads'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          uploadFilesRef.current?.click();
        }}
      />
    </>
  );
}

export default ProfileEditor;

interface ProfileUploadFormProps {
  filename: string,
  userProfile: UserTableRow,
  uploadHooks: { [filename: string]: FormHookObject<UserFileUploadDescription> },

  onUpdate(updatedUserRow: UserTableRow, isFormUnsaved: boolean): void,

  // onFileDeleted(): void,

  deleteFile(filename: string): Promise<UserTableRow>,

  status: 'ready' | 'unsaved' | 'updating' | 'error'
}

function ProfileUploadForm({
  filename,
  userProfile,
  uploadHooks,
  onUpdate,
  // onFileDeleted,
  deleteFile,
  status
}: ProfileUploadFormProps) {
  const uploadInfo = userProfile.uploads[filename];
  const formUpload = useFormHook(
    uploadInfo,
    (updatedUploadInfo) => {
      const uploads = { ...userProfile.uploads };
      uploads[filename] = updatedUploadInfo;
      onUpdate({
        ...userProfile,
        uploads
      }, true);
    },
    status === 'error'
  );
  // eslint-disable-next-line no-param-reassign
  uploadHooks[filename] = formUpload;
  return (
    <TableRow
      key={filename}
    >
      <TableCell component="th" scope="row" sx={{ verticalAlign: 'top' }}>
        <Stack spacing={2}>
          <TextField
            required
            helperText="Title this image"
            placeholder="Title this image..."
            {...formUpload.setupInput('title', 'Title', 'required')}
          />
          <TextField
            multiline
            minRows={4}
            helperText="Describe this image"
            placeholder="Describe this image..."
            {...formUpload.setupInput('description', 'Description')}
            slotProps={{
              htmlInput: {
                maxLength: 600,
              },
              inputLabel: {
                shrink: true
              }
            }}
          />
          <div>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ float: 'right' }}
              onClick={async () => {
                // eslint-disable-next-line no-alert
                if (!window.confirm(
                  `Are you sure you want to permanently delete this file: ${filename}`
                )) return;
                const userRow = await deleteFile(filename);
                onUpdate(userRow, false);
              }}
            >
              Delete Image
            </Button>
          </div>
        </Stack>
      </TableCell>
      <TableCell sx={{ position: 'relative', width: '50%' }}>
        {uploadInfo.url && (
        <Link href={uploadInfo.url} target="_blank" rel="noreferrer">
          <ReloadingImage
            loading="lazy"
            src={uploadInfo.url}
            alt={filename}
            width={uploadInfo.width}
            height={uploadInfo.height}
            style={{
              height: 'auto'
            }}
          />
        </Link>
        )}
      </TableCell>
    </TableRow>
  );
}

const LIST_STATES = {
  // "": "",
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

const LIST_CATEGORIES = [
  'Painting', // Includes oil, acrylic, watercolor, etc.
  'Sculpture', //  Includes classical, modern, assemblage, and other 3D forms
  'Photography', // Includes various styles and techniques
  'Printmaking', //  Covers etching, lithography, woodcut, and other print methods
  'Drawing', //  Includes dry media like charcoal, pastels, pencil, etc.
  'Ceramics', // Original clay and porcelain work
  'Mixed Media', //  Art using a combination of materials and techniques
  'Jewelry', //  Artistic jewelry pieces
  'Fibers/Textiles',
  'Leather',
  'Glass',
  'Metals',
  'Woodworking',
];
