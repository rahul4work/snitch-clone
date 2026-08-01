import React from "react";
import { Outlet } from "react-router";
import Navbar from "../features/shared/components/Navbar.jsx";

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default AppLayout;
