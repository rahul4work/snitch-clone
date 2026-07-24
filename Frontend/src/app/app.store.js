import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.js";
import productRoutes from "../features/product/state/product.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productRoutes,
  },
});

export default store;
