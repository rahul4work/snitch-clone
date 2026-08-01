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
import Cart from "../features/cart/pages/Cart.jsx";
import AppLayout from "./AppLayout.jsx";
import SellerLayout from "./SellerLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/:productId",
    element: <ProductDetails />,
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
    element: <AppLayout />,
    children: [
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
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
    ],
  },
  {
    element: (
      <ProtectedRoute role="seller">
        <SellerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/seller/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/seller/products",
        element: <SellerProducts />,
      },
      {
        path: "/seller/create-product",
        element: <CreateProduct />,
      },
      {
        path: "/seller/orders",
        element: <SellerOrders />,
      },
      {
        path: "/seller/customers",
        element: <SellerCustomers />,
      },
      {
        path: "/seller/settings",
        element: <SellerSettings />,
      },
    ],
  },
  {
    path: "/seller/product/:productId",
    element: (
      <ProtectedRoute role="seller">
        <SellerProductDetails />
      </ProtectedRoute>
    ),
  },
]);

export default router;
