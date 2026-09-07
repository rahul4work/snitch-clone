import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

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

  let cart = await getCartDetails(user._id);

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

/**
 * @route PATCH /api/cart/quantity/increment/:productId/:variantId
 * @desc Increment the quantity of an item in the cart by one
 * @access Private
 * @arguments productId: ID of the product to increment the item in the cart
 * @arguments variantId: ID of the variant of the product to increment the item in the cart
 */
export const incrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product or variant not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const stock = await stockOfVariant(productId, variantId);

  const itemQuantityInCart =
    cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant?.toString() === variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${stock} items left in stock, and you already have ${itemQuantityInCart} items in your cart`,
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": 1 } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Cart item quantity incremented successfully",
  });
};

/**
 * @route PATCH /api/cart/quantity/decrement/:productId/:variantId
 * @desc Decrement the quantity of an item in the cart by one
 * @access Private
 * @arguments productId: ID of the product to decrement the item in the cart
 * @arguments variantId: ID of the variant of the product to decrement the item in the cart
 */
export const decrementCartItemQuantity = async (req, res) => {
  const { productId, variantId } = req.params;

  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product or variant not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const cartItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }

  if (cartItem.quantity <= 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity cannot be less than 1",
    });
  }

  await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variant": variantId,
    },
    { $inc: { "items.$.quantity": -1 } },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Cart item quantity decremented successfully",
  });
};

/**
 * @route DELETE /api/cart/remove/:productId/:variantId
 * @desc Remove an item from the cart
 * @access Private
 * @arguments productId: ID of the product to remove from the cart
 * @arguments variantId: ID of the variant to remove from the cart
 */
export const removeCartItem = async (req, res) => {
  const { productId, variantId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const cartItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant?.toString() === variantId,
  );

  if (!cartItem) {
    return res.status(404).json({
      success: false,
      message: "Item not found in cart",
    });
  }

  await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: {
        items: {
          product: productId,
          variant: variantId,
        },
      },
    },
    { new: true },
  );

  return res.status(200).json({
    success: true,
    message: "Item removed from cart successfully",
  });
};

/**
 * @route POST /api/cart/payment/create/order
 * @desc Create an order for the items in the cart and initiate payment
 * @access Private
 */
export const createOrderController = async (req, res) => {
  const cart = await getCartDetails(req.user._id);

  if (!cart) {
    return res.status(400).json({
      message: "Cart is empty",
      success: false,
    });
  }

  const order = await createOrder({
    amount: cart.totalPrice,
    currency: cart.currency,
  });

  const payment = await paymentModel.create({
    user: req.user._id,
    razorpay: {
      orderId: order.id,
    },
    price: {
      amount: cart.totalPrice,
      currency: cart.currency,
    },
    orderItems: cart.items.map((item) => ({
      title: item.product.title,
      productId: item.product._id,
      variantId: item.variant,
      quantity: item.quantity,
      images: item.selectedVariant?.images?.length
        ? item.selectedVariant.images
        : item.product.images,
      description: item.product.description,
      price: {
        amount:
          item.selectedVariant?.price?.amount ?? item.product.price.amount,

        currency:
          item.selectedVariant?.price?.currency ?? item.product.price.currency,
      },
    })),
  });

  return res.status(200).json({
    message: "Order created successfully",
    success: true,
    order,
  });
};

/**
 * @route POST /api/cart/payment/verify/order
 * @desc Verify the payment for the order created from the cart
 * @access Private
 */
export const verifyOrderController = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const payment = await paymentModel.findOne({
    "razorpay.orderId": razorpay_order_id,
    status: "pending",
  });

  if (!payment) {
    return res.status(404).json({
      message: "Payment not found or already processed",
      success: false,
    });
  }

  const isPaymentValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    config.RAZORPAY_KEY_SECRET,
  );

  if (!isPaymentValid) {
    payment.status = "failed";
    await payment.save();

    return res.status(400).json({
      message: "Payment verification failed",
      success: false,
    });
  }

  payment.status = "paid";

  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;

  await payment.save();

  return res.status(200).json({
    message: "Payment verified successfully",
    success: true,
  });
};
