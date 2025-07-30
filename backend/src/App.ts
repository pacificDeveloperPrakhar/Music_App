import express,{type Request,type Response,type NextFunction} from "express";
import {Vibrant} from "node-vibrant/node"
import artistRoutes from "./routes/artistRoutes";
export const app=express()

const imagePath = '../public/hill.jpg'; // can be local path or a URL

app.route("/extract").get(async function(req:Request,res:Response,next:NextFunction){
    const palette = await Vibrant.from(imagePath).getPalette();
    console.log(palette)
})
app.use("/artist",artistRoutes)