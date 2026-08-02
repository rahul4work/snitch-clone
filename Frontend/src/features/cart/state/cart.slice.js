import { createSlice } from "@reduxjs/toolkit";

const getItemId = (item) =>
  item?._id || `${item?.product ?? "product"}-${item?.variant ?? "default"}`;

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    incrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });
    },
    decrementCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.map((item) => {
        if (item.product._id === productId && item.variant === variantId) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        } else {
          return item;
        }
      });
    },
    removeCartItem: (state, action) => {
      const { productId, variantId } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(item.product._id === productId && item.variant === variantId),
      );
    },
  },
});

export const {
  setItems,
  addItem,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
