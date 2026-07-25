import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import Logo from "../../../assets/Logo.png";
import useAuth from "../../auth/hook/useAuth.js";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/seller/dashboard",
  },
  {
    title: "Products",
    icon: Package,
    path: "/seller/products",
  },
  {
    title: "Create Product",
    icon: PlusCircle,
    path: "/seller/create-product",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    path: "/seller/orders",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/seller/customers",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/seller/settings",
  },
];

const SideNavBar = () => {
  const { handleLogout } = useAuth();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const logoutUser = async () => {
    await handleLogout();

    navigate("/login");
  };

  return (
    <aside className="sticky top-0 w-56 h-screen overflow-y-auto bg-linear-to-br from-white to-orange-50/50 border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <button
        onClick={() => navigate("/")}
        className="h-16 flex items-center px-5 cursor-pointer border-b border-gray-200 shrink-0"
      >
        <img src={Logo} alt="SNITCH" className="h-7 w-auto object-contain" />
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.title}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm
                    ${
                      isActive
                        ? "bg-orange-100/50 text-orange-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Seller Card */}
      <div className="p-3 border-t border-gray-200">
        <div
          onClick={() => navigate("/profile")}
          className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-3 text-white cursor-pointer shadow-sm transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {user?.fullname?.charAt(0)?.toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-semibold truncate">
                {user?.fullname || "SNITCH Seller"}
              </h3>
              <span className="text-[10px] text-zinc-300">Seller Account</span>
            </div>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="
            w-full mt-3
            flex items-center justify-center gap-2
            h-9
            rounded-lg
            border border-gray-200
            text-sm text-gray-600
            hover:bg-gray-100 hover:text-gray-900
            transition-colors
            cursor-pointer
          "
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
