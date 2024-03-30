import { createClient } from 'redis';

export const RedisClient = createClient({
	url: process.env.REDIS_URL ?? "redis://localhost:6379",
});