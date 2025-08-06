import { google } from "googleapis";
import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import cors from "cors"
import { Vibrant } from "node-vibrant/node";
import audioRoutes from "./routes/audioRoutes"
import pg from "pg";
import path from "path";
import dotenv from "dotenv";
import artistRoutes from "./routes/artistRoutes";
import {client} from "./db/redisConnection"
import userRoutes from "./routes/userRoutes";
import error_handler from "./controllers/error_handler";
import { googleStartegyController } from "./controllers/userController";

dotenv.config();

let sequence_count = 1;

export const app = express();
// setting up the cors
app.use(cors({
    origin: ['http://127.0.0.1:3000','http://127.0.0.1:1234'],  // i have changed it to allow it to accept request from one specific source only
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: ['Content-Type', 'Authorization'],  
    credentials: true ,
    optionsSuccessStatus:200
  }));
// PostgreSQL session store
const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


app.use(express.json());

// setting up the session middleware
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Initialize passport set up

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  console.log("serialize")
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  console.log("deserialize")
  done(null, user);
});

// Routes
app.get("/extract", async function (req: Request, res: Response, next: NextFunction) {
  try {
    const imagePath = path.join(__dirname, "../public/hill.jpg");
    const palette = await Vibrant.from(imagePath).getPalette();
    console.log(sequence_count++, "Extracted palette");
    res.json(palette);
  } catch (err) {
    next(err);
  }
});


app.use("/login", (req: Request, res: Response) => {
  console.log("1")
  const filePath = path.join(__dirname, "../login.html");
  res.sendFile(filePath);
});




// Sample protected route
app.get("/dashboard", (req:Request, res:Response) => {
    console.log("made it to dashboard")
  if (!req.isAuthenticated()) {
    console.log(sequence_count++, "Dashboard access denied - not authenticated");
    return res.redirect("/login");
  }
  console.log(sequence_count++, "Dashboard accessed");
  res.send(`<h1>Welcome ${req.user?.name}</h1><img src="${(req.user as any).photo}" width="100" />`);
});

app.use("/users", userRoutes);
app.use("/artist", artistRoutes);
app.use("/audio",audioRoutes)
app.use("/content",express.static("../public"))


app.use(error_handler);
