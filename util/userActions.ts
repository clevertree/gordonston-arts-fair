'use server'

import {getRedisClient} from "@util/redis";
import {UserProfile, UserProfileStatus} from "@util/profile";

export type UserResult = {
    email: string;
    isAdmin: boolean;
    status: UserProfileStatus
    createdAt?: string;
    profile?: UserProfile,
};

export type UserList = UserResult[];


export async function listUsersAsAdmin() {
    // Get Redis client
    const redisClient = await getRedisClient();

    // Get all users by scanning for keys matching the pattern 'user:*:login'
    const users: UserList = [];
    for await (const keys of redisClient.scanIterator({
        MATCH: 'user:*:login',
        COUNT: 100,
        TYPE: 'string'
    })) {
        for (const key of keys) {
            const email = key.split(':')[1];
            users.push(await fetchUserResult(email));
        }
    }

    return users;
}

export async function fetchUserResult(email: string): Promise<UserResult> {
    const emailLC = email.toLowerCase();
    // Get Redis client
    const redisClient = await getRedisClient();
    try {
        const isAdmin = !!(await redisClient.get(`user:${emailLC}:admin`));
        const status = (await redisClient.get(`user:${emailLC}:status`)) as UserProfileStatus;
        const createdAt = await redisClient.get(`user:${emailLC}:createdAt`) || undefined;
        const profile = (await redisClient.json.get(`user:${emailLC}:profile`)) as unknown as UserProfile;
        return {
            email,
            isAdmin,
            status,
            createdAt,
            profile
        }
    } catch (e: any) {
        throw Error("Error fetching user: " + e.message);
    }
}

