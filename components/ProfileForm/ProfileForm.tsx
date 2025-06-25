'use client'

import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    Stack,
    TextField,
    TextFieldProps,
    Typography
} from '@mui/material';
import {UserProfile, UserProfileInfo, UserProfileUpload} from "@util/profile";

interface ProfileFormProps {
}

function ProfileForm({}: ProfileFormProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'unsaved' | 'updating' | 'updated' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [profileData, setProfileData] = useState<UserProfile>({info: {}, uploads: {}})
    // const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
    const formRef = useRef<HTMLFormElement>();
    const {uploads: profileUploads = {}, info: profileInfo = {}} = profileData;

    function getFormData() {
        const formData = new FormData(formRef.current);
        const profileData: UserProfile = {info: {}, uploads: {}}
        for (const entry of formData.entries()) {
            const [fieldName, value] = entry;
            const split = fieldName.split(/:/g);
            switch (split[0]) {
                case 'uploads':
                    const [, filename, key] = split;
                    if (!profileData.uploads[filename])
                        profileData.uploads[filename] = {
                            title: filename
                        };
                    profileData.uploads[filename][key as keyof UserProfileUpload] = value + '';
                    break;
                default:
                    profileData.info[fieldName as keyof UserProfileInfo] = `${value}`
                    break;
            }
        }
        return profileData;
    }

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
                setProfileData(profileData)
                setStatus('loaded')
            })
    }, []);

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (!formRef.current) {
            setStatus('error');
            setMessage("Invalid Form Ref")
            return;
        }

        try {
            const profileData = getFormData();
            event.preventDefault();
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

    const textFieldProps: TextFieldProps = {
        fullWidth: true,
        variant: 'outlined',
        slotProps: {
            inputLabel: {
                // shrink: true
            }
        },
        onChange: handleFormChange
        // onBlur: updateFormStatus
    }

    if (status === "loading") {
        return <Box>
            Loading Profile Form...
        </Box>
    }


    return (
        <form
            ref={(formElm) => {
                if (formElm) formRef.current = formElm
            }}
            onSubmit={handleSubmit}
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
                        name='firstName'
                        label="First Name"
                        required
                        defaultValue={profileInfo.firstName}
                        fullWidth
                        helperText="Please enter your first name"
                        {...textFieldProps}
                    />
                    <TextField
                        name='lastName'
                        label="Last Name"
                        required
                        defaultValue={profileInfo.lastName}
                        helperText="Please enter your last name"
                        {...textFieldProps}
                    />
                    <TextField
                        name='companyName'
                        label="Company Name"
                        defaultValue={profileInfo.companyName}
                        helperText="Optional company name"
                        {...textFieldProps}
                    />
                </fieldset>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-3 gap-4'>
                    <TextField
                        name='phone'
                        label="Primary Phone"
                        required
                        defaultValue={profileInfo.phone}
                        helperText="Primary Phone (i.e. home)"
                        {...textFieldProps}
                    />
                    <TextField
                        name='phone2'
                        label="Contact Phone"
                        defaultValue={profileInfo.phone2}
                        helperText="Contact Phone (i.e. cell)"
                        {...textFieldProps}
                    />
                    <TextField
                        name='website'
                        label="Website"
                        defaultValue={profileInfo.website}
                        placeholder='myartsite.com'
                        helperText="Artist Website"
                        {...textFieldProps}
                    />
                </fieldset>
                <fieldset disabled={status === 'updating'} className='grid md:grid-cols-4 gap-4'>
                    <TextField
                        name='address'
                        label="Address"
                        required
                        defaultValue={profileInfo.address}
                        placeholder='123 Art st.'
                        helperText="Enter your Address"
                        {...textFieldProps}
                    />
                    <TextField
                        name='city'
                        label="City"
                        required
                        defaultValue={profileInfo.city}
                        placeholder='Savannah'
                        helperText="Enter your city name"
                        {...textFieldProps}
                    />

                    <FormControl required fullWidth>
                        <InputLabel id="state-label">State</InputLabel>
                        <Select
                            native
                            name='state'
                            labelId="state-label"
                            defaultValue={profileInfo.state}
                            required
                            label="State"
                        >
                            <option disabled value=''>Select a state</option>
                            <option value=''></option>
                            {Object.entries(LIST_STATES).map(([state, name]) => (
                                <option
                                    key={state}
                                    value={state}
                                    selected={state === profileInfo.state}
                                >{name}</option>
                            ))}
                        </Select>
                        <FormHelperText>Select your art category</FormHelperText>
                    </FormControl>
                    <TextField
                        name='zip'
                        label="Zipcode"
                        required
                        defaultValue={profileInfo.zip}
                        placeholder='Savannah'
                        helperText="Enter your zipcode"
                        {...textFieldProps}
                    />
                </fieldset>
                <Typography variant="h6">
                    Exhibit Information
                </Typography>
                <fieldset disabled={status === 'updating'}>
                    <FormControl required fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            native
                            name='category'
                            labelId="category-label"
                            defaultValue={profileInfo.category}
                            label="Category"
                            required
                            onChange={(e) => {
                                const select = e.target as HTMLSelectElement;
                                let category = select.value;
                                if (category === 'Custom') {
                                    category = prompt("Please enter a custom art category") || '';
                                    if (category) {
                                        const newOption = document.createElement("option");
                                        newOption.value = category;
                                        newOption.textContent = category;
                                        select.appendChild(newOption);
                                        select.value = category;
                                    }
                                }
                                handleFormChange();
                            }}
                        >
                            <option disabled value=''>Select a category</option>
                            <option value=''></option>
                            {LIST_CATEGORIES.map(category => (
                                <option
                                    key={category}
                                    value={category}
                                    selected={category === profileInfo.category}
                                >{category}</option>
                            ))}
                            {profileInfo.category && !LIST_CATEGORIES.includes(profileInfo.category) && <option
                                key={profileInfo.category}
                                value={profileInfo.category}
                                selected={true}
                            >{profileInfo.category}</option>}
                        </Select>
                        <FormHelperText>Select your art category</FormHelperText>
                    </FormControl>
                </fieldset>
                <fieldset disabled={status === 'updating'}>
                    <TextField
                        name='description'
                        label="Description"
                        required
                        multiline
                        minRows={4}
                        defaultValue={profileInfo.description}
                        placeholder='Information about my exhibit...'
                        helperText="Describe your exhibit"
                        {...textFieldProps}
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
                                        name={`uploads:${filename}:title`}
                                        label="Title"
                                        required
                                        defaultValue={profileUploads[filename].title}
                                        placeholder='Title this image...'
                                        {...textFieldProps}
                                    />
                                    <TextField
                                        name={`uploads:${filename}:description`}
                                        label="Description"
                                        multiline
                                        minRows={4}
                                        defaultValue={profileUploads[filename].description}
                                        placeholder='Describe this image...'
                                        {...textFieldProps}
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
                <Button type="submit" variant="contained" color="primary" disabled={status !== 'unsaved'}>
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
    // '',
    'Custom',
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
