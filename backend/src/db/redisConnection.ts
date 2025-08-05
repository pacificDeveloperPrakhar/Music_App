import { createClient } from "redis";
import {db} from "../db/connection"

// Initialize client with optional URL from environment
export const client = createClient({
  url: process.env.REDIS_HOST, // e.g., "redis://localhost:6379"
});
client.connect()

client.on("error", (err) => console.error("❌ Redis Client Error", err));
client.on('connect', () => {
    console.log(process.env.REDIS_HOST)
    console.log(`\x1b[32m✅ Connected to Redis\x1b[0m at \x1b[34m${process.env.REDIS_HOST}\x1b[0m`);
  });


