export interface UserData {
    email: string,
    password: string,
    profile?: UserProfileData
}

export interface UserProfileData {
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
    entries?: UserProfileEntryData[]
    // expiresAt: Date
}

export interface UserProfileEntryData {
    title: string,
    description: string,
    path: string
}


// <select name="data[Registration][category_id]" id="RegistrationCategoryId">
// <option value="">Select a category...</option>
// <option value="1252">Apparel</option>
//     <option value="1253">Ceramics</option>
//     <option value="1254">Drawings/Pastels</option>
//     <option value="1255">Fiber</option>
//     <option value="1256">Glass</option>
//     <option value="1257">Graphics</option>
//     <option value="1258">Jewelry</option>
//     <option value="1259">Leather</option>
//     <option value="1260">Metal</option>
//     <option value="1261">Mixed Media</option>
// <option value="1262">Other (Describe in Comments field)</option>
// <option value="1263">Photography</option>
//     <option value="1264">Wood</option>
//     </select>
