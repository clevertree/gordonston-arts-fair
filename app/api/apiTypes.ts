// Define a type for the user data
import {UserProfile} from "@util/profile";

export type UserResult = {
    email: string;
    isAdmin: boolean;
    createdAt?: string;
    profile: UserProfile
};

export type UserList = UserResult[];