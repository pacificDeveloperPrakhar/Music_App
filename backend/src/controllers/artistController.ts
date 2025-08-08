import {type Request,type Response,type NextFunction} from "express"
import catchAsync from "../utils/catchAsync"
import {insertArtistSchema,color_theme_array,type audio as audio_type,audio,type InsertArtist,artist,type artist as artist_type, artistSongs, userFollowingArtists, user} from "../db/schema"
import {db} from "../db/connection"
import {client} from "../db/redisConnection"
import { eq ,and, inArray} from "drizzle-orm";
import AppError from "../utils/appError"
import { stat } from "node:fs";


export const addArtist = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, image } = req.body;

  // Select random color theme
  const randIdx = Math.floor(Math.random() * color_theme_array.length);
  const color = color_theme_array[randIdx];

  // Generate random popularity
  const popularity = String(Math.floor(Math.random() * 100));

  let artist_data: InsertArtist = {
    name,
    image,
    popularity,
    theme: color,
  };

  // Validate using Zod
  const validation = insertArtistSchema.safeParse(artist_data);
  
  if (!validation.success) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid artist data",
      errors: validation.error.format(),
    });
  }
 
  artist_data=(await db.insert(artist).values({...artist_data}).returning())[0]
  client.lPush(process.env.file_management_queue,JSON.stringify({
    id:artist_data.id,
    schemaType:"artist",
    url:image
  }))
  console.log(artist_data)
  delete artist_data.id
  res.status(201).json({
    status: "success",
    message: "Artist added successfully",
    data: artist_data, 
  });
});

export const getArtist = catchAsync(
  async function (req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string | undefined;

    if (!id) {
      return next(new AppError("Artist ID is required", 400));
    }

    // 2. Fetch artist from DB
    const artistData: artist_type[] = await db
      .select()
      .from(artist)
      .where(eq(artist.id, id));

    // 3. If not found, throw 404
    if (artistData.length === 0) {
      return next(new AppError("Artist not found", 404));
    }

    // 4. Respond with data
    res.status(200).json({
      status: "success",
      message: "Artist fetched successfully",
      length: artistData.length,
      data: artistData,
    });
  }
);

export const updateArtist = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("Artist ID is required", 400));
  }

  // Check if artist exists
  const artist_data: artist_type[] = await db
    .select()
    .from(artist)
    .where(eq(artist.id, id));

  if (!artist_data.length) {
    throw new AppError(`No artist exists with the id ${id}`, 404);
  }

  const { name, image, followers, popularity } = req.body;
  const updatedAt=new Date()
  // Optionally, validate req.body here if needed

  await db
    .update(artist)
    .set({ name, image, followers, popularity ,updatedAt})
    .where(eq(artist.id, id));

  const updated_artist: artist_type[] = await db
    .select()
    .from(artist)
    .where(eq(artist.id, id));
  // now trigger the file management queue
    client.lPush(process.env.file_management_queue,JSON.stringify({
      id:id,
      schemaType:"artist",
      url:updated_artist[0].image
    }))

  res.status(200).json({
    status: "success",
    message: "Artist updated successfully",
    data: updated_artist[0],
  });
});
// getting all the artist
export const getAllArtists = catchAsync(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const artists: artist_type[] = await db.select().from(artist);

  res.status(200).json({
    status: "success",
    message: "All artists fetched successfully",
    length: artists.length,
    data: artists,
  });
});
// ====================adding audio to the artist==============================================
export const addAudioToArtist=catchAsync(async function(req:Request,res:Response,next:NextFunction):Promise<Response|void>{
  // first get the id of the user
  const {artistId,audioId}=req.params
  const audio_rows=await db.select({}).from(audio).where(eq(audio.id,audioId))
  if(!audio_rows.length)
    throw new AppError(`song with the id ${audioId} does not exists`,403)
  const existing_song_id=await db.select({id:artistSongs.id}).from(artistSongs).where(and(eq(artistSongs.audioId,audioId),eq(artistSongs.artistId,artistId)))
  if(existing_song_id)
    throw new AppError(`song is already belonging to the artist`,403)
  const position=Math.floor(Math.random()*1000)

  const new_added=await db.insert(artistSongs).values({
   artistId:artistId,
   audioId:audioId,

  })
  .returning()
  //now serve the response with the newly added audio to the artist
  return res.status(200).json({
    status:"ok",
    data:new_added
  })
})
// ==========================deleting the audio fromt he artist===========================================
export const deleteAudioFromArtist=catchAsync(async function (req:Request,res:Response,next:NextFunction) {
  const {artistId,audioId}=req.params
  const audio_rows=await db.select({}).from(audio).where(eq(audio.id,audioId))
  if(!audio_rows.length)
    throw new AppError(`song with the id ${audioId} does not exists`,403)
  const existing_song_id=await db.select({id:artistSongs.id}).from(artistSongs).where(and(eq(artistSongs.audioId,audioId),eq(artistSongs.artistId,artistId)))
  if(!existing_song_id)
    throw new AppError(`song is not belonging to the artist`,403)
  // delete the audio from the artist
    const deleted_song=await db.delete(artistSongs).where(eq(artistSongs.id,existing_song_id[0].id))
    // now serve the response in the form json of the songs that have been deleted
    return res.status(204).json({
      status:"deleted",
      message:"songs have been deleted form the playlist ",
      data:deleted_song
    })
})
// ========================toggle user follwing the artist functinlaity=================================
export const toggleUserFollowingArtist=catchAsync(async function (req:Request,res:Response,next:NextFunction) {
    const {id:userId}=req.user
    const {id:artistId}=req.params
    const artist_rows=await db.select().from(artist).where(eq(artist.id,artistId))
    if(!artist_rows.length)
      throw new AppError(`artist with id ${artistId} does not exists`,400)
    const user_following_artist_rows=await db.select().from(userFollowingArtists).where(and(eq(userFollowingArtists.artistId,artistId),eq(userFollowingArtists.userId,userId)))
    if( user_following_artist_rows.length){
      const data=await db.delete(userFollowingArtists).where(eq(userFollowingArtists.id,user_following_artist_rows[0].id))
      return res.status(204).json({
        status:"deleted",
        message:`unfollowed the artist ${artist_rows[0].name}`,
        data
      })
    }
    const followingArtist=await db.insert(userFollowingArtists).values({
      userId,
      artistId
    }).returning()
  
    return res.status(201).json({
      status:'ok',
      message:`user is now following the playlist ${artist_rows[0].name}`,
      data:followingArtist
    })
})
// ==========================get all the followed artist================================================
export const getAllFollowedArtist=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  let userId;
  if(req.params.id){
   userId=req.params.id
  }
  else if(req.user)
  {
   userId=req.user.id
  }
  let allArtistFollowed:any[]=await db.select().from(userFollowingArtists).where(eq(userFollowingArtists.userId,userId))
  allArtistFollowed=allArtistFollowed.flatMap((artist)=>artist.artistId)
  allArtistFollowed =new Array(new Set(allArtistFollowed))
  allArtistFollowed=await db.select().from(artist).where(inArray(artist.id,allArtistFollowed))
  return res.status(200).json({
    status:"ok",
    message:`all the followed artist has been fetched`,
    data:allArtistFollowed
  })

})