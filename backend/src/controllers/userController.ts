import catchAsync from "../utils/catchAsync";
import {user} from "../db/schema"
import { db } from "../db/connection";
export const googleStartegyController=async function (accessToken:string,refreshToken:string|undefined,profile:Object,done:Function){
  console.log(profile)
}