import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controllers.js";
import { validateLoginUser, validateRegisterUser } from "../validators/auth.validators.js";

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
router.post("/logout", logout)

export default router;
