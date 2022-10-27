import { createClient } from "redis";

const client = createClient({
    socket: { host: 'test-redis', port: 6379 }
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

const redisGet = async (redis_key) => {
    try {
        return await client.get('key');
    } catch (error) {
    }
}

const redisSet = async (redis_key, redis_value) => {
    try {
        return await client.set('key', 'value');
    } catch (error) {
    }
}

const redisDel = async (redis_key) => {
    try {
        return await client.del(redis_key);
    } catch (error) {
    }
}

export { redisGet, redisSet, redisDel };