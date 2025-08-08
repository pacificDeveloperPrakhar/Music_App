import express from "express"
import { addPlayList, deletePlaylist, getAllPlaylist, getPlaylistById, updatePlaylist } from "../controllers/playlistController"
import { authenticateRequest } from "../controllers/authController"
const route=express.Router()
route.route("/:id").get(getPlaylistById).put(updatePlaylist).delete(deletePlaylist)
route.route("/").get(getAllPlaylist).post(authenticateRequest,addPlayList)
export default route