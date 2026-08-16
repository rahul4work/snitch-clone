import { useDispatch } from "react-redux";
import {
  addItem,
  getCart,
  incrementCartItemApi,
  decrementCartItemApi,
  removeCartItemApi,
} from "../service/cart.api.js";
import {
  addItem as addItemToCart,
  setItems,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} from "../state/cart.slice.js";

const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItem = async ({ productId, variantId }) => {
    const data = await addItem({ productId, variantId });

    if (data?.success) {
      const cartData = await getCart();

      if (cartData?.success) {
        dispatch(setItems(cartData.cart.items));
      }
    }

    return data;
  };

  const handleGetCart = async () => {
    const data = await getCart();

    if (data?.success) {
      dispatch(setItems(data.cart.items));
    }

    return data;
  };

  const handleIncrementCartItem = async ({ productId, variantId }) => {
    const data = await incrementCartItemApi({ productId, variantId });

    if (data?.success) {
      dispatch(incrementCartItem({ productId, variantId }));
    }

    return data;
  };

  const handleDecrementCartItem = async ({ productId, variantId }) => {
    const data = await decrementCartItemApi({ productId, variantId });

    if (data?.success) {
      dispatch(decrementCartItem({ productId, variantId }));
    }

    return data;
  };

  const handleRemoveCartItem = async ({ productId, variantId }) => {
    const data = await removeCartItemApi({ productId, variantId });

    if (data?.success) {
      dispatch(removeCartItem({ productId, variantId }));
    }

    return data;
  };

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleRemoveCartItem,
  };
};

export default useCart;
