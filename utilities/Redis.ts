import { createClient } from 'redis';

const RedisClient = createClient({
	url: process.env.REDIS_URI ?? "redis://localhost:6379",
});

export default function init() { return RedisClient };