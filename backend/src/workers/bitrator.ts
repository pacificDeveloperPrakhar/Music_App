import dotenv from "dotenv"
import { client } from "../db/redisConnection"
import { db } from "../db/connection"
import { album, artist, audio, playlist, user, type user as user_type } from "../db/schema"
import { pipeline, Writable, Readable } from "stream"
import {eq} from "drizzle-orm"
import { get as httpsGet } from "https"
import { get as httpGet } from "http"
import fs from "fs"
import { parse } from "url"
import path from "path"
import { resolve } from "path"
import { rejects } from "assert"
import { execute_bash } from "../utils/execBash"
import generateRanddomId from "../utils/generateRandomId"
import { table } from "console"
dotenv.config({
    path: "./.env"
})
main()
async function main()
{

    while(true)
    {
        const {element}=await client.blPop(process.env.bitratorQueue,0)
        const task=JSON.parse(element)
        const data=await db.select({id:audio.id,src:audio.src}).from(audio).where(eq(audio.id,task.id))
        const {url}=task
        // Properly join the path
        const playlist_path = path.join(process.env.audio_bitrate_output, task.id);
// Ensure the directory exists
        fs.mkdirSync(playlist_path, { recursive: true });
        const {stdout}=await execute_bash(`cd ${process.env.audio_storage_path}`)
        console.log(stdout)
        // now generate the bitrated files in the folder audio_bitrate
        const {stdout:output}=await execute_bash(`ffmpeg -i "${task.url}" \
  -map 0:a -b:a:0 64k \
  -map 0:a -b:a:1 128k \
  -map 0:a -b:a:2 192k \
  -f hls \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_flags independent_segments \
  -master_pl_name master.m3u8 \
  -var_stream_map "a:0,name:64k a:1,name:128k a:2,name:192k" \
  "${playlist_path}/output_%v.m3u8"
      `)
  console.log(output)
  await db.update(audio).set({hls_bitrate_src:`${path.join(playlist_path,task.id,"master.m3u8")}`}).where(eq(audio.id,task.id))
}
}