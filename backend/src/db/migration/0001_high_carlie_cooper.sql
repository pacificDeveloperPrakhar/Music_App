ALTER TABLE "artist" ALTER COLUMN "image" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "artist" ADD COLUMN "updated_at" timestamp DEFAULT now();