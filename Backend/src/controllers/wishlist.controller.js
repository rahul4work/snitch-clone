import mongoose from "mongoose";

import wishlistModel from "../models/wishlist.model.js";
import productModel from "../models/product.model.js";

/**
 * @route GET /api/wishlist
 * @description Get all wishlisted products with their selected variants
 * @access Private
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await wishlistModel.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title slug description price images variants",
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        code: "WISHLIST_FETCHED",
        message: "Wishlist fetched successfully",
        wishlist: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      code: "WISHLIST_FETCHED",
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      code: "WISHLIST_FETCH_FAILED",
      message: "Failed to fetch wishlist",
    });
  }
};

/**
 * @route POST /api/wishlist/:productId/:variantId
 * @description Add a product variant to the wishlist
 * @access Private
 * @arguments productId: ID of the product to add to the wishlist
 * @arguments variantId: ID of the variant of the product to add to the wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_PRODUCT_ID",
        message: "Invalid product ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_VARIANT_ID",
        message: "Invalid variant ID",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        code: "PRODUCT_NOT_FOUND",
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        success: false,
        code: "VARIANT_NOT_FOUND",
        message: "Variant not found",
      });
    }

    let wishlist = await wishlistModel.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = await wishlistModel.create({
        user: userId,
        items: [
          {
            product: productId,
            variant: variantId,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        code: "PRODUCT_VARIANT_ADDED_TO_WISHLIST",
        message: "Product variant added to wishlist",
      });
    }

    const isProductVariantAlreadyInWishlist = wishlist.items.some((item) => {
      return (
        item.product.toString() === productId &&
        item.variant.toString() === variantId
      );
    });

    if (isProductVariantAlreadyInWishlist) {
      return res.status(409).json({
        success: false,
        code: "PRODUCT_VARIANT_ALREADY_IN_WISHLIST",
        message: "Product variant is already in wishlist",
      });
    }

    wishlist.items.push({
      product: productId,
      variant: variantId,
    });

    await wishlist.save();

    return res.status(201).json({
      success: true,
      code: "PRODUCT_VARIANT_ADDED_TO_WISHLIST",
      message: "Product variant added to wishlist",
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);

    return res.status(500).json({
      success: false,
      code: "ADD_TO_WISHLIST_FAILED",
      message: "Failed to add product variant to wishlist",
    });
  }
};

/**
 * @route DELETE /api/wishlist/:productId/:variantId
 * @description Remove a product variant from the wishlist
 * @access Private
 * @arguments productId: ID of the product to remove from the wishlist
 * @arguments variantId: ID of the variant of the product to remove from the wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_PRODUCT_ID",
        message: "Invalid product ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(variantId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_VARIANT_ID",
        message: "Invalid variant ID",
      });
    }

    const wishlist = await wishlistModel.findOne({
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        code: "WISHLIST_NOT_FOUND",
        message: "Wishlist not found",
      });
    }

    const isProductVariantInWishlist = wishlist.items.some((item) => {
      return (
        item.product.toString() === productId &&
        item.variant.toString() === variantId
      );
    });

    if (!isProductVariantInWishlist) {
      return res.status(404).json({
        success: false,
        code: "PRODUCT_VARIANT_NOT_IN_WISHLIST",
        message: "Product variant not found in wishlist",
      });
    }

    wishlist.items = wishlist.items.filter((item) => {
      return !(
        item.product.toString() === productId &&
        item.variant.toString() === variantId
      );
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      code: "PRODUCT_VARIANT_REMOVED_FROM_WISHLIST",
      message: "Product variant removed from wishlist",
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);

    return res.status(500).json({
      success: false,
      code: "REMOVE_FROM_WISHLIST_FAILED",
      message: "Failed to remove product variant from wishlist",
    });
  }
};