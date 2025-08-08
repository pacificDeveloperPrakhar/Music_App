import {type Request,type Response,type NextFunction} from "express"
import catchAsync from "../utils/catchAsync"
import {insertArtistSchema, color_theme_array,insertPlaylistSchema as InsertPlaylistSchema,playlist,userRecentlyPlayed, playlist_songs, type InsertPlaylist, audio, userFollowingPlaylists} from "../db/schema"
import {db} from "../db/connection"
import { desc, eq,inArray ,and} from "drizzle-orm";
import AppError from "../utils/appError"
import { stat } from "node:fs";
import { client } from "../db/redisConnection";
import { datacatalog } from "googleapis/build/src/apis/datacatalog";

// =============================================adding the playlist==================================================================
export const addPlayList = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // now the owner_id will be fetched from the cookie which has been attached to the uesr object of the object of req
  const {id:owner_id}=req.user
  const { name, image, description} = req.body;

  // Pick a random theme
  const randIdx = Math.floor(Math.random() * color_theme_array.length);
  const theme = color_theme_array[randIdx];

  // Build playlist object
  const playlistData = {
    name,
    image,
    description,
    owner_id,
    theme,
  };

  // validate with zod
  const validation = InsertPlaylistSchema.safeParse(playlistData);
  if (!validation.success) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid playlist data",
      errors: validation.error.format(),
    });
  }

  // now song is being inserted into the db
  const [newPlaylist] = await db
    .insert(playlist)
    .values(playlistData)
    .returning();
  // after pushing the data into the playlist we will trigger the file management worker
  client.lPush(process.env.file_management_queue,{
    id:newPlaylist.id,
    schemaType:"playlist",
    url:newPlaylist.image
  })
  res.status(201).json({
    status: "success",
    message: "Playlist created successfully",
    data: newPlaylist,
  });
});
// ==========================================the recently played playlist===================================================================
//pass the user id and then get the user recnetly played playlist
export const recentlyPlayedPlaylist = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  // Step 1: Get recently played song IDs
  const songRecords = await db
    .select({ songId: userRecentlyPlayed.songId })
    .from(userRecentlyPlayed)
    .where(eq(userRecentlyPlayed.userId, id));

  const songIds = songRecords.map(record => record.songId);

  if (!songIds.length) {
    return res.status(200).json({ playlists: [] });
  }

  // Step 2: Get playlist IDs for these songs
  const playlistRecords = await db
    .select({ playlistId: playlist_songs.playlistId })
    .from(playlist_songs)
    .where(inArray(playlist_songs.songId, songIds));

  const uniquePlaylistIds = [...new Set(playlistRecords.map(p => p.playlistId))];

  if (!uniquePlaylistIds.length) {
    return res.status(200).json({ playlists: [] });
  }

  // now get the playlist those matches with the id in the array
  const playlistsData = await db
    .select()
    .from(playlist)
    .where(inArray(playlist.id, uniquePlaylistIds));

  return res.status(200).json({ playlists: playlistsData });
});
// ========================================getting all the playlist====================================================================
export const getAllPlaylist =catchAsync( async function(req:Request,res:Response,next:NextFunction) {
  const  playlist_rows=await db.select().from(playlist).orderBy(desc(playlist.created_at))
   res.status(200).json({
    status:"fetched playlist successfully",
    data:playlist_rows
  })
})
// ======================================upating the playlist===============================================
export const updatePlaylist = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id:playlistId } = req.params;
  const { image, name, description, isPublic, collaborative, theme } = req.body;

  // Check if playlist exists
  const existing = await db
    .select()
    .from(playlist)
    .where(eq(playlist.id, playlistId));

  if (existing.length === 0) {
    return next(new AppError("Playlist not found", 404));
  }

  // Build update object only with provided fields
  const updateData: Partial<typeof playlist.$inferInsert> = {};
  if (image !== undefined) updateData.image = image;
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (isPublic !== undefined) updateData.isPublic = isPublic;
  if (collaborative !== undefined) updateData.collaborative = collaborative;
  if (theme !== undefined) updateData.theme = theme;

  // Update the playlist
  const updated = await db
    .update(playlist)
    .set(updateData)
    .where(eq(playlist.id, playlistId))
    .returning();
  // only if image url has been updated ,after updating the image just trigger the file management to update the image
  if(image)
  client.lPush(process.env.file_management_queue,{
    id:updated[0].id,
    schemaType:"playlist",
    url:updated[0].image
  })
  // now serve the data in the response format
  res.status(200).json({
    status: "success",
    data: updated[0],
  });
});
// ==========================================now crating the controller that will handle the process of adding songs to the playlist=====================================================
export const addAudioToPlaylist=catchAsync(async function(req:Request,res:Response,next:NextFunction):Promise<Response|void>{
  // first get the id of the user
  const {id:userId}=req.user
  const {playlistId,audioId}=req.params
  const audio_rows=await db.select({}).from(audio).where(eq(audio.id,audioId))
  if(!audio_rows.length)
    throw new AppError(`song with the id ${audioId} does not exists`,403)
  const existing_song_id=await db.select({id:playlist_songs.id}).from(playlist_songs).where(and(eq(playlist_songs.songId,audioId),eq(playlist_songs.playlistId,playlistId)))
  if(existing_song_id)
    throw new AppError(`song is already added into the playlist`,403)
  const position=Math.floor(Math.random()*1000)

  const new_added=await db.insert(playlist_songs).values({
   playlistId:playlistId,
   songId:audioId,
   addedBy:userId,
   position
  })
  .returning()
  //now serve the response with the newly created playlist song added
  return res.status(200).json({
    status:"ok",
    data:new_added
  })
})

export const deletePlaylist=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {id}=req.params
  // deleting all the playlist_songs's rows
  await db.delete(playlist_songs).where(eq(playlist_songs.playlistId,id))
  //all the user following playlist
  await db.delete(userFollowingPlaylists).where(eq(playlist_songs.playlistId,id))
  // now delete the playlist and return it
  const deleted_audio=await db.delete(playlist).where(eq(playlist.id,id)).returning()
  return res.status(204).json({
    status:"deleted",
    message:"playlist has been deleted from database",
    data:deleted_audio
  })
})

// =========================================no deleting a paricular song form the playlist==============================================================
export const deleteAudioFromPlaylist=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {playlistId,audioId}=req.params
  const audio_rows=await db.select({}).from(audio).where(eq(audio.id,audioId))
  if(!audio_rows.length)
    throw new AppError(`song with the id ${audioId} does not exists`,403)
  const existing_song_id=await db.select({id:playlist_songs.id}).from(playlist_songs).where(and(eq(playlist_songs.songId,audioId),eq(playlist_songs.playlistId,playlistId)))
  if(!existing_song_id)
    throw new AppError(`song is not belonging to the playlist`,403)
  const deleted_song=await db.delete(playlist_songs).where(eq(playlist_songs.id,existing_song_id[0].id))
  // now serve the response in the form json of the songs that have been deleted
  return res.status(204).json({
    status:"deleted",
    message:"songs have been deleted form the playlist ",
    data:deleted_song
  })
})
// ================================now handling the functionality for adding the song to the user following playlist==============
export const toggleUserFollowingPlaylist=catchAsync(async function (req:Request,res:Response,next:NextFunction) {
  const {id:userId}=req.user
  const {id:playlistId}=req.params
  const playlist_rows=await db.select().from(playlist).where(eq(playlist.id,playlistId))
  if(!playlist_rows.length)
    throw new AppError(`playlist with id ${playlistId} does not exists`,400)
  const user_following_playlists_rows=await db.select().from(userFollowingPlaylists).where(and(eq(userFollowingPlaylists.playlistId,playlistId),eq(userFollowingPlaylists.userId,userId)))
  if( user_following_playlists_rows.length){
    const data=await db.delete(userFollowingPlaylists).where(eq(userFollowingPlaylists.id,user_following_playlists_rows[0].id))
    return res.status(204).json({
      status:"deleted",
      message:`unfollowed the playlist ${playlist_rows[0].name}`,
      data
    })
  }
  const followingPlaylist=await db.insert(userFollowingPlaylists).values({
    userId,
    playlistId
  }).returning()

  return res.status(201).json({
    status:'ok',
    message:`user is now following the playlist ${playlist_rows[0].name}`,
    data:followingPlaylist
  })
})
// =======================================getting the playlist by id single=====================================================================

export const getPlaylistById = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const playlist_rows = await db
    .select()
    .from(playlist)
    .where(eq(playlist.id, id))
    .limit(1);

  if (playlist_rows.length === 0) {
    return next(new AppError("Playlist not found", 404));
  }

  res.status(200).json({
    status: "fetched playlist successfully",
    data: playlist_rows[0],
  });
});
// ===================getting all the followed playlist=============================================
export const getAllFollowedPlaylist=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  let userId;
  if(req.params.id){
   userId=req.params.id
  }
  else if(req.user)
  {
   userId=req.user.id
  }
  let followedPlaylistIds:any[]=await db.select().from(userFollowingPlaylists).where(eq(userFollowingPlaylists.userId,userId))
  followedPlaylistIds=followedPlaylistIds.flatMap((obj)=>obj.playlistId)
  followedPlaylistIds=new Array(new Set(followedPlaylistIds));
  const followedPlaylist=await db.select().from(playlist).where(inArray(playlist.id,followedPlaylistIds))
  return res.status(200).json({
    status:"ok",
    message:`fetched all the user followed playlists`,
    data:followedPlaylist
  })
})