import dotenv from "dotenv";
import { createServer ,type Server} from "http";
import Vibrant from "node-vibrant"
import {app} from "./App"
// Make sure to install the 'pg' package 
dotenv.config({ path: "../.env" });
import {db}  from "./db/connection"


// Load environment variables from the .env file


const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || "127.0.0.1";

// Create the server
const server:Server = createServer(app);

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
