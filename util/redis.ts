import {createClient} from 'redis';

let clientPromise = createClient({
    url: process.env.REDIS_URL
}).connect();

export function getRedisClient() {
    return clientPromise;
}
