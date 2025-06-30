'use client';

import React, { useState } from 'react';
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
import { UserProfile, UserProfileUpload } from '@util/profile';
import {
  FormFieldValues, FormHookObject, SelectField, TextField, useFormHook
} from '@components/FormFields';
import type { AlertColor } from '@mui/material/Alert';
import Link from 'next/link';
import ReloadingImage from '@components/Image/ReloadingImage';

interface ProfileEditorProps {
  userProfile: UserProfile,

  updateProfile(newUserProfile: UserProfile): Promise<UserProfile>

  uploadFile(file: File): Promise<UserProfile>

  deleteFile(filename: string): Promise<void>
}

function ProfileEditor({
  userProfile: userProfileServer,
  updateProfile,
  uploadFile,
  deleteFile
}: ProfileEditorProps) {
  const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
  const [userProfileClient, setUserProfileClient] = useState<UserProfile>(userProfileServer);
  // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
  // const formRef = useRef<HTMLFormElement>();
  const { uploads: profileUploads = {}, info: profileInfo = {} } = userProfileClient;
  const formUploadList: { [filename: string]: FormHookObject } = {};

  const formInfo = useFormHook(profileInfo as FormFieldValues, (formData) => {
    setUserProfileClient((oldData) => ({ ...oldData, info: formData }));
    handleFormChange();
    // setMessage('')
  }, status === 'error');

  const handleSubmit = async () => {
    // Validation
    const allForms = [formInfo, ...Object.values(formUploadList)];
    for (const form of allForms) {
      if (!form.isValidated && form.firstError) {
        const { getRef, message } = form.firstError;
        const inputElm = getRef();
        inputElm.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Optional: Add smooth scrolling
        inputElm.focus();
        setStatus('error');
        setMessage(['error', message]);
        return;
      }
    }

    // Submit to server
    try {
      // const {profileData} = validateForm(formRef.current);
      setStatus('updating');
      setMessage(['info', 'Submitting form...']);
      const updatedUserProfile = await updateProfile(userProfileClient);
      setStatus('ready');
      setMessage(['success', 'User profile updated successfully']);
      setUserProfileClient(updatedUserProfile);
    } catch (e: any) {
      console.error(e);
      setStatus('error');
      setMessage(['error', e.message]);
    }
  };

  function handleFormChange() {
    switch (status) {
      case 'ready':
        setMessage(['warning', 'Click "Update Profile" to save changes']);
        setStatus('unsaved');
        break;
    }
  }

  return (
    <form
      onChange={handleFormChange}
      onSubmit={(e: any) => {
        e.preventDefault();
        handleSubmit();
      }}
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
        <Typography variant="h6" id="step1">
          Contact Information
        </Typography>
        <fieldset disabled={status === 'updating'} className="grid md:grid-cols-3 gap-4">
          <TextField
            helperText="Please enter your first name"
            {...formInfo.setupInput('firstName', 'First Name', 'required')}
            required
          />
          <TextField
            helperText="Please enter your first name"
            {...formInfo.setupInput('lastName', 'Last Name', 'required')}
            required
          />
          <TextField
            helperText="Optional company name"
            {...formInfo.setupInput('companyName', 'Company Name')}
          />
        </fieldset>
        <fieldset disabled={status === 'updating'} className="grid md:grid-cols-3 gap-4">
          <TextField
            helperText="Primary Phone (i.e. home)"
            {...formInfo.setupInput('phone', 'Primary Phone', ['required', 'phone'])}
            autoFormat="phone"
            required
          />
          <TextField
            helperText="Contact Phone (i.e. cell)"
            {...formInfo.setupInput('phone2', 'Contact Phone', 'phone')}
            autoFormat="phone"
          />
          <TextField
            helperText="Artist Website"
            {...formInfo.setupInput('website', 'Website')}
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
            helperText="Enter your state"
            {...formInfo.setupInput('state', 'State', 'required')}
          >
            <MenuItem disabled value="">Select a state</MenuItem>
            {Object.entries(LIST_STATES).map(([state, name]) => (
              <MenuItem
                key={state}
                value={state}
                selected={state === profileInfo.state}
              >
                {name}
              </MenuItem>
            ))}
          </SelectField>
          <TextField
            helperText="Enter your zipcode"
            placeholder="31404"
            {...formInfo.setupInput('zip', 'Zipcode', 'required')}
            required
          />
        </fieldset>
        <Typography variant="h6">
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
            {profileInfo.category && !LIST_CATEGORIES.includes(profileInfo.category) && (
              <MenuItem
                key={profileInfo.category}
                value={profileInfo.category}
              >
                {profileInfo.category}
              </MenuItem>
            )}
          </SelectField>
          <Button
            variant="text"
            onClick={(e) => {
              const category = prompt('Please enter a custom art category') || '';
              if (category) {
                formInfo.setFieldValue('category', category);
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

        <Typography variant="h6">
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
                    let updatedProfileData: UserProfile | null = null;
                    setStatus('updating');
                    setMessage(['info', `Uploading ${input.files.length} files...`]);
                    for (const file of input.files) {
                      console.log('Uploading file: ', file);
                      updatedProfileData = await uploadFile(file);
                      count++;
                    }
                    setMessage(['success', `${count} file${count === 1 ? '' : 's'} have been uploaded`]);
                    setStatus('ready');
                    e.target.value = '';
                    if (updatedProfileData) {
                      setUserProfileClient(updatedProfileData);
                    }
                  }
                }}
              />
            </label>
          </Stack>
        </fieldset>

        <Typography variant="h6">
          Manage uploaded images
        </Typography>

        <fieldset disabled={status === 'updating'}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow
                  className="bg-green-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2"
                >
                  <TableCell colSpan={2}>
                    File uploads: {Object.keys(profileUploads).length}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(profileUploads).map((filename: string, i) => (
                  <ProfileUploadForm
                    key={filename}
                    filename={filename}
                    uploadInfo={profileUploads[filename]}
                    uploadHooks={formUploadList}
                    deleteFile={deleteFile}
                    onUpdate={(upload) => {
                        setUserProfileClient((oldData) => {
                          const uploads = { ...oldData.uploads };
                          delete uploads.url;
                          uploads[filename] = upload;
                          return { ...oldData, uploads };
                        });
                      }}
                    onFileDeleted={() => {
                        setUserProfileClient((oldData) => {
                          const uploads = { ...oldData.uploads };
                          delete uploads[filename];
                          setMessage(['success', `File deleted successfully: ${filename}`]);
                          return { ...oldData, uploads };
                        });
                      }}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </fieldset>
        {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!['unsaved', 'error'].includes(status)}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          Update Profile
        </Button>
      </Box>
    </form>
  );
}

export default ProfileEditor;

interface ProfileUploadFormProps {
  filename: string,
  uploadInfo: UserProfileUpload,
  uploadHooks: { [filename: string]: FormHookObject },

  onUpdate(upload: UserProfileUpload): void,

  onFileDeleted(): void,

  deleteFile(filename: string): Promise<void>
}

function ProfileUploadForm({
  filename,
  uploadInfo,
  uploadHooks,
  onUpdate,
  onFileDeleted,
  deleteFile
}: ProfileUploadFormProps) {
  const formUpload = useFormHook(uploadInfo as unknown as FormFieldValues, onUpdate);
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
                if (!window.confirm(`Are you sure you want to permanently delete this file: ${filename}`)) return;
                console.log('Deleting file: ', filename);
                await deleteFile(filename);
                onFileDeleted();
              }}
            >
              Delete Image
            </Button>
          </div>
        </Stack>
      </TableCell>
      <TableCell sx={{ position: 'relative', width: '20rem', height: '20rem' }}>
        {uploadInfo.url && (
        <Link href={uploadInfo.url} target="_blank" rel="noreferrer">
          <ReloadingImage
            loading="lazy"
            src={uploadInfo.url}
            alt={filename}
            width={300}
            height={300}
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
  'Textile Art', // Such as tapestries, quilts, and embroidery
  'Digital Art', //  Art created or manipulated using computer technology
  'Mixed Media', //  Art using a combination of materials and techniques
  'Installations', // Large-scale works that transform spaces
  'Video Art', //  Art in video format
  'Sound Art', //  Art incorporating sound
  'Performance Art', //  Art involving live performance
  'New Media Art', //  Art that utilizes new media technologies
  'Applied Arts', //  Art with practical applications
  'Design', //  Can include various design disciplines
  'Jewelry', //  Artistic jewelry pieces
  'Comic Art', //  Art related to comics
  'Film & Animation', //  Art in film and animation format
  'Emerging Artists', // Often a specific section focusing on new talent
  'Modern Art', // Art from a specific historical period
  'Contemporary Art', //  Art from the current era
  'Conceptual Art', // Art focused on ideas and concepts
  'Street Art', //  Art created in public spaces
  'Fine Craft', //  Contemporary crafts
  'Traditional Crafts', //  Country and traditional crafts
  'Graphics',
  'Wood',
  'Fibers/Textiles',
  'Leather',
  'Ceramic',
  'Glass',
  'Metalsmithing',
  'Ceramics/Enamel',
  'Metal',
  'Traditional Acrylic/Oil',
  'Conceptual Acrylic/Oil',
  'Watercolor',
  'Graphics/Drawing',
  'Multiple Images (digital & photography)',
  'Whimsical',
  'Clay',
  'Wearable Fibers',
  'Furniture',
  'Non-Wearable Fibers',
  'Photo',
  'Stone',
  'Oil on Canvas',
  'Pastel',
  'Iron',
  'Fiber',
  'Apparel',
  'Drawings/Pastels',
  'Traditional Photography',
  'Digital Photography',
  'Homemade - Describe your product in the Comments field.',
  'Other - Describe your product in the Comments field.',
  'Fine Art (watercolor, acrylic, oils, pencil)',
  'Food Vendor',
  'Soaps/Lotions',
  'Food Truck',
  'Fine Art',
  'Antiques',
  'Vintage Décor',
  'Woodworking',
  'Art',
  'Crafts',
  'Clothing',
  'Plants',
  'Fine Art (e.g., Dry-Wet Media, Pastel, Pencil, Oil, Digital, Mixed Media)',
  'Fine Craft (Glass)',
  'Fine Craft (Metal)',
  'Fine Craft (Wood)',
  'Fine Craft (Ceramics/Pottery)',
  'Fine Craft (Fiber/Clothing)'
];
