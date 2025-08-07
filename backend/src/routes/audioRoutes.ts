import express,{type Request,type Response,type NextFunction} from "express"
import { addArtist, getAllArtists, getArtist, updateArtist } from "../controllers/artistController"
import {addAudio} from "../controllers/audioController"
import { uploadAudio } from "../utils/multerConfig"
const route=express.Router()
route.route("/:id").get((req,res)=>{}).put((req,res)=>{})
route.route("/").get((req,res)=>{}).post(uploadAudio.single("audio"),addAudio)
export default route