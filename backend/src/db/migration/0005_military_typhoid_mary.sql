CREATE TABLE "liked_audio" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"song_id" varchar NOT NULL,
	"liked_by" varchar NOT NULL,
	"liked_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlist_songs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playlist_id" varchar NOT NULL,
	"song_id" varchar NOT NULL,
	"added_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"added_by" varchar NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "permisson" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "liked_audio" ADD CONSTRAINT "liked_audio_song_id_audio_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."audio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "liked_audio" ADD CONSTRAINT "liked_audio_liked_by_user_id_fk" FOREIGN KEY ("liked_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_song_id_audio_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."audio"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_added_by_user_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;