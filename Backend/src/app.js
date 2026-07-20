import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Snitch API",
  });
});

// Routes
app.use("/api/auth", authRoutes);

export default app;
