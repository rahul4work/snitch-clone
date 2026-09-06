import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import {
  validateAddToCart,
  validateRemoveCartItem,
  validateUpdateCartItemQuantity,
} from "../validators/cart.validators.js";
import {
  addToCart,
  createOrderController,
  decrementCartItemQuantity,
  getCart,
  incrementCartItemQuantity,
  removeCartItem,
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

/**
 * @route DELETE /api/cart/delete/:productId/:variantId
 * @desc Remove an item from the cart
 * @access Private
 * @arguments productId: ID of the product to remove an item from the cart
 * @arguments variantId: ID of the variant of the product to remove an item from the cart
 */
router.delete(
  "/remove/:productId/:variantId",
  authenticateUser,
  validateRemoveCartItem,
  removeCartItem,
);

/**
 * @route POST /api/cart/payment/create/order
 * @desc Create an order for the items in the cart and initiate the payment
 * @access Private
 */
router.post("/payment/create/order", authenticateUser, createOrderController);

export default router;
