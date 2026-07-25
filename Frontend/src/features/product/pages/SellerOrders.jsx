import React from "react";
import SideNavBar from "../components/SideNavBar.jsx";

const SellerOrders = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavBar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shrink-0 shadow-xs">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Orders
            </h1>
            <div className="mx-3 text-gray-600"> | </div>
            <p className="text-sm text-gray-500 font-medium">
              Manage your orders
            </p>
          </div>
        </header>
      </div>
    </div>
  );
};

export default SellerOrders;
