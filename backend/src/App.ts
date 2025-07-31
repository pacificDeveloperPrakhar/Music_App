import { google } from "googleapis";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import express, { type Request, type Response, type NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Vibrant } from "node-vibrant/node";
import pg from "pg";
import path from "path";
import dotenv from "dotenv";
import artistRoutes from "./routes/artistRoutes";
import userRoutes from "./routes/userRoutes";
import error_handler from "./controllers/error_handler";

dotenv.config();

let sequence_count = 1;

export const app = express();

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  scope: [
    "profile",
    "email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/user.phonenumbers.read",
    "https://www.googleapis.com/auth/user.addresses.read"
  ]
}, async (accessToken, refreshToken, profile, done) => {
  console.log("sequence_count: strategy callback");
  console.log(accessToken)
  console.log(refreshToken)
  console.log(profile)
  return done(null,{})
}));

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

console.log(sequence_count++, "Mounting /authenticate/google route");
app.get("/authenticate/google", (req,res,next)=>{
    console.log("3")
    next()
},passport.authenticate("google", {
  scope: ["email", "profile"],
}));

console.log(sequence_count++, "Mounting /users/redirect route");
app.get("/users/redirect",
  (req,res,next)=>{
    console.log(req.params)
    console.log("2")
    next()
},
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);

// Sample protected route
console.log(sequence_count++, "Mounting /dashboard route");
app.get("/dashboard", (req:Request, res:Response) => {
    console.log("made it to dashboard")
  if (!req.isAuthenticated()) {
    console.log(sequence_count++, "Dashboard access denied - not authenticated");
    return res.redirect("/login");
  }
  console.log(sequence_count++, "Dashboard accessed");
  res.send(`<h1>Welcome ${req.user?.name}</h1><img src="${(req.user as any).photo}" width="100" />`);
});

// Use other routes
console.log(sequence_count++, "Mounting /user and /artist routes");
app.use("/user", userRoutes);
app.use("/artist", artistRoutes);

// Global error handler
console.log(sequence_count++, "Mounting error handler");
app.use(error_handler);
