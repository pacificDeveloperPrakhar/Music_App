import {type Request,type Response,type NextFunction} from "express"
import catchAsync from "../utils/catchAsync"
import {db} from "../db/connection"
import { audio ,type audio as audioType} from "../db/schema"
import { eq } from "drizzle-orm";
import AppError from "../utils/appError"
import { isValidUrl,isImageUrl } from "../utils/checking_url"
import {parseFile} from "music-metadata"
import {client} from "../db/redisConnection"
export const addAudio=catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {name,preview,type}=req.body
  const {path}=req.file
  console.log(req.file)
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
    duration_ms
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