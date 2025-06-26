'use client'

import React, {useEffect, useState} from 'react';
import {Box, Button, MenuItem, Stack, TextField, Typography} from '@mui/material';
import {UserProfile} from "@util/profile";
import SelectField from "@components/Form/SelectField";
import {useFormHook, validatePhone} from "@components/Form/formHooks";

interface ProfileFormProps {
    redirectNoSessionURL: string
}

function ProfileForm({
                         redirectNoSessionURL
                     }: ProfileFormProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'unsaved' | 'updating' | 'updated' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [profileData, setProfileData] = useState<UserProfile>({info: {}, uploads: {}})
    // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
    // const formRef = useRef<HTMLFormElement>();
    const {uploads: profileUploads = {}, info: profileInfo = {}} = profileData;

    const formInfo = useFormHook(profileData.info, (formData) => {
        setProfileData(oldData => ({...oldData, info: formData}));
        setStatus('unsaved');
        setMessage('')
    }, status === 'error');
    const formUploads = useFormHook(profileData.uploads, (formData) => {
        setProfileData(oldData => ({...oldData, uploads: formData}));
        setStatus('unsaved');
        setMessage('')
    }, status === 'error');

    useEffect(() => {
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(async ({profileData, isProfileComplete}) => {
                // if (profileData.category && !categoryList.includes(profileData.category)) {
                //     setCategoryList([...categoryList, profileData.category])
                // }
                if (profileData) {
                    setProfileData(profileData)
                    setStatus('loaded')
                } else {
                    setStatus('error')
                    setMessage('Unable to load profile. Please log in')
                    setTimeout(() => {
                        document.location.href = redirectNoSessionURL || '/login'
                    }, 3000)
                }
            })
    }, []);

    const handleSubmit = async () => {
        // Validation
        for (const form of [formInfo, formUploads]) {
            if (!form.isValidated && form.firstError) {
                const {getRef, message} = form.firstError;
                const inputElm = getRef()
                inputElm.scrollIntoView({behavior: 'smooth', block: 'center'}); // Optional: Add smooth scrolling
                inputElm.focus()
                setStatus('error');
                setMessage(message)
                return;
            }
        }

        // Submit to server
        try {
            // const {profileData} = validateForm(formRef.current);
            setStatus('updating');
            setMessage('');

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData),
            })
            // Check if the response was successful (e.g., status code 200-299)
            const {error, message} = await response.json();
            if (!response.ok) {
                setMessage(error || `HTTP error! status: ${response.status}`);
                setStatus('error');
                debugger;
            } else {
                setStatus('updated');
                setMessage(message)
            }
        } catch (e: any) {
            console.error(e);
            setStatus('error');
            setMessage(e.message)
        }
    };

    function handleFormChange() {
        switch (status) {
            case 'error':
            case 'updated':
            case 'loaded':
                setMessage('');
                setStatus('unsaved');
                break;
        }
    }


    if (status === "loading") {
        return <Box>
            Loading Profile Form...
        </Box>
    }


    return (
        <form
            onSubmit={(e: any) => {
                e.preventDefault();
                handleSubmit()
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
                <Typography variant="h6" id='step1'>
                    Contact Information
                </Typography>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-3 gap-4'>
                    <TextField
                        helperText="Please enter your first name"
                        {...formInfo.setupRequiredInput('firstName', 'First Name')}
                    />
                    <TextField
                        helperText="Please enter your first name"
                        {...formInfo.setupRequiredInput('lastName', 'Last Name')}
                    />
                    <TextField
                        helperText="Optional company name"
                        {...formInfo.setupInput('companyName', "Company Name")}
                    />
                </fieldset>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-3 gap-4'>
                    <TextField
                        helperText="Primary Phone (i.e. home)"
                        {...formInfo.setupRequiredInput('phone', "Primary Phone", validatePhone)}
                    />
                    <TextField
                        helperText="Contact Phone (i.e. cell)"
                        {...formInfo.setupInput('phone2', "Contact Phone")}
                    />
                    <TextField
                        helperText="Artist Website"
                        {...formInfo.setupInput('website', "Website")}
                    />
                </fieldset>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-4 gap-4'>
                    <TextField
                        helperText="Enter your Address"
                        placeholder='123 Art st.'
                        {...formInfo.setupRequiredInput('address', "Address")}
                    />
                    <TextField
                        helperText="Enter your city name"
                        placeholder='Savannah'
                        {...formInfo.setupRequiredInput('city', "City")}
                    />

                    <SelectField
                        helperText="Enter your state"
                        {...formInfo.setupRequiredInput('state', "State")}
                    >
                        <MenuItem disabled value=''>Select a state</MenuItem>
                        <MenuItem value=''></MenuItem>
                        {Object.entries(LIST_STATES).map(([state, name]) => (
                            <MenuItem
                                key={state}
                                value={state}
                                selected={state === profileInfo.state}
                            >{name}</MenuItem>
                        ))}
                    </SelectField>
                    <TextField
                        helperText="Enter your zipcode"
                        placeholder='Savannah'
                        {...formInfo.setupRequiredInput('zip', "Zipcode")}
                    />
                </fieldset>
                <Typography variant="h6">
                    Exhibit Information
                </Typography>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-2 gap-4'>
                    <SelectField
                        fullWidth
                        {...formInfo.setupRequiredInput('category', "Category")}
                    >
                        <MenuItem disabled value=''>Select a category</MenuItem>
                        {LIST_CATEGORIES.map(category => (
                            <MenuItem
                                key={category}
                                value={category}
                            >{category}</MenuItem>
                        ))}
                        {profileInfo.category && !LIST_CATEGORIES.includes(profileInfo.category) && <MenuItem
                            key={profileInfo.category}
                            value={profileInfo.category}
                        >{profileInfo.category}</MenuItem>}
                    </SelectField>
                    <Button
                        onClick={(e) => {
                            const category = prompt("Please enter a custom art category") || '';
                            if (category) {
                                formInfo.setFieldValue('category', category);
                            }
                        }}>
                        Custom Category
                    </Button>
                </fieldset>
                <fieldset disabled={status === 'updating'}>
                    <TextField
                        multiline
                        minRows={4}
                        helperText="Describe your exhibit"
                        placeholder='Information about my exhibit...'
                        {...formInfo.setupRequiredInput('description', "Description")}
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
                            <Button variant="outlined"
                                    component="span"
                                    color="secondary"
                            >
                                Click here to Upload multiple images
                            </Button>
                            <input
                                style={{display: "none"}}
                                id='file-upload-multiple'
                                type='file'
                                multiple={true}
                                accept="image/*"
                                onChange={async e => {
                                    setMessage('');
                                    setStatus('updating')
                                    const input = e.target;
                                    let count = 0;
                                    let updatedProfileData: UserProfile | null = null
                                    if (input && input.files) {
                                        for (const file of input.files) {
                                            console.log("Uploading file: ", file)
                                            const response = await fetch(
                                                `/api/profile/upload?filename=${file.name}&mimetype=${file.type}`,
                                                {
                                                    method: 'POST',
                                                    body: file,
                                                },
                                            );
                                            const {profileData} = await response.json();
                                            updatedProfileData = profileData;
                                            count++;
                                        }
                                    }
                                    setMessage(count + " file" + (count === 1 ? '' : 's') + ' have been uploaded')
                                    setStatus('updated')
                                    e.target.value = '';
                                    console.log('updatedProfileData', updatedProfileData);
                                    if (updatedProfileData) {
                                        setProfileData(updatedProfileData);
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
                    <Stack spacing={2}>
                        {Object.keys(profileUploads).map((filename: string, i) => <Box

                            key={filename + i}
                        >
                            <div className='grid sm:grid-cols-2 gap-x-8'>
                                <Stack spacing={2}>
                                    <TextField
                                        helperText="Title this image"
                                        placeholder='Title this image...'
                                        {...formUploads.setupRequiredInput(`uploads:${filename}:title`, "Title")}
                                    />
                                    <TextField
                                        multiline
                                        minRows={4}
                                        helperText="Describe this image"
                                        placeholder='Describe this image...'
                                        {...formUploads.setupRequiredInput(`uploads:${filename}:description`, "Description")}
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
                                        <Button variant="outlined" color="secondary"
                                                sx={{float: 'right'}}
                                                onClick={async () => {
                                                    console.log("Deleting file: ", filename)
                                                    const response = await fetch(
                                                        `/api/profile/upload/delete`,
                                                        {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                filename
                                                            }),
                                                        },
                                                    );
                                                    const {profileData} = await response.json();
                                                    setProfileData(profileData);
                                                }}>
                                            Delete Image
                                        </Button>
                                    </div>
                                </Stack>
                                <a
                                    href={profileUploads[filename].url}
                                    target='_blank'
                                >
                                    <img
                                        onError={(e: any) => {
                                            setTimeout(() => {
                                                e.target.src += '?&'
                                            }, 5000)
                                        }}
                                        loading='lazy'
                                        src={profileUploads[filename].url}
                                        alt={filename}
                                    />
                                </a>
                            </div>
                        </Box>)}
                    </Stack>
                </fieldset>

                {message && <Typography variant="caption" color={status === 'error' ? "red" : "blue"} align="center">
                    {message}
                </Typography>}
                <Button type="submit"
                        variant="contained"
                        color="primary"
                        disabled={status !== 'unsaved'}
                        onClick={(e) => {
                            if (!formInfo.isValidated || !formUploads.isValidated) {
                                const firstError = formInfo.firstError || formUploads.firstError;
                                if (!firstError)
                                    throw new Error("First error missing");
                                window.setTimeout(() => {
                                    setMessage(firstError.message);
                                    setStatus('error')
                                }, 50)
                            }
                        }}
                >
                    Update Profile
                </Button>
            </Box>
        </form>
    );
}

export default ProfileForm;


const LIST_STATES = {
    // "": "",
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

const LIST_CATEGORIES = [
    "Painting", // Includes oil, acrylic, watercolor, etc.
    "Sculpture", //  Includes classical, modern, assemblage, and other 3D forms
    "Photography", // Includes various styles and techniques
    "Printmaking", //  Covers etching, lithography, woodcut, and other print methods
    "Drawing", //  Includes dry media like charcoal, pastels, pencil, etc.
    "Ceramics", // Original clay and porcelain work
    "Textile Art", // Such as tapestries, quilts, and embroidery
    "Digital Art", //  Art created or manipulated using computer technology
    "Mixed Media", //  Art using a combination of materials and techniques
    "Installations", // Large-scale works that transform spaces
    "Video Art", //  Art in video format
    "Sound Art", //  Art incorporating sound
    "Performance Art", //  Art involving live performance
    "New Media Art", //  Art that utilizes new media technologies
    "Applied Arts", //  Art with practical applications
    "Design", //  Can include various design disciplines
    "Jewelry", //  Artistic jewelry pieces
    "Comic Art", //  Art related to comics
    "Film & Animation", //  Art in film and animation format
    "Emerging Artists", // Often a specific section focusing on new talent
    "Modern Art", // Art from a specific historical period
    "Contemporary Art", //  Art from the current era
    "Conceptual Art", // Art focused on ideas and concepts
    "Street Art", //  Art created in public spaces
    "Fine Craft", //  Contemporary crafts
    "Traditional Crafts" //  Country and traditional crafts
];
