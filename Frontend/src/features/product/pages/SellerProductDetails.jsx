import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Plus,
  Trash,
  Upload,
  X,
} from "lucide-react";
import useProduct from "../hook/useProduct.js";

const getCurrencySymbol = (currency) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    default:
      return "₹";
  }
};

const SellerProductDetails = () => {
  const navigate = useNavigate();

  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Variant Form State
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [attributes, setAttributes] = useState({});
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const [priceAmount, setPriceAmount] = useState("");
  const [stock, setStock] = useState("");
  const [variantImages, setVariantImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const { handleGetSellerProductDetails, handleAddProductVariant } =
    useProduct();

  async function fetchProductDetails() {
    try {
      setLoading(true);
      const data = await handleGetSellerProductDetails(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.log("Failed to fetch product details", error);
      navigate("/seller/products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const handleAddAttribute = () => {
    if (newAttrKey.trim() && newAttrValue.trim()) {
      setAttributes((prev) => ({
        ...prev,
        [newAttrKey.trim()]: newAttrValue.trim(),
      }));
      setNewAttrKey("");
      setNewAttrValue("");
    }
  };

  const handleRemoveAttribute = (keyToRemove) => {
    const newAttrs = { ...attributes };
    delete newAttrs[keyToRemove];
    setAttributes(newAttrs);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const sortedFiles = files.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    if (variantImages.length + sortedFiles.length > 7) {
      alert("You can only upload up to 7 images per variant.");
      return;
    }

    setVariantImages((prev) => [...prev, ...sortedFiles]);

    const previews = sortedFiles.map((file) => URL.createObjectURL(file));

    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...variantImages];
    newImages.splice(index, 1);
    setVariantImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSaveVariant = async () => {
    try {
      const finalAttributes = { ...attributes };
      if (newAttrKey.trim() && newAttrValue.trim()) {
        finalAttributes[newAttrKey.trim()] = newAttrValue.trim();
      }

      const newVariant = {
        attributes: finalAttributes,
        stock,
        price: priceAmount,
        images: variantImages.map((file) => ({
          file,
        })),
      };

      const data = await handleAddProductVariant(productId, newVariant);

      setProduct((prev) => ({
        ...prev,
        variants: [
          ...(prev?.variants || []),
          {
            attributes: finalAttributes,
            stock,
            price: {
              amount: Number(priceAmount),
              currency: product?.price?.currency,
            },
            images: imagePreviews.map((url) => ({
              url,
            })),
          },
        ],
      }));

      setAttributes({});
      setNewAttrKey("");
      setNewAttrValue("");
      setPriceAmount("");
      setStock("");
      setVariantImages([]);
      setImagePreviews([]);
      setIsAddingVariant(false);

      console.log("Variant created:", data);
    } catch (error) {
      console.log("Error adding variant", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 text-gray-500">
        <PackageSearch size={48} strokeWidth={1.2} />
        <p className="text-xl font-medium">Product not found</p>
      </div>
    );
  }

  const symbol = getCurrencySymbol(product.price?.currency);
  const amount = product.price?.amount ?? "-";
  const images = product.images ?? [];

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="flex h-auto items-center pb-6 gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-zinc-800 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <span className="text-zinc-500">|</span>
          <span className="text-sm text-zinc-800 truncate font-semibold">
            Manage Product Variants
          </span>
        </div>

        {/* Product Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 w-full flex flex-col sm:flex-row gap-6 items-center">
          {/* Left: Image Gallery (Smaller) */}
          <div className="w-full sm:w-64 shrink-0 flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative overflow-hidden bg-white border border-zinc-200 shadow-sm aspect-square rounded-lg">
              {images.length > 0 ? (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-sm rounded-full p-1 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <img
                    key={selectedImage}
                    src={images[selectedImage]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-opacity duration-300"
                  />

                  <button
                    onClick={handleNextImage}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-sm rounded-full p-1 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-12 h-12 overflow-hidden border-2 rounded transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-orange-500 shadow-sm"
                        : "border-zinc-200 hover:border-orange-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover object-top cursor-pointer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>
            <p className="text-md text-gray-600 leading-relaxed whitespace-pre-line mb-4">
              {product.description}
            </p>

            <hr className="border-gray-200 mb-4" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                {symbol}
                {amount}
              </span>
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                In Stock
              </span>
            </div>
          </div>
        </div>

        {/* Variants Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Product Variants</h2>
          {!isAddingVariant && (
            <button
              onClick={() => setIsAddingVariant(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              Add Variant
            </button>
          )}
        </div>

        {/* Add Variant Form */}
        {isAddingVariant && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Create New Variant
              </h3>
              <button
                onClick={() => setIsAddingVariant(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Col: Attributes & Details */}
              <div className="space-y-6">
                {/* Attributes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Attributes (e.g. Size, Color) *
                  </label>
                  <div className="space-y-3 mb-3">
                    {Object.entries(attributes).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200"
                      >
                        <span className="flex-1 text-sm font-medium text-gray-700">
                          {key}
                        </span>
                        <span className="flex-1 text-sm text-gray-600">
                          {value}
                        </span>
                        <button
                          onClick={() => handleRemoveAttribute(key)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Key (e.g. Size)"
                      value={newAttrKey}
                      onChange={(e) => setNewAttrKey(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. M)"
                      value={newAttrValue}
                      onChange={(e) => setNewAttrValue(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    onClick={handleAddAttribute}
                    className="mt-3 flex items-center gap-1 text-sm text-orange-600 font-medium hover:text-orange-700"
                  >
                    <Plus size={16} /> Add attribute
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Price Amount (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {symbol}
                      </span>
                      <input
                        type="number"
                        placeholder="Default if empty"
                        value={priceAmount}
                        onChange={(e) => setPriceAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Col: Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Images (Max 7, Optional)
                </label>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  {imagePreviews.map((preview, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt={`preview ${idx}`}
                        className="w-full h-full object-cover object-top"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {imagePreviews.length < 7 && (
                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-500 hover:text-orange-500">
                      <Upload size={24} className="mb-1" />
                      <span className="text-xs font-medium">Upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {imagePreviews.length} / 7 images selected
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsAddingVariant(false)}
                className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVariant}
                className="px-5 py-2 rounded-lg font-medium bg-gray-900 text-white hover:bg-black transition-colors cursor-pointer"
              >
                Save Variant
              </button>
            </div>
          </div>
        )}

        {/* Existing Variants List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {product.variants.map((variant, idx) => (
            <div
              key={idx}
              className="w-full max-w-100 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="w-25 h-35 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-gray-200">
                  {variant.images && variant.images.length > 0 ? (
                    <img
                      src={variant.images[0].url}
                      alt="Variant"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-25 h-35 flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-h-28 py-1">
                  {/* Attributes */}
                  <div className="flex flex-wrap gap-2">
                    {variant.attributes &&
                      Object.entries(variant.attributes).map(([k, v]) => (
                        <span
                          key={k}
                          className="px-3 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200"
                        >
                          {k}: {v}
                        </span>
                      ))}
                  </div>

                  {/* Price */}
                  <div className="ml-1">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                      Price
                    </p>

                    <p className="text-xl font-bold text-gray-900">
                      {getCurrencySymbol(
                        variant.price?.currency || product.price?.currency,
                      )}
                      {variant.price?.amount || amount}
                    </p>
                  </div>

                  {/* Stock */}
                  <div className="ml-1">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                        Current Stock
                      </p>

                      <p className="font-medium text-gray-800">
                        {variant.stock || 0} units
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetails;
