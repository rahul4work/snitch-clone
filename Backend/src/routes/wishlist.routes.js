import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

/**
 * @route GET /api/wishlist/
 * @desc get all the wishlisted products
 * @access Private
 */
router.get("/", authenticateUser, getWishlist);

/**
 * @route POST /api/wishlist/:productId/:variantId
 * @desc add a product to wishlist via productId & variantId
 * @access Provate
 */
router.post("/:productId/:variantId", authenticateUser, addToWishlist);

/**
 * @route DELETE /api/wishlist/:productId/:variantId
 * @desc remove a product from wishlist via productId & variantId
 * @access Private
 */
router.delete(
  "/delete/:productId/:variantId",
  authenticateUser,
  removeFromWishlist,
);

export default router;
