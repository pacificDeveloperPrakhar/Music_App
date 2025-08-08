import catchAsync from "../utils/catchAsync";
import {user,type user as user_type} from "../db/schema"
import {type Request,type Response,type NextFunction} from "express";
import jwt from "jsonwebtoken"
import {eq} from "drizzle-orm"
import { db } from "../db/connection";
import {client} from "../db/redisConnection"
import AppError from "../utils/appError";
export const authenticateRequest = catchAsync(async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let token: string | null = null;
  
    // first try getting the token from the cookie
    if (req.cookies?.Authorization) {
      token = req.cookies.Authorization;
    }
    // try then getting the token from the cookie
    else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }
  
    if (!token) {
      return next(new AppError("Authentication invalid", 403));
    }
  
    // verify the token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.private_key!) as JwtPayload;
    } catch {
      return next(new AppError("Invalid or expired token", 403));
    }
  
    if (!decoded?.id) {
      return next(new AppError("Token payload missing user id", 403));
    }
  
    // get the user from the database ,its all credentials
    const userRecord = await db
      .select()
      .from(user)
      .where(eq(user.id, decoded.id))
      .limit(1);
  
    if (!userRecord.length) {
      return next(new AppError("User not found", 404));
    }
  

    req.user = userRecord[0];
  
    return next();
  });