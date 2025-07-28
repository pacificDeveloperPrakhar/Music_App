import { defineConfig } from  'drizzle-kit';
import dotenv from "dotenv";
dotenv.config({
    path:"./.env"
})
// this config drizzle file will generate the migration script that will be dependent on the path that has been defined in the schema field
export default defineConfig({
  dialect: "postgresql", // "postgresql" | "mysql" | "sqlite"
  schema: "./src/db/schema.ts", // Path to the schema (must be .js/.ts depending on your setup)
  out: "./src/db/migration",              // Migration output folder
  dbCredentials: {
    host: process.env.postgres_db_host!,
    user: process.env.postgres_db_user!,
    password: process.env.postgres_db_password!,
    database: process.env.postgres_db!,
    port: Number(process.env.postgres_db_port!) || 5432, // Ensure it's a number
  },
  verbose: true,
  strict: true,
});

