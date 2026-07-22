import { Router } from "express";
import {
  getMe,
  googleCallback,
  login,
  logout,
  register,
} from "../controllers/auth.controllers.js";
import {
  validateLoginUser,
  validateRegisterUser,
} from "../validators/auth.validators.js";
import passport from "passport";
import { authenticateUser } from "../middlewares/auth.middlewares.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", validateRegisterUser, register);

/**
 * @route POST /api/auth/login
 * @description Login exisiting user
 * @access Public
 */
router.post("/login", validateLoginUser, login);

/**
 * @route POST /api/auth/logout
 * @description Logout user
 * @access Public
 */
router.post("/logout", logout);

/**
 * @route GET /api/auth/
 * @description Get current logged in user details
 * @access Private
 */
router.get("/me", authenticateUser, getMe);

/**
 * @route GET /api/auth/google
 * @description Authenticate user with Google OAuth
 * @access Public
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

/**
 * @route GET /api/auth/google/callback
 * @description Handle Google OAuth callback
 * @access Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

export default router;
