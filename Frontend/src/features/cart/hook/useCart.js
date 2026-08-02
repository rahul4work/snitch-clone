import { useDispatch } from "react-redux";
import { addItem, getCart, incrementCartItemApi } from "../service/cart.api.js";
import {
  addItem as addItemToCart,
  setItems,
  incrementCartItem,
} from "../state/cart.slice.js";

const useCart = () => {
  const dispatch = useDispatch();

  const handleAddItem = async ({ productId, variantId }) => {
    const data = await addItem({ productId, variantId });

    if (data?.success) {
      const cartData = await getCart();
      dispatch(setItems(cartData.cart.items));
    }

    return data;
  };

  const handleGetCart = async () => {
    const data = await getCart();
    dispatch(setItems(data.cart.items));
  };

  const handleIncrementCartItem = async ({ productId, variantId }) => {
    const data = await incrementCartItemApi({ productId, variantId });
    dispatch(incrementCartItem({ productId, variantId }));
  };

  return { handleAddItem, handleGetCart, handleIncrementCartItem };
};

export default useCart;
