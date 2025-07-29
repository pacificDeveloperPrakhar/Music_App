CREATE TYPE "public"."audio_type" AS ENUM('podcast', 'song');--> statement-breakpoint
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
CREATE TABLE "user_following_artists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"artist_id" varchar NOT NULL,
	"followed_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "user_following_playlists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"playlist_id" varchar NOT NULL,
	"followed_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "user_recently_played" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"audio_id" varchar NOT NULL,
	"played_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_following_artists" ADD CONSTRAINT "user_following_artists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_following_artists" ADD CONSTRAINT "user_following_artists_artist_id_artist_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_following_playlists" ADD CONSTRAINT "user_following_playlists_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_following_playlists" ADD CONSTRAINT "user_following_playlists_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recently_played" ADD CONSTRAINT "user_recently_played_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recently_played" ADD CONSTRAINT "user_recently_played_audio_id_audio_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE no action ON UPDATE no action;