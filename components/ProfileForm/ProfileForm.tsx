'use client'

import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {UserProfileData} from "@util/profile";

interface ProfileFormProps {
}

function ProfileForm({}: ProfileFormProps) {
    const [loading, setLoading] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState<UserProfileData>({})
    const [categoryList, setCategoryList] = useState(LIST_CATEGORIES)
    console.log('profileData', profileData)
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        setUpdated(false);
        setError('');

        try {
            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData),
            })
            setLoading(false);
            // Check if the response was successful (e.g., status code 200-299)
            if (!response.ok) {
                setError(`HTTP error! status: ${response.status}`);
            } else {
                setUpdated(true);
            }
        } catch (e: any) {
            setLoading(false);
            setError(e.message)
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                padding: 3,
                border: '1px solid #ccc',
                borderRadius: 4,
            }}
        >
            <Typography variant="h6" align="center">
                Artist Profile
            </Typography>
            {error && <Typography variant="caption" color="red" align="center">
                {error}
            </Typography>}
            {updated && <Typography variant="caption" color="blue" align="center">
                Profile has been updated successfully
            </Typography>}
            <TextField
                label="First Name"
                variant="outlined"
                required
                value={profileData.firstName || ''}
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    firstName: e.target.value
                }))}
                fullWidth
            />
            <TextField
                label="Last Name"
                variant="outlined"
                required
                value={profileData.lastName || ''}
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    lastName: e.target.value
                }))}
                fullWidth
            />
            <TextField
                label="Company Name"
                variant="outlined"
                value={profileData.companyName || ''}
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    companyName: e.target.value
                }))}
                fullWidth
            />
            <TextField
                label="Primary Phone"
                variant="outlined"
                required
                value={profileData.phone || ''}
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    phone: e.target.value
                }))}
                helperText="Enter your Primary Phone (i.e. home)"
                fullWidth
            />
            <TextField
                label="Contact Phone"
                variant="outlined"
                value={profileData.phone2 || ''}
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    phone2: e.target.value
                }))}
                helperText="Enter your Contact Phone (i.e. cell)"
                fullWidth
            />
            <TextField
                label="Website"
                variant="outlined"
                value={profileData.website || ''}
                placeholder='myartsite.com'
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    website: e.target.value
                }))}
                fullWidth
                helperText="Enter your Artist Website"
            />
            <TextField
                label="Address"
                variant="outlined"
                required
                value={profileData.address || ''}
                placeholder='123 Art st.'
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    address: e.target.value
                }))}
                helperText="Enter your Address"
                fullWidth
            />
            <TextField
                label="City"
                variant="outlined"
                required
                value={profileData.city || ''}
                placeholder='Savannah'
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    city: e.target.value
                }))}
                helperText="Enter your city name"
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel required id="state-label">State</InputLabel>
                <Select
                    labelId="state-label"
                    value={profileData.state || ''}
                    required
                    label="State"
                    onChange={(e) => setProfileData(profile => ({
                        ...profile,
                        state: e.target.value
                    }))}
                >
                    {LIST_STATES.map(state => (
                        <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select your state</FormHelperText>
            </FormControl>
            <TextField
                label="Zipcode"
                variant="outlined"
                required
                value={profileData.zip || ''}
                placeholder='Savannah'
                onChange={(e) => setProfileData(profile => ({
                    ...profile,
                    zip: e.target.value
                }))}
                fullWidth
                helperText="Enter your zipcode"
            />
            <FormControl fullWidth>
                <InputLabel required id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    required
                    value={profileData.category || ''}
                    label="Category"
                    onChange={(e) => {
                        let category = e.target.value;
                        if (category === 'Custom') {
                            category = prompt("Please enter a custom art category") || '';
                            if (!category)
                                return;
                            setCategoryList(list => ([...list, category]));
                        }
                        setProfileData(profile => ({
                            ...profile,
                            category
                        }))
                    }}
                >
                    {categoryList.map(category => (
                        <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>Select your art category</FormHelperText>
            </FormControl>

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                Profile
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
