export type UserProfileStatus = 'unregistered' | 'registered' | 'submitted' | 'approved' | 'denied' | 'paid';

export interface UserProfile {
    info: UserProfileInfo,
    uploads: {
        [filename: string]: UserProfileUpload
    }
    // expiresAt: Date
}

export interface UserProfileInfo {
    firstName?: string,
    lastName?: string,
    companyName?: string,
    phone?: string,
    phone2?: string,
    website?: string,
    address?: string,
    city?: string,
    state?: string,
    zip?: string,
    category?: string,
    description?: string,
}

export interface UserProfileUpload {
    title: string,
    description?: string,
    url?: string
    // path: string
}

export function isProfileComplete(profileData: UserProfile) {
    if (!profileData)
        return 'No profile data found';

    const {
        info,
        uploads
    } = profileData

    if (!info)
        return 'No profile info found';
    if (!uploads)
        return 'No profile uploads found';

    const {
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zip,
        category,
        description
    } = info

    if (!firstName) return 'First Name is required';
    if (!lastName) return 'Last name is required';
    if (!phone) return 'Phone number is required';
    if (!address) return 'Address is required';
    if (!city) return 'City is required';
    if (!state) return 'State is required';
    if (!zip) return 'ZIP code is required';
    if (!category) return 'Category is required';
    if (!description) return 'Description is required';

    if (!uploads || Object.keys(uploads).length === 0)
        return 'At least one upload is required';

    return true;
}
