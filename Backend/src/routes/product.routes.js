import { Router } from "express";
import { authenticateSeller } from "../middlewares/auth.middlewares.js";
import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { createProductValidator } from "../validators/product.validator.js";
import {
  addProductVariant,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getSellerProductDetails,
  getSellerProducts,
} from "../controllers/product.controllers.js";

const router = Router();

/**
 * @route POST /api/products/
 * @description Create a product by seller
 * @access Private (seller)
 */
router.post(
  "/",
  authenticateSeller,
  uploadProductImages,
  createProductValidator,
  createProduct,
);

/**
 * @route DELETE /api/products/delete/:id
 * @description Delete a product by id
 * @access Private (seller)
 */
router.delete("/delete/:id", authenticateSeller, deleteProduct);

/**
 * @route GET /api/products/seller
 * @description Get all products of a particular seller by seller's id
 * @access Private (seller)
 */
router.get("/seller", authenticateSeller, getSellerProducts);

/**
 * @route GET /api/products/
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts);

/**
 * @route GET /api/products/details/:id
 * @description Get product details by id
 * @access Public
 */
router.get("/details/:id", getProductDetails);

/**
 * @route GET /api/products/seller/details/:id
 * @description Get Seller's product details by id and sellerId
 * @access Private
 */
router.get("/seller/details/:id", authenticateSeller, getSellerProductDetails);

/**
 * @route POST /api/products/:productId/variants
 * @description Add a product variant to a product
 * @access Private (seller)
 */
router.post(
  "/:productId/variants",
  authenticateSeller,
  uploadProductImages,
  addProductVariant,
);

export default router;
