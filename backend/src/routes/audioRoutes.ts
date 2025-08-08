import express,{type Request,type Response,type NextFunction} from "express"
import { addArtist, getAllArtists, getArtist, updateArtist } from "../controllers/artistController"
import {addAudio, getAudio} from "../controllers/audioController"
import { uploadAudio } from "../utils/multerConfig"
const route=express.Router()
// get audio has to be checked for the functinality
route.route("/:id").get(getAudio).put((req,res)=>{})
route.route("/").get((req,res)=>{}).post(uploadAudio.single("audio"),addAudio)
export default route