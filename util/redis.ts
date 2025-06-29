import {createClient} from 'redis';
import {HttpError} from "@app/api/httpError";

let clientPromise = createClient({
    url: process.env.REDIS_URL
}).connect();

export function getRedisClient() {
    return clientPromise;
}

