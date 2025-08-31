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

import { SelectField, TextField, useFormHook } from '@components/FormFields';
import type { AlertColor } from '@mui/material/Alert';
import Link from 'next/link';
import ReloadingImage from '@components/Image/ReloadingImage';
import { getProfileStatus, IProfileStatus } from '@util/profile';
import PaymentModal from '@components/Modal/PaymentModal';
import UploadsModal from '@components/Modal/UploadsModal';
import { UserFileUploadModel, UserModel } from '@util/models';
import { InferAttributes } from 'sequelize';

export interface ProfileEditorProps {
  userProfile: UserModel,
  // isProfileComplete: [boolean, string],

  updateProfile(newUserProfile: InferAttributes<UserModel>): Promise<{ status: IProfileStatus }>

  uploadFile(file: File): Promise<{ status: IProfileStatus }>

  updateFile(file: InferAttributes<UserFileUploadModel>): Promise<{ status: IProfileStatus }>

  deleteFile(fileID: number): Promise<{ status: IProfileStatus }>
}

function ProfileEditor({
  userProfile: userProfileServer,
  updateProfile,
  uploadFile,
  updateFile,
  deleteFile
}: ProfileEditorProps) {
  const [showModal, setShowModal] = useState<'none' | 'payment-registration' | 'payment-booth' | 'uploads'>('none');
  const [userProfileClient, setUserProfileClient] = useState<UserModel>(userProfileServer);
  const {
    status: isProfileComplete,
    message: profileCompletionMessage,
  } = getProfileStatus(userProfileClient);
  const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(
    isProfileComplete
      ? ['success', profileCompletionMessage]
      : ['info', profileCompletionMessage || 'Please complete your artist profile.']
  );
  // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
  // const formRef = useRef<HTMLFormElement>();
  const { uploads: profileUploads = [] } = userProfileClient;
  // const formUploadList: { [fileID: number]: FormHookObject<UserFileUploadModel> } = {};
  const formRef = useRef<HTMLFormElement>(null);
  const uploadFilesRef = useRef<HTMLInputElement>(null);

  const formInfo = useFormHook(
    userProfileClient,
    (formData, isFormUnsaved) => {
      setUserProfileClient((oldUserProfile) => (
        { ...oldUserProfile, ...formData } as UserModel));
      if (isFormUnsaved) {
        handleFormChange();
      }
    // setMessage('')
    },
    status === 'error'
  );
  const {
    formData: {
      category: categoryInput,
    }
  } = formInfo;

  function handleUserProfileUpdate(newStatus: IProfileStatus) {
    const {
      status: isUpdatedProfileComplete,
      message: isUpdatedProfileCompleteMessage
    } = getProfileStatus(userProfileClient);
    setStatus('ready');
    setMessage([isUpdatedProfileComplete ? 'success' : 'info', isUpdatedProfileCompleteMessage]);
    // setUserProfileClient((oldProfile) => ({
    //   ...oldProfile,
    //   ...updatedUserProfile
    // }));
    if (profileUploads.length === 0) {
      setShowModal('uploads');
    } else if (isUpdatedProfileComplete) {
      switch (newStatus.action) {
        case 'pay-fee-registration':
          setShowModal('payment-registration');
          break;
        case 'pay-fee-booth':
          setShowModal('payment-booth');
          break;
        default:
          break;
      }
    }
  }

  const handleSubmit = async () => {
    // Validation
    // const allForms = [formInfo, ...Object.values(formUploadList)];
    // for (let i = 0; i < allForms.length; i++) {
    //   const form = allForms[i];
    //   const { firstError } = form;
    //   if (firstError) {
    //     const { message: firstErrorMessage, scrollToField } = firstError;
    //     setStatus('error');
    //     setMessage(['error', firstErrorMessage]);
    //     scrollToField();
    //     return;
    //   }
    // }

    // Submit to server
    setStatus('updating');
    setMessage(['info', 'Submitting form...']);
    try {
      // userProfileClient.uploads = profileUploads;
      const { status: updatedStatus } = await updateProfile(userProfileClient);
      handleUserProfileUpdate(updatedStatus);
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

  const fileUploadCount = profileUploads.length;

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
                      setStatus('updating');
                      setMessage(['info', `Uploading ${input.files.length} files...`]);
                      let lastStatus: IProfileStatus | undefined;
                      await Promise.all(Array.from(input.files).map(async (file) => {
                        lastStatus = (await uploadFile(file)).status;
                        count += 1;
                      }));
                      setStatus('ready');
                      e.target.value = '';
                      if (count === 0) {
                        setMessage(['error', 'There was an error uploading your files.']);
                        return;
                      }

                      if (lastStatus) handleUserProfileUpdate(lastStatus);

                      setMessage(['success', `${count} file${count === 1 ? '' : 's'} have been uploaded`]);
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
                {profileUploads.map((fileUpload) => (
                  <ProfileUploadForm
                    key={fileUpload.id}
                    fileUpload={fileUpload}
                    // uploadHooks={formUploadList}
                    deleteFile={deleteFile}
                    updateFile={updateFile}
                    status={status}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </fieldset>
      </Box>
      <PaymentModal
        text="Please pay the registration fee to submit your registration for review."
        title="Your Profile is complete."
        open={showModal === 'payment-registration'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          document.location.href = '/payment/registration';
        }}
      />
      <PaymentModal
        text="Please pay the booth fee to complete your registration."
        title="Your Artist Profile has been Approved."
        open={showModal === 'payment-booth'}
        onClose={() => setShowModal('none')}
        onClick={() => {
          setShowModal('none');
          document.location.href = '/payment/booth';
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
  fileUpload: UserFileUploadModel
  // uploadHooks: { [fileID: number]: FormHookObject<UserFileUploadModel> },

  updateFile(updatedFile: InferAttributes<UserFileUploadModel>): void,

  // onFileDeleted(): void,

  deleteFile(fileID: number): Promise<{ status: IProfileStatus }>,

  status: 'ready' | 'unsaved' | 'updating' | 'error'
}

function ProfileUploadForm({
  fileUpload,
  // uploadHooks,
  updateFile,
  // onFileDeleted,
  deleteFile,
  status
}: ProfileUploadFormProps) {
  const formUpload = useFormHook(
    fileUpload,
    updateFile,
    status === 'error'
  );
  // eslint-disable-next-line no-param-reassign
  // uploadHooks[fileUpload.id] = formUpload;
  return (
    <TableRow
      key={fileUpload.id}
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
                  `Are you sure you want to permanently delete this file: ${fileUpload.id}`
                )) return;
                await deleteFile(fileUpload.id);
              }}
            >
              Delete Image
            </Button>
          </div>
        </Stack>
      </TableCell>
      <TableCell sx={{ position: 'relative', width: '50%' }}>
        {fileUpload.url && (
        <Link href={fileUpload.url} target="_blank" rel="noreferrer">
          <ReloadingImage
            loading="lazy"
            src={fileUpload.url}
            alt={fileUpload.title}
            width={fileUpload.width}
            height={fileUpload.height}
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
