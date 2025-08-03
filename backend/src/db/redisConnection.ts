import { createClient } from "redis";

// Initialize client with optional URL from environment
const redisClient = createClient({
  url: process.env.REDIS_HOST, // e.g., "redis://localhost:6379"
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));
redisClient.on('connect', () => {
    console.log(process.env.REDIS_HOST)
    console.log(`\x1b[32m✅ Connected to Redis\x1b[0m at \x1b[34m${process.env.REDIS_HOST}\x1b[0m`);
  });

export  default {client:redisClient};
