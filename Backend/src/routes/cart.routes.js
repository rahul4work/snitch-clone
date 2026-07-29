import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { validateAddToCart } from "../validators/cart.validators.js";
import { addToCart, getCart } from "../controllers/cart.controllers.js";

const router = Router();

/**
 * @route POST /api/carts/add/:productId/:variantId
 * @desc Add item to the cart
 * @access Private
 * @arguments productId: ID of the product to add to the cart
 * @arguments variantId: ID of the variant of the product to add to the cart
 * @arguments quantity: Quantity of the product to add to the cart (optional, default is 1)
 */
router.post(
  "/add/:productId/:variantId",
  authenticateUser,
  validateAddToCart,
  addToCart,
);

/**
 * @route POST /api/carts/add/:productId
 * @desc Add item to the cart
 * @access Private
 * @arguments productId: ID of the product to add to the cart
 * @arguments quantity: Quantity of the product to add to the cart (optional, default is 1)
 */
router.post("/add/:productId", authenticateUser, validateAddToCart, addToCart);

/**
 * @route GET /api/carts
 * @desc Get the user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart);

export default router;
