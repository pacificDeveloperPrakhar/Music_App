import {type Request,type Response,type NextFunction} from "express"
import catchAsync from "../utils/catchAsync"
import {insertArtistSchema,color_theme_array,type InsertArtist,artist,type artist as artist_type} from "../db/schema"
import {db} from "../db/connection"
import { eq } from "drizzle-orm";
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
 
  artist_data=await db.insert(artist).values({...artist_data}).returning()
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
