import { createSlice } from "@reduxjs/toolkit";

const buildProductMap = (products = []) => {
  const map = {};

  (products || []).forEach((product) => {
    if (product?._id) {
      map[product._id] = product;
    }
  });

  return map;
};

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    products: [],
    productsById: {},
    currentProduct: null,
  },
  reducers: {
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
      state.productsById = {
        ...state.productsById,
        ...buildProductMap(action.payload),
      };
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      state.productsById = {
        ...state.productsById,
        ...buildProductMap(action.payload),
      };
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;

      if (action.payload?._id) {
        state.productsById[action.payload._id] = action.payload;
      }
    },
  },
});

export const { setSellerProducts, setProducts, setCurrentProduct } =
  productSlice.actions;

export default productSlice.reducer;
