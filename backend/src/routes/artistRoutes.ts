import express,{type Request,type Response,type NextFunction} from "express"
const route=express.Router()
route.route("/:id").get(function(req:Request,res:Response,next:NextFunction){

}).put(function(req:Request,res:Response,next:NextFunction){})
route.route("/").get(function(req:Request,res:Response,next:NextFunction){})
export default route