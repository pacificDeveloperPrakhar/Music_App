CREATE TABLE "album" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"release_date" varchar(20),
	"total_tracks" numeric DEFAULT '0',
	"album_type" varchar(50),
	"image" text,
	"artist_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "artist" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"popularity" numeric DEFAULT '0',
	"followers" numeric DEFAULT '0',
	"genres" text[] DEFAULT '{}'::text[],
	"image" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audio" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"duration_ms" numeric NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "audio_type" DEFAULT 'song',
	"isExplicit" boolean DEFAULT false,
	"preview" text DEFAULT '',
	"lyrics_src" text DEFAULT '',
	"gif_url" text DEFAULT '',
	"bitrates_list" text[] DEFAULT '{}'::text[],
	"support_hls" boolean DEFAULT false NOT NULL,
	"bitrate_src" text DEFAULT '',
	"src" text,
	"upload_at" timestamp with time zone DEFAULT now() NOT NULL,
	"modified_at" timestamp with time zone DEFAULT now() NOT NULL,
	"color_theme" text DEFAULT '#ffcc33'
);
--> statement-breakpoint
CREATE TABLE "playlist" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT true,
	"owner_id" text NOT NULL,
	"collaborative" boolean DEFAULT false,
	"image" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"spotify_id" text NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"country" varchar(2),
	"product" varchar(20),
	"followers" numeric DEFAULT '0',
	"profile_images" jsonb DEFAULT '[]'::jsonb,
	"external_urls" jsonb DEFAULT '{}'::jsonb,
	"href" text,
	"uri" text,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_spotify_id_unique" UNIQUE("spotify_id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;