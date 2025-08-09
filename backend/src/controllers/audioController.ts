import {type Request,type Response,type NextFunction} from "express"
import catchAsync from "../utils/catchAsync"
import {db} from "../db/connection"
import { audio ,type audio as audioType, playlist_songs,liked_audio,userRecentlyPlayed,artistSongs,artist} from "../db/schema"
import { eq ,inArray,and} from "drizzle-orm";
import AppError from "../utils/appError"
import { isValidUrl,isImageUrl } from "../utils/checking_url"
import {parseFile} from "music-metadata"
import {client} from "../db/redisConnection"
export const addAudio=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {name,preview,type,lyrics}=req.body
  console.log(req.file)
  const {path}=req.file
  const metadata=await parseFile(path)
  const duration_ms=metadata.format.duration
  const audio_doc:audioType[]=await db.select().from(audio).where(eq(audio.name,name))
  if(audio_doc.length)
   {
    throw new AppError("audio with this name already exists",400)
}
if(preview&&!isImageUrl(preview))
    throw new AppError("preview is not valid image url",400)
  const new_audio_doc:audioType[]=await db.insert(audio).values({
    name,preview,type,
    duration_ms,
    lyrics
  }).returning()
res.status(201).json({
    status:"ok",
    data:{
        audio:new_audio_doc
    }
})
console.log(new_audio_doc)
client.lPush(process.env.file_management_queue,JSON.stringify({
    id:new_audio_doc[0].id,
    schemaType:"audio",
    url:preview
}))
// now trigger the bitrator worker 
client.lPush(process.env.bitratorQueue,JSON.stringify({
  id:new_audio_doc[0].id,
  schemaType:"audio",
  url:req.file.path
}))
})

export const getAudio = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  // 1. Try matching with playlist_songs
  const fromPlaylist = await db
    .select()
    .from(playlist_songs)
    .where(eq(playlist_songs.playlistId, id));

  if (fromPlaylist.length > 0) {
    const audioIds = fromPlaylist.map((song) => song.songId);

    const songsWithMetadata = await db
      .select({
        audioId: audio.id,
        title: audio.name,
        url: audio.src,
        duration: audio.duration_ms,
        lyrics: audio.lyrics,
        preview: audio.preview,
        artistName: artist.name,
        artistId: artist.id,
        artistImage: artist.image,
      })
      .from(artistSongs)
      .innerJoin(audio, eq(artistSongs.audioId, audio.id))
      .innerJoin(artist, eq(artistSongs.artistId, artist.id))
      .where(inArray(artistSongs.audioId, audioIds));

    return res.status(200).json({
      status: "ok",
      schema: "playlist",
      length: songsWithMetadata.length,
      data: songsWithMetadata,
    });
  }

  // 2. Try matching with userRecentlyPlayed
  const fromRecentlyPlayed = await db
    .select()
    .from(userRecentlyPlayed)
    .where(eq(userRecentlyPlayed.userId, id));

  if (fromRecentlyPlayed.length > 0) {
    const audioIds = fromRecentlyPlayed.map((entry) => entry.songId);

    const songsWithMetadata = await db
      .select({
        audioId: audio.id,
        title: audio.name,
        url: audio.src,
        duration: audio.duration_ms,
        lyrics: audio.lyrics,
        preview: audio.preview,
        artistName: artist.name,
        artistId: artist.id,
        artistImage: artist.image,
      })
      .from(artistSongs)
      .innerJoin(audio, eq(artistSongs.audioId, audio.id))
      .innerJoin(artist, eq(artistSongs.artistId, artist.id))
      .where(inArray(artistSongs.audioId, audioIds));

    return res.status(200).json({
      status: "ok",
      schema: "recently_played",
      length: songsWithMetadata.length,
      data: songsWithMetadata,
    });
  }

  // 3. Try matching with liked_audio
  const fromLiked = await db
    .select()
    .from(liked_audio)
    .where(eq(liked_audio.likedBy, id));

  if (fromLiked.length > 0) {
    const audioIds = fromLiked.map((entry) => entry.song_id);

    const songsWithMetadata = await db
      .select({
        audioId: audio.id,
        title: audio.name,
        url: audio.src,
        duration: audio.duration_ms,
        lyrics: audio.lyrics,
        preview: audio.preview,
        artistName: artist.name,
        artistId: artist.id,
        artistImage: artist.image,
      })
      .from(artistSongs)
      .innerJoin(audio, eq(artistSongs.audioId, audio.id))
      .innerJoin(artist, eq(artistSongs.artistId, artist.id))
      .where(inArray(artistSongs.audioId, audioIds));

    return res.status(200).json({
      status: "ok",
      schema: "liked_audio",
      length: songsWithMetadata.length,
      data: songsWithMetadata,
    });
  }

  // If no match found
  return res.status(404).json({
    status: "error",
    message: "No songs found for the given id.",
  });
});
// now toggling the user linking an audio feature
export const toggleUserLikeAudio=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {id:userId}=req.user
  const {id:audioId}=req.params
  const audio_row=await db.select().from(audio).where(eq(audio.id,audioId))
  if(!audio_row.length){
    throw new AppError(`audio with the id ${audioId} does not exists`,400)
  }
  const liked_audio_rows=await db.select().from(liked_audio).where(and(eq(liked_audio.song_id,audioId),eq(liked_audio.likedBy,userId)))
  if(liked_audio_rows.length){
    const deleted_audio=await db.delete(liked_audio).where(eq(liked_audio.id,liked_audio_rows[0].id)).returning()
    return res.status(204).json({
      status:"deleted",
      message:`unliked ${audio_row[0].name}`,
      data:deleted_audio
    })
  }
  const liked_audio_row=await db.insert(liked_audio).values({
    song_id:audioId,
    likedBy:userId
  }).returning()
  return res.status(201).json({
    status:"ok",
    message:`liked ${audio_row[0].name}`,
    data:liked_audio_row
  })
})
// ==========================now getting all the liked audios=======================================
export const getAllLikedAudio=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  let userId;
  if(req.params.id){
   userId=req.params.id
  }
  else if(req.user)
  {
   userId=req.user.id
  }
  let liked_audio_ids:any[]=await db.select({id:liked_audio.song_id}).from(liked_audio).where(eq(liked_audio.likedBy,userId))
  liked_audio_ids=liked_audio_ids.flatMap((obj)=>obj.id)
  liked_audio_ids=new Array(new Set(liked_audio_ids))
  const liked_audios=await db.select().from(audio).where(inArray(audio.id,liked_audio_ids))
  return res.status(200).json({
    status:"ok",
    message:`fetched all the user liked audios`,
    data:liked_audios
  })
})