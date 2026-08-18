import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Tag,
  User,
} from "lucide-react";
import useAuth from "../../auth/hook/useAuth.js";

const Profile = () => {
  const { handleLogout } = useAuth();

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const logoutUser = async () => {
    await handleLogout();

    navigate("/login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "address", label: "Address", icon: MapPin },
  ];

  if (user?.role === "seller") {
    menuItems.push({
      id: "seller-dashboard",
      label: "Seller Dashboard",
      icon: LayoutDashboard,
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] lg:overflow-hidden bg-zinc-50">
      {/* Main Content */}
      <main className="w-full max-w-350 mx-auto px-6 py-6 lg:h-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              {/* User Info */}
              <div className="p-6 border-b border-zinc-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xl shrink-0">
                  {user?.fullname?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-zinc-800 line-clamp-1">
                    {user?.fullname || "User"}
                  </h2>
                  <p className="text-sm text-zinc-500 line-clamp-1">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-3 flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 cursor-pointer
                        ${isActive ? "bg-orange-50 text-orange-600 font-medium" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={18}
                          className={
                            isActive ? "text-orange-500" : "text-zinc-400"
                          }
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={
                          isActive ? "text-orange-500" : "text-zinc-300"
                        }
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="p-3 border-t border-zinc-200">
                <button
                  onClick={logoutUser}
                  className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer font-medium"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 min-h-150">
              {activeTab === "overview" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div
                      className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 flex flex-col justify-center items-center text-center hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer group"
                      onClick={() => setActiveTab("orders")}
                    >
                      <Package
                        className="text-orange-500 mb-3 group-hover:scale-110 transition-transform"
                        size={32}
                      />
                      <h3 className="font-semibold text-lg">Orders</h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        Check your order status
                      </p>
                    </div>
                    <div
                      className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 flex flex-col justify-center items-center text-center hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer group"
                      onClick={() => setActiveTab("address")}
                    >
                      <MapPin
                        className="text-orange-500 mb-3 group-hover:scale-110 transition-transform"
                        size={32}
                      />
                      <h3 className="font-semibold text-lg">Addresses</h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        Manage delivery addresses
                      </p>
                    </div>
                    <div
                      className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 flex flex-col justify-center items-center text-center hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer group"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User
                        className="text-orange-500 mb-3 group-hover:scale-110 transition-transform"
                        size={32}
                      />
                      <h3 className="font-semibold text-lg">Profile Details</h3>
                      <p className="text-zinc-500 text-sm mt-1">
                        Edit your profile
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    Profile Details
                  </h2>
                  <div className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={user?.fullname || ""}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        readOnly
                        value={user?.email || ""}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-600 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={user?.contact || "Not added"}
                        className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none"
                      />
                    </div>
                    {user?.role === "seller" && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-600 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          readOnly
                          value="SELLER"
                          className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none font-semibold text-orange-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    My Orders
                  </h2>
                  <div className="text-center py-20 text-zinc-500">
                    <Package size={48} className="mx-auto mb-4 text-zinc-300" />
                    <p>No orders found.</p>
                  </div>
                </div>
              )}

              {activeTab === "coupons" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    My Coupons
                  </h2>
                  <div className="text-center py-20 text-zinc-500">
                    <Tag size={48} className="mx-auto mb-4 text-zinc-300" />
                    <p>No active coupons.</p>
                  </div>
                </div>
              )}

              {activeTab === "address" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    Account Address
                  </h2>
                  <div className="text-center py-20 text-zinc-500">
                    <MapPin size={48} className="mx-auto mb-4 text-zinc-300" />
                    <p>No addresses saved yet.</p>
                  </div>
                </div>
              )}

              {activeTab === "seller-dashboard" && user?.role === "seller" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                    Seller Dashboard
                  </h2>
                  <p className="text-zinc-600 mb-4">
                    Welcome to your seller dashboard. Manage your products and
                    orders here.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <button
                      className="bg-orange-500 text-white p-6 rounded-xl hover:bg-orange-600 transition-colors text-left flex flex-col justify-between h-32 cursor-pointer shadow-md group"
                      onClick={() => navigate("/seller/products")}
                    >
                      <Package
                        size={28}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-semibold text-lg">
                        Manage Products
                      </span>
                    </button>
                    <button
                      className="bg-zinc-800 text-white p-6 rounded-xl hover:bg-zinc-900 transition-colors text-left flex flex-col justify-between h-32 cursor-pointer shadow-md group"
                      onClick={() => navigate("/seller/dashboard")}
                    >
                      <LayoutDashboard
                        size={28}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span className="font-semibold text-lg">
                        Sales Analytics
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
