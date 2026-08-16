import React, { useEffect } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import {
  ArrowRight,
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import useCart from "../hook/useCart.js";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const productMap = useSelector((state) => state.product.productsById);
  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
  } = useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + (item.price?.amount || 0) * (item.quantity || 1),
    0,
  );

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  const getProductId = (item) => item?.product?._id || item?.product;

  const getVariantId = (item) => item?.variant?._id || item?.variant;

  const getItemId = (item) =>
    item?._id ||
    `${item?.product?._id || "product"}-${item?.variant || "default"}`;

  const normalizeAttributes = (attributes) => {
    if (!attributes) return {};
    if (attributes instanceof Map) {
      return Object.fromEntries(attributes);
    }
    if (attributes?.toJSON && typeof attributes.toJSON === "function") {
      return attributes.toJSON();
    }

    return attributes;
  };

  const normalizeValue = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getVariantForItem = (item, product) => {
    const variantId = getVariantId(item);

    return product?.variants?.find((variant) => variant?._id === variantId);
  };

  const getVariantLabel = (item) => {
    const product = productMap[item?.product?._id] || item.product;
    const variant = getVariantForItem(item, product);

    if (!variant?.attributes) {
      return "Default variant";
    }

    const attributeEntries = Object.entries(
      normalizeAttributes(variant.attributes),
    );

    return attributeEntries.length > 0
      ? attributeEntries.map(([key, value]) => `${key}: ${value}`).join(" • ")
      : "Default variant";
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-4">
          <ShoppingCart
            size={48}
            strokeWidth={1.2}
            className="text-zinc-400 mb-4"
          />
          <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-zinc-500 mb-8 text-center max-w-sm leading-relaxed">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-sm shadow-orange-200/60 hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Shopping
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="w-full max-w-350 mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-sm text-zinc-800 hover:text-orange-500 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <span className="text-zinc-300">|</span>

            <p className="uppercase tracking-[0.25em] text-md font-semibold text-orange-500">
              Shopping Cart
            </p>
          </div>

          <div className="flex items-center justify-center bg-orange-50 border border-orange-100 rounded-md px-2.5 py-0.5">
            <span className="text-sm font-bold text-orange-500 flex items-center gap-1">
              {cartItems.length}
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                {cartItems.length === 1 ? "Item" : "Items"}
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => {
              const itemId = getItemId(item);
              const productId = getProductId(item);
              const variantId = getVariantId(item);
              const product = productMap[item?.product?._id] || item.product;
              const variant = getVariantForItem(item, product);
              const displayPrice =
                variant?.price?.amount ??
                item.price?.amount ??
                product?.price?.amount ??
                0;
              const stockValue = Number(variant?.stock ?? product?.stock ?? 0);
              const remainingStock = Math.max(
                stockValue - (item.quantity || 1),
                0,
              );
              const stockLabel =
                stockValue > 0 ? `${remainingStock} left` : "Out of stock";
              const stockBadgeClass =
                remainingStock <= 0
                  ? "bg-red-100 text-red-600"
                  : remainingStock <= 2
                    ? "bg-amber-100 text-amber-700"
                    : "bg-zinc-100 text-zinc-600";
              const selectedVariantImages = variant?.images ?? [];

              const variantColour = normalizeAttributes(
                variant?.attributes,
              ).Colour;

              const sameColourVariant = product?.variants?.find(
                (variantItem) => {
                  if (variantItem?._id === variant?._id) {
                    return false;
                  }

                  const attributes = normalizeAttributes(
                    variantItem?.attributes,
                  );

                  return (
                    normalizeValue(attributes?.Colour) ===
                      normalizeValue(variantColour) &&
                    variantItem?.images?.length > 0
                  );
                },
              );

              const itemImage =
                selectedVariantImages?.[0]?.url ||
                sameColourVariant?.images?.[0]?.url ||
                product?.images?.[0]?.url ||
                item.product?.images?.[0]?.url ||
                "https://via.placeholder.com/150";

              return (
                <div
                  key={itemId}
                  className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                >
                  <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden border border-zinc-100 bg-zinc-50">
                    <img
                      src={itemImage}
                      alt={product?.title || item.product?.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col w-full h-full justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 leading-snug">
                          <Link
                            to={`/product/${product?._id || item.product?._id}`}
                            className="hover:text-orange-500 transition-colors"
                          >
                            {product?.title || item.product?.title}
                          </Link>
                        </h3>
                        <p className="text-lg font-bold text-zinc-900 shrink-0">
                          ₹{displayPrice?.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-zinc-500">
                          {getVariantLabel(item)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${stockBadgeClass}`}
                        >
                          {stockLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-zinc-200 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            handleDecrementCartItem({ productId, variantId })
                          }
                          className="p-1.5 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-l-md transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleIncrementCartItem({ productId, variantId })
                          }
                          className="p-1.5 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-r-md transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCartItem({ productId, variantId })
                        }
                        className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors cursor-pointer group"
                      >
                        <Trash2
                          size={16}
                          className="group-hover:stroke-red-500 transition-colors"
                        />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-zinc-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-zinc-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    ₹{subtotal?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-zinc-600 pb-4 border-b border-zinc-100">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-zinc-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `₹${shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-semibold text-zinc-900">
                    Order total
                  </span>
                  <span className="text-xl font-bold text-zinc-900">
                    ₹{total?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-sm shadow-orange-200/60 hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-zinc-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-1"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
