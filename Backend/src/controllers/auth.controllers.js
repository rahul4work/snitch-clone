import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

// Generate JWT Token
const generateToken = async (user, res, message, statusCode) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  return res.status(statusCode).json({
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

/**
 * @description Register a new User
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
    });

    if (existingUser) {
      return res.status(401).json({
        success: false,
        code:"USER_ALREADY_EXISTS",
        message: "User with this email or contact already exists",
        error: "User already exists",
      });
    }

    const user = await userModel.create({
      email,
      contact,
      password,
      fullname,
      role: isSeller ? "seller" : "buyer",
    });

    await generateToken(user, res, "User registered successfully", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      code:"INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * @description Login exisiting User
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        code:"USER_NOT_FOUND",
        message: "No account found with this email. Please register first.",
        error: "Invalid Credentials. User not found",
      });
    }

    const matchPasseord = await user.comparePassword(password);

    if (!matchPasseord) {
      return res.status(401).json({
        success: false,
        code:"INVALID_PASSWORD",
        message: "Incorrect password. Please try again.",
        error: "Invalid Credentials. Incorrect Password",
      });
    }

    await generateToken(user, res, "User logged in successfully", 200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      code:"INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
    });
  }
};

/**
 * @description Logout user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).clearCookie("token").json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @description Get current logged in user details
 * @route GET /api/auth/
 * @access Private
 */
export const getMe = async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      contact: user.contact,
      role: user.role,
    },
  });
};

/**
 * @description Handle Google OAuth callback
 * @route GET /api/auth/google/callback
 * @access Public
 */
export const googleCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;

  const email = emails[0].value;
  const profilePic = photos[0].value;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        googleId: id,
        fullname: displayName,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);

    res.redirect(`${config.FRONTEND_URL}`);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
