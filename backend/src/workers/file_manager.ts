import dotenv from "dotenv"
import { client } from "../db/redisConnection"
import { db } from "../db/connection"
import { user, type user as user_type } from "../db/schema"
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

// create a pipe promise returning function converting the stream pipe from asynchronous callback to promise 
const pipe = async (srcStream: Readable, destStream: Writable): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        pipeline(srcStream, destStream, (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}
async function main() {
    while (true) {
        // this is the main portion of our code
        const { element } = await client.blPop(process.env.file_management_queue || "file_management_queue", 0);
        const task = JSON.parse(element)
        //   now create the get method to pass the url and then download the file in stream
        const parsed = parse(task.url)
        const get = parsed.protocol === "https:" ? httpsGet : httpGet
        const extname = path.extname(task.url)
        //now create the folder for writing the pictures into the folder
        let { stdout } = await execute_bash(`mkdir -p ${path.join(process.env.content_path,task.schemaType,task.id)}`)
        console.log(stdout)

        //now create the file and the write file stream and then write the stream to the file 
        const id = generateRanddomId()
        let result = await execute_bash(`touch ${path.join(process.env.content_path,task.schemaType, task.id, id)}${extname}`)
        console.log(result.stdout)
        //now we will make a request to the server where the file is located access it and then download it onto our system
        get(task.url, (response) => {
            response._readableState.highWaterMark = 128
            const writerStream = fs.createWriteStream(`${path.join(process.env.content_path,task.schemaType,task.id, id)}${extname}`)
            pipe(response, writerStream)
            writerStream.on("finish", () => {
                console.log("done writing the stream")
            })
            writerStream.on("error", (err) => {
                console.log("error was encountered")
            })
        }).on("error", (err) => {
            console.log(err)
        })
        // now update the url from the use data table
        await db.update(user).set({profile_images:[`http://127.0.0.1:3000/content/${task.schemaType}/${task.id}/${id}${extname}`]}).where(eq(user.id,task.id))
    }
};
main()

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
