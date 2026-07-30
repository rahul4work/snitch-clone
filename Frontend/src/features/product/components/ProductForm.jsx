import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, UploadCloud } from "lucide-react";
import useProduct from "../hook/useProduct.js";

const ProductForm = ({ productData, setProductData }) => {
  const { handleCreateProduct } = useProduct();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const sortedImages = [...files].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );

      setProductData((prev) => ({
        ...prev,
        images: sortedImages,
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!productData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!productData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (productData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!productData.price) {
      newErrors.price = "Price is required";
    } else if (Number(productData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (productData.images.length === 0) {
      newErrors.images = "Please upload at least one image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const form = new FormData();

      form.append("title", productData.title);
      form.append("description", productData.description);
      form.append("priceAmount", productData.price);
      form.append("priceCurrency", productData.currency);

      productData.images.forEach((image) => {
        form.append("images", image);
      });

      await handleCreateProduct(form);

      setSuccess(true);

      setTimeout(() => {
        navigate("/seller/products");
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrors({
        submit: error?.response?.data?.message || "Failed to create product",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 border-b pb-2.5 border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Basic Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide the essential information about your product.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
          ✅ Product created successfully. Redirecting...
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
          {errors.submit}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Product Title
          </label>
          <input
            type="text"
            name="title"
            value={productData.title}
            onChange={handleChange}
            placeholder="e.g., Premium Oversized Polo T-Shirt"
            className={`w-full h-11 px-4 rounded-lg border outline-none text-sm bg-gray-50/50 transition-all
              ${
                errors.title
                  ? "border-red-400 bg-red-50/20"
                  : "border-gray-300 hover:border-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              }
            `}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={5}
            name="description"
            value={productData.description}
            onChange={handleChange}
            placeholder="Write a comprehensive description highlighting key features..."
            className={`w-full p-4 rounded-lg border outline-none resize-none text-sm bg-gray-50/50 transition-all leading-relaxed
              ${
                errors.description
                  ? "border-red-400 bg-red-50/20"
                  : "border-gray-300 hover:border-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              }
            `}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1.5 font-medium">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Product Images
            </label>
            <label
              className={`flex flex-col items-center justify-center h-30 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-gray-50/50 group
                ${errors.images ? "border-red-400" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/30"}
              `}
            >
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex flex-col items-center text-center px-4">
                <UploadCloud
                  className={`mb-2 w-6 h-6 ${errors.images ? "text-red-400" : "text-gray-400 group-hover:text-orange-500 transition-colors"}`}
                />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload files
                </p>
                {productData.images.length > 0 ? (
                  <p className="mt-1 text-orange-600 text-xs font-semibold">
                    {productData.images.length} file(s) selected
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                )}
              </div>
            </label>
            {errors.images && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.images}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Price
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`flex-1 h-11 px-4 rounded-lg border outline-none text-sm bg-gray-50/50 transition-all
                  ${
                    errors.price
                      ? "border-red-400 bg-red-50/20"
                      : "border-gray-300 hover:border-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  }
                `}
              />
              <div className="relative w-24">
                <select
                  value={productData.currency}
                  onChange={(e) =>
                    setProductData((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  className="w-full h-11 px-3 pr-8 rounded-lg border border-gray-300 bg-gray-50/50 text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JYP</option>
                  <option>INR</option>
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
              </div>
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.price}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            disabled={loading}
            className="px-5 h-10 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 h-10 rounded-lg bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            {loading ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
