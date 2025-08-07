import multer,{FileFilterCallback} from "multer"
import { Request } from "express";
import { Express } from "express";
export const storage=multer.diskStorage({
    destination:function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
     console.log("i am here")
  
     return cb(null,process.env.audio_storage_path)
    },
    filename:function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
      const uniqueFactor=Math.round(Math.random()*1e9)
      const time=Date.now();
      const validExtensions = [
        // Images
        "svg", "jpeg", "jpg", "png", "webp",
      
        // Text/XML
        "xml", "txt",
      
        // Audio (if needed)
        "mp3", "wav", "ogg", "webm", "m4a", "aac", "flac", "3gp", "3g2"
      ];
      
      const xtension=file.originalname.split(".").find((str:string)=>validExtensions.includes(str))
      if(!xtension)
        {
          console.log(`${file.originalname} is not valid to be able to be exported to the database`)
  }
      //extracting the music metadata and then sending it to the following middleware
      return cb(null,`${time}-${uniqueFactor}.${xtension}`)
    }
  })
  export const fileFilter=function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
    console.log("here lies my code")
    console.log("file from filter",req.file)
    console.log("files from filter",req.files)
    const allowedMimeTypes = [
        // Images
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/jpg',
      
        // Audio
        'audio/mpeg',       // .mp3
        'audio/wav',        // .wav
        'audio/ogg',        // .ogg
        'audio/webm',       // .webm
        'audio/mp4',        // .m4a, .mp4
        'audio/x-aac',      // .aac
        'audio/flac',       // .flac
        'audio/x-wav',      // some .wav files
        'audio/3gpp',       // .3gp
        'audio/3gpp2',      // .3g2
      ];
      
    if(allowedMimeTypes.includes(file.mimetype)){
      console.log("file upload has been accepted")
      req.successMssg="image has been uploaded successfully"
      req.statusCode=201
      cb(null,true)
    }
    else
    {
      console.log("file has been rejected")
      req.errorMssg=`from author :you can use png,svg, jpeg and jpeg format only`
      req.statusCode=400
      cb(null,false)
    }
  }

  export const uploadAudio=multer({storage,fileFilter})