import axios from "axios";

const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});

export const addItem = async ({ productId, variantId }) => {
  const url = variantId
    ? `/add/${productId}/${variantId}`
    : `/add/${productId}`;

  const response = await cartApiInstance.post(url, { quantity: 1 });

  return response.data;
};

export const getCart = async () => {
  const response = await cartApiInstance.get("/");

  return response.data;
};

export const incrementCartItemApi = async ({ productId, variantId }) => {
  const url = `/quantity/increment/${productId}/${variantId}`;
  const response = await cartApiInstance.patch(url);
  return response.data;
};

export const decrementCartItemApi = async ({ productId, variantId }) => {
  const url = `/quantity/decrement/${productId}/${variantId}`;
  const response = await cartApiInstance.patch(url);
  return response.data;
};

export const removeCartItemApi = async ({ productId, variantId }) => {
  const url = `/remove/${productId}/${variantId}`;
  const response = await cartApiInstance.delete(url);
  return response.data;
};

export async function createCartOrder() {
  const response = await cartApiInstance.post("/payment/create/order");
  return response.data;
}

export async function verifyCartOrder({razorpay_order_id, razorpay_payment_id, razorpay_signature}) {
  const response = await cartApiInstance.post("/payment/verify/order", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data;
}