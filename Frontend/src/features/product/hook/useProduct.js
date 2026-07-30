import { useDispatch } from "react-redux";
import {
  addProductVariant,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductDetails,
  getSellerProductDetails,
  getSellerProducts,
} from "../service/product.api.js";
import { setProducts, setSellerProducts } from "../state/product.slice.js";

const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    const data = await createProduct(formData);

    return data.product;
  };

  const handleGetSellerProducts = async () => {
    const data = await getSellerProducts();
    dispatch(setSellerProducts(data.products));

    return data.products;
  };

  const handleGetAllProducts = async () => {
    const data = await getAllProducts();
    dispatch(setProducts(data.products));
  };

  const handleDeleteProduct = async (productId) => {
    const data = await deleteProduct(productId);

    return data;
  };

  const handleGetProductDetails = async (productId) => {
    const data = await getProductDetails(productId);

    return data.product;
  };

  const handleGetSellerProductDetails = async (productId) => {
    const data = await getSellerProductDetails(productId);

    return data.product;
  };

  const handleAddProductVariant = async (productId, newProductVariant) => {
    const data = await addProductVariant(productId, newProductVariant);

    return data.product;
  };

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleGetAllProducts,
    handleDeleteProduct,
    handleGetProductDetails,
    handleGetSellerProductDetails,
    handleAddProductVariant,
  };
};

export default useProduct;
