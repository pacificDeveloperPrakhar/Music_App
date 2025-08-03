CREATE TYPE "public"."permissons" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "permisson" "permissons" DEFAULT 'user';