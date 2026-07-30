import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to the cart
 * @access Private
 * @arguments productId: ID of the product to add to the cart
 * @arguments variantId: ID of the variant of the product to add to the cart
 * @arguments quantity: Quantity of the product to add to the cart (optional, default is 1)
 */
export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body;

  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  let variant = null;

  if (product.variants.length > 0) {
    if (!variantId) {
      return res.status(400).json({
        message: "Please select a variant",
        success: false,
      });
    }

    variant = product.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({
        message: "Variant not found",
        success: false,
      });
    }
  }

  let stock = Infinity;

  if (variant) {
    stock = await stockOfVariant(productId, variantId);
  }

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some((item) => {
    return (
      item.product.toString() === productId &&
      (item.variant?.toString() || null) === (variantId || null)
    );
  });

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        (item.variant?.toString() || null) === (variantId || null),
    ).quantity;

    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock, and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.product": productId,
        ...(variantId && { "items.variant": variantId }),
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `Only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    variant: variantId || undefined,
    quantity,
    price: variant?.price || product.price,
  });

  await cart.save();

  return res.status(201).json({
    message: "Product added to cart successfully",
    success: true,
  });
};

/**
 * @route GET /api/cart
 * @desc Get the user's cart
 * @access Private
 */
export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel
    .findOne({
      user: user._id,
    })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};
