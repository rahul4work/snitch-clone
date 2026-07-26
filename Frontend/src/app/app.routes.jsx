import { createBrowserRouter } from "react-router";
import PublicRoute from "../features/auth/components/PublicRoute.jsx";
import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import Home from "../features/product/pages/Home.jsx";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import ProductDetails from "../features/product/pages/ProductDetails.jsx";
import Dashboard from "../features/product/pages/Dashboard.jsx";
import SellerProducts from "../features/product/pages/SellerProducts.jsx";
import SellerProductDetails from "../features/product/pages/SellerProductDetails.jsx";
import CreateProduct from "../features/product/pages/CreateProduct.jsx";
import SellerOrders from "../features/product/pages/SellerOrders.jsx";
import SellerCustomers from "../features/product/pages/SellerCustomers.jsx";
import SellerSettings from "../features/product/pages/SellerSettings.jsx";
import Wishlist from "../features/product/pages/Wishlist.jsx";
import Profile from "../features/product/pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/seller",
    children: [
      {
        path: "/seller/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/create-product",
        element: (
          <ProtectedRoute role="seller">
            <CreateProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/products",
        element: (
          <ProtectedRoute role="seller">
            <SellerProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/product/:productId",
        element: (
          <ProtectedRoute role="seller">
            <SellerProductDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/orders",
        element: (
          <ProtectedRoute role="seller">
            <SellerOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/customers",
        element: (
          <ProtectedRoute role="seller">
            <SellerCustomers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/seller/settings",
        element: (
          <ProtectedRoute role="seller">
            <SellerSettings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/wishlist",
    element: (
      <ProtectedRoute>
        <Wishlist />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

export default router;
