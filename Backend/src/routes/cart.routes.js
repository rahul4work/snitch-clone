import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  validateAddToCart,
  validateUpdateCartItemQuantity,
} from "../validators/cart.validators.js";
import {
  addToCart,
  decrementCartItemQuantity,
  getCart,
  incrementCartItemQuantity,
} from "../controllers/cart.controllers.js";

const router = Router();

/**
 * @route POST /api/cart/add/:productId/:variantId
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
 * @route GET /api/cart
 * @desc Get the user's cart
 * @access Private
 */
router.get("/", authenticateUser, getCart);

/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment the quantity of an item in the cart by one
 * @access Private
 * @arguments productId: ID of the product to update in the cart
 * @arguments variantId: ID of the variant of the product to update in the cart
 */
router.patch(
  "/quantity/increment/:productId/:variantId",
  authenticateUser,
  validateUpdateCartItemQuantity,
  incrementCartItemQuantity,
);

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc Decrement the quantity of an item in the cart by one
 * @access Private
 * @arguments productId: ID of the product to update in the cart
 * @arguments variantId: ID of the variant of the product to update in the cart
 */
router.patch(
  "/quantity/decrement/:productId/:variantId",
  authenticateUser,
  validateUpdateCartItemQuantity,
  decrementCartItemQuantity,
);

export default router;
