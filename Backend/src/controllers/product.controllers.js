import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

/**
 * @route POST /api/products/
 * @description create a product
 * @access Private (seller)
 */
export const createProduct = async (req, res) => {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(401).json({
        message: "At least one product image is required.",
        success: false,
      });
    }

    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadFile({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
      images,
      seller: seller._id,
    });

    return res.status(200).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

/**
 * @route DELETE /api/products/delete/:id
 * @description Delete a product by id
 * @access Private (seller)
 */
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await product.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

/**
 * @route POST /api/products/seller
 * @description get all products created by a particular seller
 * @access Private (seller)
 */
export const getSellerProducts = async (req, res) => {
  const seller = req.user;

  const products = await productModel.find({
    seller: seller._id,
  });

  return res.status(200).json({
    message: "Seller's all products fetched successfully",
    success: true,
    products,
  });
};

/**
 * @route POST /api/products/
 * @description get all products
 * @access Public
 */
export const getAllProducts = async (req, res) => {
  const products = await productModel.find();

  return res.status(200).json({
    success: false,
    message: "All Products fetched successfully",
    products,
  });
};

/**
 * @route GET /api/products/details/:id
 * @description Get product details by id
 * @access Public
 */
export const getProductDetails = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Prodcut not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product details fetched successfully",
    product,
  });
};

/**
 * @route GET /api/products/seller/details/:id
 * @description Get Seller's product details by id and sellerId
 * @access Private
 */
export const getSellerProductDetails = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findOne({
    _id: id,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  return res.status(200).json({
    success: true,
    product,
  });
};

/**
 * @route POST /api/products/:productId/variants
 * @description Add a product variant to a product
 * @access Private (seller)
 */
export const addProductVariant = async (req, res) => {
  const productId = req.params.productId;

  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  }

  const files = req.files || [];

  const images = await Promise.all(
    files.map((file) =>
      uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      }),
    ),
  );

  const price = req.body.priceAmount || undefined;
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attribute || "{}");

  product.variants.push({
    images,
    price: {
      amount: price || product.price.amount,
      currency: req.body.priceCurrency || product.price.currency,
    },
    stock,
    attributes,
  });

  await product.save();

  return res.status(200).json({
    success: true,
    message: "Product variant added successfully",
    product,
  });
};
