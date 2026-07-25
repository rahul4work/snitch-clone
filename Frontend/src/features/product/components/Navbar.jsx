import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Logo from "../../../assets/Logo.png";
import { Heart, Search, ShoppingCart, User, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleWishlistClick = () => {
    if (user) {
      navigate("/wishlist");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Logo */}
        <div className="w-28 shrink-0 cursor-pointer">
          <img
            onClick={() => navigate("/")}
            src={Logo}
            alt="Snitch"
            className="w-full object-contain"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={`hidden lg:flex items-center gap-2 rounded-full border transition-all duration-300 bg-zinc-50 ${
              searchFocused
                ? "w-72 border-black"
                : "w-44 border-zinc-200 hover:border-zinc-400"
            } py-2 pl-3 pr-4`}
          >
            <Search size={15} className="shrink-0 text-zinc-400" />

            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />

            {searchVal && (
              <button onClick={() => setSearchVal("")} className="shrink-0">
                <X size={13} className="text-zinc-400" />
              </button>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlistClick}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <Heart size={19} className="text-zinc-700 group-hover:text-black" />
          </button>

          {/* Cart */}
          <button className="group relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-zinc-100 transition-colors cursor-pointer">
            <ShoppingCart
              size={19}
              className="text-zinc-700 group-hover:text-black"
            />
          </button>

          {/* Profile */}
          {location.pathname !== "/profile" && (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-full border border-zinc-200 py-1.5 pl-2 pr-3 text-sm font-medium text-zinc-700 hover:border-black hover:text-black transition-colors cursor-pointer"
            >
              <User size={16} />
              <span className="hidden md:block">
                {user?.fullname ? user.fullname.split(" ")[0] : "Profile"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
