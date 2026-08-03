import React from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../features/shared/components/Navbar.jsx";

const AppLayout = () => {
  const location = useLocation();

  const showAnnouncementBar = location.pathname === "/";

  return (
    <>
      {/* ── Announcement Bar ── */}
      {showAnnouncementBar && (
        <div className="bg-black py-2 overflow-hidden">
          <div className="marquee-track whitespace-nowrap text-xs tracking-[0.2em] uppercase text-white font-medium">
            <span className="mx-10">Free Shipping On Orders Above ₹999</span>
            <span className="mx-10">
              Use Code <span className="text-orange-400">SNITCH10</span> For 10%
              Off
            </span>
            <span className="mx-10">New Summer Collection Live Now</span>
            <span className="mx-10">Free Shipping On Orders Above ₹999</span>
            <span className="mx-10">
              Use Code <span className="text-orange-400">SNITCH10</span> For 10%
              Off
            </span>
            <span className="mx-10">New Summer Collection Live Now</span>
          </div>
        </div>
      )}
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
