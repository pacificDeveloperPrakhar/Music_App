import express,{type Request,type Response,type NextFunction} from "express"
import { addArtist, getAllArtists, getArtist, updateArtist } from "../controllers/artistController"
const route=express.Router()
route.route("/:id").get(getArtist).put(updateArtist)
route.route("/").get(getAllArtists).post(addArtist)
export default route