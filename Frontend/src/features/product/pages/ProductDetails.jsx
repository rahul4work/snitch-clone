import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useProduct } from "../hook/useProduct";
import { ChevronLeft, ChevronRight, Lock, RotateCcw, Shield, ShoppingCart, Truck, Zap } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

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

const normalizeAttributes = (attributes) => {
  if (!attributes) return {};
  if (attributes instanceof Map) {
    return Object.fromEntries(attributes);
  }
  return attributes;
};

const getAttributeGroups = (variants = []) => {
  const groups = {};

  variants.forEach((variant) => {
    const attrs = normalizeAttributes(variant.attributes);
    Object.entries(attrs).forEach(([key, value]) => {
      if (!key || !value) return;
      if (!groups[key]) groups[key] = new Set();
      groups[key].add(value);
    });
  });

  return groups;
};

const findMatchingVariant = (variants, selectedAttributes) => {
  const entries = Object.entries(selectedAttributes);
  if (entries.length === 0) return null;

  return variants.find((variant) => {
    const attrs = normalizeAttributes(variant.attributes);
    return entries.every(([key, value]) => attrs[key] === value);
  });
};

const StockBadge = ({ stock, isDefault }) => {
  if (isDefault) {
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        In Stock
      </span>
    );
  }

  const label =
    stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";

  const styles =
    stock > 10
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : stock > 0
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-red-50 text-red-600 border-red-100";

  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles}`}
    >
      {label}
    </span>
  );
};

const ProductDetails = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useDefaultProduct, setUseDefaultProduct] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const { handleGetProductDetails } = useProduct();

  async function fetchProductDetails() {
    try {
      setLoading(true);
      const data = await handleGetProductDetails(productId);
      setProduct(data?.product || data);
    } catch (error) {
      console.log("Failed to fetch product details", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    setUseDefaultProduct(true);
    setSelectedAttributes({});
    setSelectedImage(0);
  }, [product]);

  const variants = product?.variants ?? [];

  const attributeGroups = useMemo(
    () => getAttributeGroups(variants),
    [variants],
  );

  const selectedVariant = useMemo(() => {
    if (useDefaultProduct) return null;
    return findMatchingVariant(variants, selectedAttributes);
  }, [useDefaultProduct, variants, selectedAttributes]);

  const symbol = getCurrencySymbol(
    selectedVariant?.price?.currency || product?.price?.currency,
  );

  const amount =
    selectedVariant?.price?.amount ?? product?.price?.amount ?? "-";

  const displayImages = useMemo(() => {
    if (useDefaultProduct || !selectedVariant) {
      return product?.images ?? [];
    }
    return selectedVariant.images?.length > 0
      ? selectedVariant.images
      : (product?.images ?? []);
  }, [useDefaultProduct, selectedVariant, product?.images]);

  const stock = useDefaultProduct ? null : Number(selectedVariant?.stock ?? 0);

  const handleSelectDefault = () => {
    setUseDefaultProduct(true);
    setSelectedAttributes({});
    setSelectedImage(0);
  };

  const handleSelectAttribute = (attrKey, value) => {
    setUseDefaultProduct(false);
    setSelectedAttributes((prev) => ({ ...prev, [attrKey]: value }));
    setSelectedImage(0);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-500">Loading product…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center gap-3 text-zinc-500">
        <ShoppingCart size={40} strokeWidth={1.2} />
        <p className="text-base font-medium">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="w-full max-w-350 mx-auto px-6 py-10">
        <div className="flex h-auto items-center pb-4 gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-sm text-zinc-800 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <span className="text-zinc-500">|</span>
          <span className="text-sm text-zinc-800 truncate">
            {product.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-stretch">
          {/* Image gallery — original size */}
          <div className="flex flex-row gap-4 lg:h-150">
            {displayImages.length > 1 && (
              <div className="flex flex-col gap-3 max-lg:max-h-150 lg:h-150 overflow-y-auto overflow-x-hidden pr-2 no-scrollbar">
                {displayImages.map((img, idx) => (
                  <button
                    key={img._id || idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 shrink-0 overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-orange-500 shadow-md"
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

            <div className="relative overflow-hidden bg-white border border-zinc-200 shadow-sm flex-1 aspect-square max-lg:max-h-100 lg:aspect-auto lg:h-150">
              {displayImages.length > 0 ? (
                <>
                  {displayImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition-all cursor-pointer"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition-all cursor-pointer"
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}
                  <img
                    key={selectedImage}
                    src={displayImages[selectedImage]?.url}
                    alt={product.title}
                    className="w-full h-full object-cover object-top transition-opacity duration-300"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Product info — compact spacing, matches image height */}
          <div className="flex flex-col max-lg:gap-4 lg:h-150 lg:overflow-y-auto no-scrollbar gap-5">
            <div className="space-y-1">
              <h1 className="text-lg sm:text-2xl font-semibold text-zinc-900 leading-snug tracking-tight">
                {product.title}
              </h1>
              <p className="text-md text-zinc-500 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {symbol}
                {amount}
              </span>
              <StockBadge stock={stock} isDefault={useDefaultProduct} />
            </div>

            {variants.length > 0 && (
              <div className="space-y-2">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Product Option
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSelectDefault}
                      className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                        useDefaultProduct
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600"
                      }`}
                    >
                      Default
                    </button>
                  </div>
                </div>

                {Object.keys(attributeGroups).length > 0 && (
                  <div className="flex flex-wrap items-start gap-5 pt-0.5">
                    {Object.entries(attributeGroups).map(
                      ([attrKey, values], index) => (
                        <React.Fragment key={attrKey}>
                          {index > 0 && (
                            <div
                              className="hidden sm:block w-px self-stretch bg-zinc-200 shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <div className="min-w-0 flex-1 sm:flex-none sm:min-w-25">
                            <p className="text-[12px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                              {attrKey}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {[...values].map((value) => {
                                const active =
                                  !useDefaultProduct &&
                                  selectedAttributes[attrKey] === value;

                                return (
                                  <button
                                    key={value}
                                    onClick={() =>
                                      handleSelectAttribute(attrKey, value)
                                    }
                                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                                      active
                                        ? "border-orange-500 bg-orange-50 text-orange-600"
                                        : "border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600"
                                    }`}
                                  >
                                    {value}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </React.Fragment>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                { icon: Truck, label: "Free delivery" },
                { icon: Shield, label: "1-year warranty" },
                { icon: RotateCcw, label: "Easy returns" },
                { icon: Lock, label: "Secure payments" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-sm text-zinc-500"
                >
                  <Icon size={13} className="text-orange-500 shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-4 text-xs border-t border-zinc-200 pt-2">
              <div>
                <span className="text-zinc-400 uppercase tracking-wide text-[12px]">
                  Brand
                </span>
                <p className="font-medium text-sm text-zinc-700 mt-0.5">
                  {product.title}
                </p>
              </div>
              <div className="w-px bg-zinc-200 shrink-0" />
              <div>
                <span className="text-zinc-400 uppercase tracking-wide text-[12px]">
                  Category
                </span>
                <p className="font-medium text-sm text-zinc-700 mt-0.5">
                  Accessories
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-1">
              <button
                onClick={() => {
                  handleAddItem({
                    productId: product._id,
                    variantId: useDefaultProduct
                      ? variants[0]?._id
                      : selectedVariant?._id,
                  });
                }}
                id="btn-add-to-cart"
                className="flex-1 flex items-center justify-center gap-1.5 border border-orange-500 text-orange-500 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-orange-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
              <button
                id="btn-buy-now"
                className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm shadow-orange-200/60 hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
