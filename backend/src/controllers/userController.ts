import catchAsync from "../utils/catchAsync";
import {user,type user as user_type} from "../db/schema"
import {type Request,type Response,type NextFunction} from "express";
import jwt from "jsonwebtoken"
import {eq} from "drizzle-orm"
import { db } from "../db/connection";
export const googleStrategyController = async function (
  accessToken: string,
  refreshToken: string | undefined,
  profile: any,
  done: Function
) {
  const { displayName, emails, photos } = profile;

  const credentials = {
    email: emails[0].value,
    profile_images: photos.map((photo: any) => photo.value),
    display_name: displayName,
  };

  console.log('Google Profile:', profile);

  // checking if the user already stored in the database
  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, credentials.email));

  if (!existingUser.length) {
    // then register the user
    const [newUser] = await db
      .insert(user)
      .values(credentials)
      .returning();

    return done(null, newUser); // this becomes req.user
  }

  // if the user exists this will be our login flow and we will update the data with the new data
  await db
    .update(user)
    .set({
      display_name: credentials.display_name,
      profile_images: credentials.profile_images,
      updated_at: new Date(),
    })
    .where(eq(user.email, credentials.email));

  // Fetch updated user and return
  const [updatedUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, credentials.email));

  return done(null, updatedUser); // this becomes req.user
};
// {
//   id: '105786282030979475473',
//   displayName: 'Prakhar Vishwakarma',
//   name: { familyName: 'Vishwakarma', givenName: 'Prakhar' },
//   emails: [ { value: 'prakharvision@gmail.com', verified: true } ],
//   photos: [
//     {
//       value: 'https://lh3.googleusercontent.com/a/ACg8ocLRC-_Duwq6OSe8jcKQG1YvHO5QTidzelNzSrFSCp4xwGuJ-F1K=s96-c'
//     }
//   ],
//   provider: 'google',
//   _raw: '{\n' +
//     '  "sub": "105786282030979475473",\n' +
//     '  "name": "Prakhar Vishwakarma",\n' +
//     '  "given_name": "Prakhar",\n' +
//     '  "family_name": "Vishwakarma",\n' +
//     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocLRC-_Duwq6OSe8jcKQG1YvHO5QTidzelNzSrFSCp4xwGuJ-F1K\\u003ds96-c",\n' +
//     '  "email": "prakharvision@gmail.com",\n' +
//     '  "email_verified": true\n' +
//     '}',
//   _json: {
//     sub: '105786282030979475473',
//     name: 'Prakhar Vishwakarma',
//     given_name: 'Prakhar',
//     family_name: 'Vishwakarma',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocLRC-_Duwq6OSe8jcKQG1YvHO5QTidzelNzSrFSCp4xwGuJ-F1K=s96-c',
//     email: 'prakharvision@gmail.com',
//     email_verified: true
//   }
// }
export const issueToken =catchAsync(async function(req:Request,res:Response,next:NextFunction){
  const {email,id}=req.user
  const token=jwt.sign({email,id},process.env.private_key,{expiresIn:'1h'}) 
  res.setHeader("Authorization",`Bearer ${token}`)
  res.cookie('jwt',token,{
    httpOnly: false, 
      secure: false, 
      sameSite: 'strict', 
      maxAge: 60 * 60 * 1000, 
  })
  res.redirect('/dashboard')
})