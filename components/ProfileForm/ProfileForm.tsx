'use client'

import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    TextFieldProps,
    Typography
} from '@mui/material';
import {UserProfileData} from "@util/profile";

interface ProfileFormProps {
}

function ProfileForm({}: ProfileFormProps) {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'unsaved' | 'updating' | 'updated' | 'error'>('loading');
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState<UserProfileData>({})
    const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
    const formRef = useRef<HTMLFormElement>();

    function getFormValues() {
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            return Object.fromEntries(formData.entries());
        }
        return {};
    }

    function updateFormStatus() {
        const formData = new FormData(formRef.current);
        let unsaved = false;
        for (const [key, value] of formData.entries()) {
            console.log('entry', key, value)
            // console.log(`${key}: ${value}`);
            if (profileData[key as keyof UserProfileData] !== value) {
                unsaved = true;
            }
        }
        setStatus(unsaved ? 'unsaved' : 'loaded');

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
                if (profileData.category && !categoryList.includes(profileData.category)) {
                    setCategoryList([...categoryList, profileData.category])
                }
                setProfileData(profileData)
                setStatus('loaded')
            })
    }, []);

    const handleSubmit = async (event: any) => {

        const formValues: UserProfileData = getFormValues();
        event.preventDefault();
        setStatus('updating');
        setError('');

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formValues),
            })
            // Check if the response was successful (e.g., status code 200-299)
            if (!response.ok) {
                setError(`HTTP error! status: ${response.status}`);
                setStatus('error');
            } else {
                setStatus('updated');
            }
        } catch (e: any) {
            setStatus('error');
            setError(e.message)
        }
    };

    const textFieldProps: TextFieldProps = {
        fullWidth: true,
        variant: 'outlined',
        slotProps: {
            inputLabel: {
                shrink: true
            }
        },
        onBlur: updateFormStatus
    }

    if (status === "loading") {
        return <Box>
            Loading Profile Form...
        </Box>
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            ref={formRef}
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
                    defaultValue={profileData.firstName}
                    fullWidth
                    helperText="Please enter your first name"
                    {...textFieldProps}
                />
                <TextField
                    name='lastName'
                    label="Last Name"
                    required
                    defaultValue={profileData.lastName}
                    helperText="Please enter your last name"
                    {...textFieldProps}
                />
                <TextField
                    name='companyName'
                    label="Company Name"
                    defaultValue={profileData.companyName}
                    helperText="Optional company name"
                    {...textFieldProps}
                />
            </fieldset>
            <fieldset disabled={status === 'updating'} className='grid md:grid-cols-3 gap-4'>
                <TextField
                    name='phone'
                    label="Primary Phone"
                    required
                    defaultValue={profileData.phone}
                    helperText="Primary Phone (i.e. home)"
                    {...textFieldProps}
                />
                <TextField
                    name='phone2'
                    label="Contact Phone"
                    defaultValue={profileData.phone2}
                    helperText="Contact Phone (i.e. cell)"
                    {...textFieldProps}
                />
                <TextField
                    name='website'
                    label="Website"
                    defaultValue={profileData.website}
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
                    defaultValue={profileData.address}
                    placeholder='123 Art st.'
                    helperText="Enter your Address"
                    {...textFieldProps}
                />
                <TextField
                    name='city'
                    label="City"
                    required
                    defaultValue={profileData.city}
                    placeholder='Savannah'
                    helperText="Enter your city name"
                    {...textFieldProps}
                />
                <FormControl fullWidth>
                    <InputLabel required id="state-label">State</InputLabel>
                    <Select
                        name='state'
                        labelId="state-label"
                        value={profileData.state}
                        required
                        label="State"
                        onChange={updateFormStatus}
                    >
                        {LIST_STATES.map(state => (
                            <MenuItem key={state} value={state}>{state}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select your state</FormHelperText>
                </FormControl>
                <TextField
                    name='zip'
                    label="Zipcode"
                    required
                    defaultValue={profileData.zip}
                    placeholder='Savannah'
                    helperText="Enter your zipcode"
                    {...textFieldProps}
                />
            </fieldset>
            <Typography variant="h6">
                Exhibit Information
            </Typography>
            <fieldset disabled={status === 'updating'}>
                <FormControl fullWidth>
                    <InputLabel required id="category-label">Category</InputLabel>
                    <Select
                        name='category'
                        labelId="category-label"
                        required
                        defaultValue={profileData.category}
                        label="Category"
                        onChange={(e) => {
                            let category = e.target.value;
                            if (category === 'Custom') {
                                category = prompt("Please enter a custom art category") || '';
                                if (category) {
                                    setCategoryList(list => ([...list, category]));
                                }
                            }
                            updateFormStatus()
                        }}
                    >
                        {categoryList.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
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
                    defaultValue={profileData.description}
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
                Manage Images
            </Typography>

            <fieldset disabled={status === 'updating'} className='grid md:grid-cols-3 gap-4'>
                <input
                    name='uploads'
                    type='file'
                    multiple={true}
                    accept="image/*"
                    onChange={e => {
                        console.log(e)
                        const input = e.target;
                        if (input && input.files) {
                            for (const file of input.files) {
                                fetch(
                                    `/api/profile/upload?entry=0&filename=${file.name}&mimetype=${file.type}`,
                                    {
                                        method: 'POST',
                                        body: file,
                                    },
                                ).then(response => response.json())
                                    .then(responseJSON => {
                                        console.log('responseJSON', responseJSON)
                                    })
                            }
                        }
                    }}
                />
            </fieldset>


            {error && <Typography variant="caption" color="red" align="center">
                {error}
            </Typography>}
            {status === 'updated' && <Typography variant="caption" color="blue" align="center">
                Profile has been updated successfully
            </Typography>}
            <Button type="submit" variant="contained" color="primary" disabled={status !== 'unsaved'}>
                Update Profile
            </Button>
        </Box>
    );
}

export default ProfileForm;


const LIST_STATES = ['', 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
const LIST_CATEGORIES = [
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
