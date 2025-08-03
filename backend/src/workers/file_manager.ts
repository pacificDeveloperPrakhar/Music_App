import dotenv from "dotenv"
import {db} from "../db/connection"
import {user,type user as user_type} from "../db/schema"
import client from "redis"
dotenv.config
({
    path:"../.env"
    
})
// we will run this program for infinite number of times
while(true){
    main()
}

async function main(){
  
}

