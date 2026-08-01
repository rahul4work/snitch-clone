import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Logo from "../../../assets/Logo.png";
import Navbar from "../../shared/components/Navbar.jsx";
import useCart from "../hook/useCart.js";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleGetCart } = useCart();

  useEffect(() => {
    handleGetCart();
  }, []);

  const subtotal = cartItems?.reduce(
    (acc, item) => acc + (item.price?.amount || 0) * (item.quantity || 1),
    0,
  );

  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

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
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-8">
          Shopping Cart ({cartItems.length}{" "}
          {cartItems.length === 1 ? "item" : "items"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-zinc-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden border border-zinc-100 bg-zinc-50">
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.product?.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 flex flex-col w-full h-full justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-900 leading-snug">
                        <Link
                          to={`/product/${item.product?._id}`}
                          className="hover:text-orange-500 transition-colors"
                        >
                          {item.product?.title}
                        </Link>
                      </h3>
                      <p className="text-lg font-bold text-zinc-900 shrink-0">
                        ₹{item.price?.amount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                      {item.product?.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-zinc-200 rounded-md bg-white">
                      <button
                        type="button"
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
                        className="p-1.5 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-r-md transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      type="button"
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
            ))}
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
