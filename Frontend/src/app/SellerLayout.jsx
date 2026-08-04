import React from "react";
import SideNavBar from "../features/product/components/SideNavBar.jsx";
import { Outlet } from "react-router";

const SellerLayout = () => {
  return (
    <div className="flex h-screen">
      <SideNavBar />

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;
