import dotenv from "dotenv";
import { createServer ,type Server} from "http";
import express,{type Request,type Response,type NextFunction} from "express";

// Load environment variables from the .env file
dotenv.config({ path: "../.env" });

const app = express();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || "localhost";

// Create the server
const server:Server = createServer(app);

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`);
});
