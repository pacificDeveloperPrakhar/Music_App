import express from "express"
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleStrategyController,issueToken } from "../controllers/userController";
import { toggleUserFollowingPlaylist,recentlyPlayedPlaylist, getAllFollowedPlaylist } from "../controllers/playlistController"
import { authenticateRequest } from "../controllers/authController";
import { getAllLikedAudio, toggleUserLikeAudio } from "../controllers/audioController";
import route from "./audioRoutes";
import { getAllFollowedArtist, toggleUserFollowingArtist } from "../controllers/artistController";
dotenv.config();
const routes=express.Router()
routes.route("/authenticate_with_google").get(passport.authenticate("google",{
    scope:["email","profile"]
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/user.addresses.read"
  ]
}, googleStrategyController));

routes.route("/redirect").get(
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/users/success",
  })
);
routes.route("/success").get(issueToken)
//=====================playlist route handling=======================================================================
routes.route("/:id/follow_playlist").post(authenticateRequest,toggleUserFollowingPlaylist).get(getAllFollowedPlaylist)
routes.route("/recent_playlist/:id").get(authenticateRequest,recentlyPlayedPlaylist)
routes.route("/playlist").get(getAllFollowedPlaylist)
//=====================now for the user audio handling===========================================================
routes.route("/:id/like_audio").post(toggleUserLikeAudio).get(getAllLikedAudio)
routes.route("/my_liked").get(authenticateRequest,getAllLikedAudio)
//===========================now handling the artist functionalities routes==================================================================
routes.route("/:id/follow_artist").get(authenticateRequest,toggleUserFollowingArtist)
routes.route("/artist").get(getAllFollowedArtist)
export default routes
