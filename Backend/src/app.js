import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

import { config } from "./config/config.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// passportconfiguration
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    },
  ),
);

// Test route
if (config.NODE_ENV !== "production") {
  app.get("/test", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Snitch API",
    });
  });
}

// -----------------API Routes-----------------
// auth routes
app.use("/api/auth", authRoutes);
// product routes
app.use("/api/products", productRoutes);
// cart routes
app.use("/api/cart", cartRoutes);

// -----------------FRONTEND-----------------
app.use(express.static(path.join(__dirname, "../dist")));

// React Router support
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default app;
