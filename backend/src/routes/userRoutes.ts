import express from "express"
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleStrategyController,issueToken } from "../controllers/userController";
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
    successRedirect: "/user/success",
  })
);
routes.route("/success").get(issueToken)
export default routes
