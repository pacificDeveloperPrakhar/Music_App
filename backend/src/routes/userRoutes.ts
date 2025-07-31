import express from "express"
import passport from "passport";
const routes=express.Router()
routes.route("/authenticate_with_google").get(passport.authenticate("google",{
    scope:["email","profile"]
}))

routes.route("/redirect").get(
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);
export default routes
