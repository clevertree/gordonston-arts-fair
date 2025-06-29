'use server'

import {getRedisClient} from "@util/redis";
import {UserProfile} from "@util/profile";

export type UserResult = {
    email: string;
    isAdmin: boolean;
    createdAt?: string;
    profile: UserProfile
};

export type UserList = UserResult[];

export async function listUsersAsAdmin() {
    // Get Redis client
    const redisClient = await getRedisClient();

    // Get all users by scanning for keys matching the pattern 'user:*:login'
    const users: UserList = [];
    for await (const [key] of redisClient.scanIterator({
        MATCH: 'user:*:login',
        COUNT: 100
    })) {
        console.log('key', key);
        const email = key.split(':')[1];
        const isAdmin = !!(await redisClient.get(`user:${email}:admin`));
        const createdAt = await redisClient.get(`user:${email}:createdAt`) || undefined;
        const profileDataString = await redisClient.get(`user:${email}:profile`);
        const profile: UserProfile = profileDataString ? JSON.parse(profileDataString) : undefined;

        users.push({
            email,
            isAdmin,
            createdAt,
            profile
        });
    }

    return users;
}

export async function getUserInfoAsAdmin(email: string): Promise<UserResult> {

    // Get Redis client
    const redisClient = await getRedisClient();

    const isAdmin = !!(await redisClient.get(`user:${email.toLowerCase()}:admin`));
    const createdAt = await redisClient.get(`user:${email.toLowerCase()}:createdAt`) || undefined;
    const profileDataString = await redisClient.get(`user:${email.toLowerCase()}:profile`);
    const profile: UserProfile = profileDataString ? JSON.parse(profileDataString) : undefined;

    return {
        email,
        isAdmin,
        createdAt,
        profile
    }
}