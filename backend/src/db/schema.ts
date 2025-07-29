// this will be used to generate the random uuid
import {sql,} from "drizzle-orm"
import {createInsertSchema}  from "drizzle-zod"
import { PgTable,pgEnum, pgTable, text,varchar,numeric,boolean,timestamp,jsonb,integer } from "drizzle-orm/pg-core"
import {z} from "zod";
// we will define the color pallete theme 
const color_theme=pgEnum("theme",['#ffb347','#ffcc33','#43cea2','#FFA17F','#0b8793'])
export const audio_type=pgEnum("audio_type",["podcast","song"])
// this is the audio schema which i did use so to mimic the spotify api as seen with bit of my modification

export const audio = pgTable("audio", {
  id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  duration_ms: numeric("duration_ms").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type:audio_type("type").default("song"),
  explicit: boolean("isExplicit").default(false),
  preview: text("preview").default(""),
  lyrics: text("lyrics_src").default(""),
  gif_url: text("gif_url").default(""),
  bitrate_list: text("bitrates_list").array().default(sql`'{}'::text[]`),
  support_hls: boolean("support_hls").notNull().default(false),
  hls_bitrate_src: text("bitrate_src").default(""),
  src: text("src"),
  uploadAt: timestamp("upload_at", { withTimezone: true }).defaultNow().notNull(),
  modifiedAt: timestamp("modified_at", { withTimezone: true }).defaultNow().notNull(),
  color_theme: text("color_theme").default("#ffcc33"),
});


// this is the userSchema and this is to mimic the schema as received from the spotify api

export const user = pgTable("user", {
  id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`), // Internal DB ID
  spotify_id: text("spotify_id").notNull().unique(), // Spotify user ID
  display_name: varchar("display_name", { length: 255 }).notNull(),    
  email: varchar("email", { length: 255 }).notNull().unique(),
  country: varchar("country", { length: 2 }), // e.g., "IN", "US"
  product: varchar("product", { length: 20 }), // e.g., "premium", "free", "open"
  followers: numeric("followers").default("0"),
  profile_images: jsonb("profile_images").default(sql`'[]'::jsonb`), // array of image objects
  external_urls: jsonb("external_urls").default(sql`'{}'::jsonb`), 
  href: text("href"),
  uri: text("uri"),
  is_verified: boolean("is_verified").default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
// here is the artist schema
export const artist = pgTable("artist", {
  id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  popularity: numeric("popularity").default("0"), // 0–100
  followers: numeric("followers").default("0"),
  genres: text("genres").array().default(sql`'{}'::text[]`),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});
// here is the album schema
export const album = pgTable("album", {
  id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  release_date: varchar("release_date", { length: 20 }),
  total_tracks: numeric("total_tracks").default("0"),
  album_type: varchar("album_type", { length: 50 }), // e.g., album, single, compilation
  image: text("image"),
  artist_id: text("artist_id").references(() => artist.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
// now we gonna create here the playlist schema
export const playlist = pgTable("playlist", {
  id: text("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(true),
  owner_id: text("owner_id").notNull(), // should reference user table ideally
  collaborative: boolean("collaborative").default(false),
  image: text("image"),
  created_at: timestamp("created_at").defaultNow(),
});

const playlist_songs= pgTable("playlist_songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: varchar("playlist_id").notNull().references(() => playlist.id),
  songId: varchar("song_id").notNull().references(() => audio.id),
  addedAt: timestamp("added_at").default(sql`CURRENT_TIMESTAMP`),
  addedBy: varchar("added_by").notNull().references(() => user.id),
  position: integer("position").notNull(), //now this field is to define the position of the audio in the playlist
});
// this audio contains the user and audio relation based on the like
const liked_audio=pgTable("liked_audio",{
    id:text('id').primaryKey().default(sql`gen_random_uuid()`),
    song_id:varchar("song_id").notNull().references(()=>audio.id),
    likedBy:varchar("liked_by").notNull().references(()=>user.id),
    liked_at:timestamp("liked_at").notNull().default(sql`CURRENT_TIMESTAMP`)
})

// User Recently Played
export const userRecentlyPlayed = pgTable("user_recently_played", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => user.id),
  songId: varchar("audio_id").notNull().references(() => audio.id),
  playedAt: timestamp("played_at").default(sql`CURRENT_TIMESTAMP`),
});

// this contains the artist user relation
export const userFollowingArtists = pgTable("user_following_artists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => user.id),
  artistId: varchar("artist_id").notNull().references(() => artist.id),
  followedAt: timestamp("followed_at").default(sql`CURRENT_TIMESTAMP`),
});

// this is the user playlist relation based on the fact which playlist is followed by whom
export const userFollowingPlaylists = pgTable("user_following_playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => user.id),
  playlistId: varchar("playlist_id").notNull().references(() => playlist.id),
  followedAt: timestamp("followed_at").default(sql`CURRENT_TIMESTAMP`),
});
// creating the type export for the select 
export type user=typeof user.$inferSelect
export type artist = typeof artist.$inferSelect;
export type album = typeof album.$inferSelect;
export type playlist = typeof playlist.$inferSelect;
export type audio = typeof audio.$inferSelect;
// creating the insert schemas
export const insertUserSchema = createInsertSchema(user).omit({
  id: true,
});

export const insertArtistSchema = createInsertSchema(artist).omit({
  id: true,
});

export const insertAlbumSchema = createInsertSchema(album).omit({
  id: true,
});

export const insertSongSchema = createInsertSchema(audio).omit({
  id: true,
});

export const insertPlaylistSchema = createInsertSchema(playlist).omit({
  id: true,
  created_at: true,
});

export const insertPlaylistSongSchema = createInsertSchema(playlist_songs).omit({
  id: true,
  addedAt: true,
});

export const insertUserLikedSongSchema = createInsertSchema(liked_audio).omit({
  id: true,
  liked_at: true,
});

export const insertUserRecentlyPlayedSchema = createInsertSchema(userRecentlyPlayed).omit({
  id: true,
  playedAt: true,
});

export const insertUserFollowingArtistSchema = createInsertSchema(userFollowingArtists).omit({
  id: true,
  followedAt: true,
});

export const insertUserFollowingPlaylistSchema = createInsertSchema(userFollowingPlaylists).omit({
  id: true,
  followedAt: true,
});

// types for the insert data

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type InsertSong = z.infer<typeof insertSongSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
export type InsertUserLikedSong = z.infer<typeof insertUserLikedSongSchema>;
export type InsertUserRecentlyPlayed = z.infer<typeof insertUserRecentlyPlayedSchema>;
export type InsertUserFollowingArtist = z.infer<typeof insertUserFollowingArtistSchema>;
export type InsertUserFollowingPlaylist = z.infer<typeof insertUserFollowingPlaylistSchema>;

// Extended types for API responses (with joined data)
export type SongWithArtistAndAlbum = audio & {
  artist: artist;
  album?: album;
};

export type PlaylistWithOwner = playlist & {
  owner: user;
};

export type PlaylistWithSongs = playlist & {
  owner: user;
  songs: SongWithArtistAndAlbum[];
};

export type AlbumWithArtist = album & {
  artist: artist;
};

export type AlbumWithSongs = album & {
  artist: artist;
  songs: SongWithArtistAndAlbum[];
};

export type ArtistWithStats = artist & {
  albumCount: number;
  songCount: number;
};
