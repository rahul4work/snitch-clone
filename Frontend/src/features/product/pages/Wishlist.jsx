import React from "react";
import { Link } from "react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Wishlist = () => {
  const wishlistItems = [];

  if (!wishlistItems.length) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center">
        <Heart size={48} strokeWidth={1.2} className="text-zinc-400 mb-4" />

        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
          Your wishlist is empty
        </h2>

        <p className="text-zinc-500 mb-8">Save your favourite products here.</p>

        <Link
          to="/"
          className="flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
        >
          Continue Shopping
          <ShoppingBag size={16} />
        </Link>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="w-full max-w-350 mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-sm font-semibold text-orange-500">
              My Wishlist
            </p>

            <h1 className="text-2xl font-semibold text-zinc-900 mt-2">
              Saved Products
            </h1>
          </div>

          <span className="text-sm text-zinc-500">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistItems.map((item) => {
            const product = item.product;

            return (
              <div
                key={item._id}
                className="bg-white border border-zinc-200 shadow-sm group"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-3/4 bg-zinc-100 overflow-hidden">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex justify-between gap-3">
                    <Link
                      to={`/product/${product._id}`}
                      className="font-medium text-zinc-900 hover:text-orange-500 transition-colors"
                    >
                      {product.title}
                    </Link>

                    <button
                      className="text-zinc-400 hover:text-red-500 cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <p className="mt-2 font-semibold text-zinc-900">
                    ₹{product.price?.amount?.toLocaleString("en-IN")}
                  </p>

                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-sm py-2.5 rounded-md hover:bg-orange-500 transition-colors cursor-pointer">
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
