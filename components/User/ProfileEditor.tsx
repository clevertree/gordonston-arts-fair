'use client';

import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, MenuItem, Stack, Typography} from '@mui/material';

import {SelectField, TextField, useFormHook} from '@components/FormFields';
import type {AlertColor} from '@mui/material/Alert';
import {IProfileStatus, IProfileStatusAction} from '@util/profile';
import PaymentModal from '@components/Modal/PaymentModal';
import UploadsModal from '@components/Modal/UploadsModal';
import {UserModel} from '@util/models';
import {InferAttributes} from 'sequelize';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

export interface ProfileEditorProps {
    profileStatus: IProfileStatus,
    userProfile: UserModel,
    adminMode?: boolean,

    // updateFile(file: InferAttributes<UserFileUploadModel>): Promise<{
    //     result: IProfileStatus, message: string
    // }>

    // deleteFile(fileID: number): Promise<{ result: IProfileStatus, message: string }>

    updateProfile(newUserProfile: InferAttributes<UserModel>): Promise<{
        result: IProfileStatus, message: string
    }>
}

function ProfileEditor({
                           profileStatus,
                           userProfile: userProfileServer,
                           adminMode = false,
                           updateProfile,
                       }: ProfileEditorProps) {
    const [showModal, setShowModal] = useState<'none' | IProfileStatusAction>('none');
    const [userProfileClient, setUserProfileClient] = useState<UserModel>(userProfileServer);
    const [status, setStatus] = useState<'ready' | 'unsaved' | 'updating' | 'error'>('ready');
    const [message, setMessage] = useState<[AlertColor, string]>(
        profileStatus.complete
            ? ['success', profileStatus.message]
            : ['info', profileStatus.message || 'Please complete your artist profile.']
    );
    // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
    // const formRef = useRef<HTMLFormElement>();
    const {
        category: categoryInput,
    } = userProfileClient;

    const firstRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const formInfo = useFormHook({
        formData: userProfileClient,
        defaultFormData: userProfileServer,
        setFieldValue: (fieldName, value) => {
            setUserProfileClient((oldUserProfile) => (
                {...oldUserProfile, [fieldName]: value} as UserModel));
        },
        showError: status === 'error'
    });

    const router = useRouter();

    // Check for unsaved data
    useEffect(() => {
        if (status === 'ready' && formInfo.hasUnsavedData) {
            setStatus('unsaved');
        } else if (status === 'unsaved' && !formInfo.hasUnsavedData) {
            setStatus('ready');
        }
    }, [formInfo.hasUnsavedData, status]);

    useEffect(() => {
        if (firstRef.current) {
            firstRef.current.focus();
        }
    }, [firstRef]);

    const handleSubmit = async () => {
        // Validation
        // const allForms = [formInfo, ...Object.values(formUploadList)];
        // for (let i = 0; i < allForms.length; i++) {
        const {firstError} = formInfo;
        if (firstError) {
            const {message: firstErrorMessage, scrollToField} = firstError;
            setStatus('error');
            setMessage(['error', firstErrorMessage]);
            scrollToField();
            return;
        }
        // }

        // Submit to server
        setStatus('updating');
        setMessage(['info', 'Submitting form...']);
        try {
            // userProfileClient.uploads = profileUploads;
            const {
                result: {
                    complete: isUpdatedProfileComplete,
                    message: isUpdatedProfileCompleteMessage,
                    action
                }
            } = await updateProfile(userProfileClient);
            setStatus('ready');
            if (adminMode) {
                setMessage(['success', "Artist profile updated successfully."]);

            } else {
                setMessage([isUpdatedProfileComplete ? 'success' : 'info', isUpdatedProfileCompleteMessage]);
                if (action) {
                    setShowModal(action);
                }
            }
        } catch (e: unknown) {
            setStatus('ready');
            setMessage(['error', (e as Error).message]);
        }
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    return (
        <>
            <form
                id="profile-editor-form"
                method="post"
                ref={formRef}
                onSubmit={async (e: FormEvent<HTMLFormElement>) => {
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
                    {adminMode && (
                        <Alert severity="warning">
                            Admin mode: You are editing this profile on behalf of the user.
                        </Alert>
                    )}
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
                            inputRef={firstRef}
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
                            sx={{
                                width: '100%'
                            }}
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

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!formInfo.hasUnsavedData}
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
                    display: adminMode ? 'none' : 'flex',
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
                    Upload images
                </Typography>

                <Stack spacing={2}>
                    <Link href="/profile/upload">
                        Click here to Upload images
                    </Link>
                </Stack>
            </Box>

            <PaymentModal
                text="Please pay the registration fee to submit your registration for review."
                title="Your Profile is complete."
                open={showModal === 'pay-fee-registration'}
                onClose={() => setShowModal('none')}
                onClick={() => {
                    setShowModal('none');
                    router.push('/payment/registration');
                }}
            />
            <PaymentModal
                text="Please pay the booth fee to complete your registration."
                title="Your Artist Profile has been Approved."
                open={showModal === 'pay-fee-booth'}
                onClose={() => setShowModal('none')}
                onClick={() => {
                    setShowModal('none');
                    router.push('/payment/booth');
                }}
            />
            <UploadsModal
                open={showModal === 'upload-files'}
                onClose={() => setShowModal('none')}
                onClick={() => {
                    setShowModal('none');
                    router.push('/profile/upload');
                }}
            />
        </>
    );
}

export default ProfileEditor;

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
