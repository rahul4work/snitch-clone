import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  RotateCcw,
  Shield,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import useProduct from "../hook/useProduct.js";
import { setCurrentProduct } from "../state/product.slice.js";
import useCart from "../../cart/hook/useCart.js";

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
  if (attributes?.toJSON && typeof attributes.toJSON === "function") {
    return attributes.toJSON();
  }
  return attributes;
};

const normalizeProductForUI = (productData) => {
  if (!productData) return null;

  return {
    ...productData,
    variants: (productData.variants || []).map((variant) => ({
      ...variant,
      attributes: normalizeAttributes(variant?.attributes),
    })),
  };
};

const getAttributeGroups = (variants = []) => {
  const groups = {};

  variants.forEach((variant) => {
    const attrs = normalizeAttributes(variant.attributes);

    Object.entries(attrs).forEach(([key, value]) => {
      if (!key || !value) return;

      if (!groups[key]) {
        groups[key] = new Set();
      }

      groups[key].add(value);
    });
  });

  // Define the preferred order for specific attributes
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  Object.keys(groups).forEach((key) => {
    const values = [...groups[key]];

    if (normalizeValue(key) === "size") {
      values.sort((a, b) => {
        const indexA = sizeOrder.indexOf(String(a).toUpperCase());
        const indexB = sizeOrder.indexOf(String(b).toUpperCase());

        // Known sizes follow predefined order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // Known sizes come before unknown values
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // Unknown sizes are sorted alphabetically
        return String(a).localeCompare(String(b));
      });
    }

    groups[key] = values;
  });

  return groups;
};

const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getVariantImagesByColour = (variants, selectedVariant, productImages) => {
  if (!selectedVariant) {
    return productImages ?? [];
  }

  // If selected variant already has images, use them
  if (selectedVariant.images?.length > 0) {
    return selectedVariant.images;
  }

  const selectedAttributes = normalizeAttributes(selectedVariant.attributes);

  const selectedColour = selectedAttributes.Colour;

  // If variant doesn't have a colour attribute,
  // fallback to product images
  if (!selectedColour) {
    return productImages ?? [];
  }

  // Find another variant having the same colour and images
  const sameColourVariant = variants.find((variant) => {
    if (variant._id === selectedVariant._id) {
      return false;
    }

    const attributes = normalizeAttributes(variant.attributes);

    const variantColour = attributes.Colour;

    return (
      normalizeValue(variantColour) === normalizeValue(selectedColour) &&
      variant.images?.length > 0
    );
  });

  if (sameColourVariant) {
    return sameColourVariant.images;
  }

  // No same-colour variant has images
  return productImages ?? [];
};

const findMatchingVariant = (variants, selectedAttributes) => {
  const entries = Object.entries(selectedAttributes);
  if (entries.length === 0) return null;

  const exactMatch = variants.find((variant) => {
    const attrs = normalizeAttributes(variant.attributes);
    return entries.every(
      ([key, value]) => normalizeValue(attrs[key]) === normalizeValue(value),
    );
  });

  if (exactMatch) return exactMatch;

  return (
    variants.find((variant) => {
      const attrs = normalizeAttributes(variant.attributes);
      return entries.every(([key, value]) => {
        const attrValue = attrs[key];
        return (
          !attrValue || normalizeValue(attrValue) === normalizeValue(value)
        );
      });
    }) || null
  );
};

const resolveSelectionFromVariants = (variants, selection) => {
  const entries = Object.entries(selection);
  if (entries.length === 0) return {};

  const matchingVariants = variants.filter((variant) => {
    const attrs = normalizeAttributes(variant.attributes);
    return entries.every(([key, value]) => {
      const attrValue = attrs[key];
      return normalizeValue(attrValue) === normalizeValue(value);
    });
  });

  if (matchingVariants.length === 0) {
    return entries.length > 1 ? { [entries[0][0]]: entries[0][1] } : selection;
  }

  if (matchingVariants.length === 1) {
    const resolvedAttributes = normalizeAttributes(
      matchingVariants[0].attributes,
    );
    const resolvedSelection = { ...selection };

    Object.entries(resolvedAttributes).forEach(([key, value]) => {
      if (!resolvedSelection[key]) {
        resolvedSelection[key] = value;
      }
    });

    return resolvedSelection;
  }

  return selection;
};

const StockBadge = ({ stock, isDefault }) => {
  if (isDefault) {
    return (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
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
  const [cartMessage, setCartMessage] = useState("");
  const [cartButtonLabel, setCartButtonLabel] = useState("Add to Cart");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { handleGetProductDetails } = useProduct();

  const { handleAddItem } = useCart();

  async function fetchProductDetails() {
    try {
      setLoading(true);
      const data = await handleGetProductDetails(productId);
      const normalizedProduct = normalizeProductForUI(data?.product || data);
      setProduct(normalizedProduct);
      dispatch(setCurrentProduct(normalizedProduct));
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [productId]);

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

    return getVariantImagesByColour(variants, selectedVariant, product?.images);
  }, [useDefaultProduct, selectedVariant, variants, product?.images]);

  const isAttributeValueAvailable = (
    variants,
    selectedAttributes,
    attrKey,
    value,
  ) => {
    const otherSelections = Object.entries(selectedAttributes).filter(
      ([key]) => key !== attrKey,
    );

    return variants.some((variant) => {
      const attrs = normalizeAttributes(variant.attributes);

      // Attribute value must match
      if (normalizeValue(attrs[attrKey]) !== normalizeValue(value)) {
        return false;
      }

      // Other selected attributes must also match
      const matchesOtherSelections = otherSelections.every(
        ([key, selectedValue]) =>
          normalizeValue(attrs[key]) === normalizeValue(selectedValue),
      );

      if (!matchesOtherSelections) {
        return false;
      }

      // Variant must have stock
      return Number(variant.stock ?? 0) > 0;
    });
  };

  const stock = useDefaultProduct ? null : Number(selectedVariant?.stock ?? 0);
  const isAddToCartDisabled =
    variants.length > 0 && (useDefaultProduct || !selectedVariant);

  const handleSelectAttribute = (attrKey, value) => {
    setUseDefaultProduct(false);
    setSelectedAttributes((prev) => {
      const nextSelection = { [attrKey]: value };

      Object.entries(prev).forEach(([key, selectedValue]) => {
        if (key === attrKey) return;

        const testSelection = { ...nextSelection, [key]: selectedValue };
        const matchingVariants = variants.filter((variant) => {
          const attrs = normalizeAttributes(variant.attributes);
          return Object.entries(testSelection).every(
            ([selectionKey, selectionValue]) => {
              const attrValue = attrs[selectionKey];
              return (
                normalizeValue(attrValue) === normalizeValue(selectionValue)
              );
            },
          );
        });

        if (matchingVariants.length > 0) {
          nextSelection[key] = selectedValue;
        }
      });

      return resolveSelectionFromVariants(variants, nextSelection);
    });
    setSelectedImage(0);
  };

  const handleAddToCart = async () => {
    if (isAddToCartDisabled) return;

    const selectedVariantId = useDefaultProduct
      ? variants[0]?._id
      : selectedVariant?._id;

    const result = await handleAddItem({
      productId: product._id,
      variantId: selectedVariantId,
    });

    if (result?.success) {
      setCartMessage("Added to cart successfully");
      setCartButtonLabel("Go to Cart");

      window.setTimeout(() => {
        setCartMessage("");
        setCartButtonLabel("Add to Cart");
      }, 2000);
    }
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
    <div className="min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] lg:overflow-hidden bg-zinc-50">
      <div className="w-full max-w-350 mx-auto px-6 py-6 lg:h-full">
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

          {/* Product info */}
          <div className="flex flex-col max-lg:gap-4 gap-5">
            <div className="space-y-1">
              <h1 className="text-lg sm:text-2xl font-semibold text-zinc-900 leading-snug tracking-tight">
                {product.title}
              </h1>
              <p className="text-md text-zinc-500 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-200">
              <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                {symbol}
                {amount}
              </span>
              <StockBadge stock={stock} isDefault={useDefaultProduct} />
            </div>

            {variants.length > 0 && (
              <div className="space-y-3">
                {Object.keys(attributeGroups).length > 0 &&
                  Object.entries(attributeGroups).map(([attrKey, values]) => (
                    <div key={attrKey}>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                        {attrKey}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[...values].map((value) => {
                          const active =
                            !useDefaultProduct &&
                            normalizeValue(selectedAttributes[attrKey]) ===
                              normalizeValue(value);

                          const available = isAttributeValueAvailable(
                            variants,
                            selectedAttributes,
                            attrKey,
                            value,
                          );

                          return (
                            <button
                              key={value}
                              onClick={() => {
                                if (!available) return;

                                handleSelectAttribute(attrKey, value);
                              }}
                              disabled={!available}
                              className={`relative px-3 py-1.5 rounded-md border text-xs font-medium transition-all whitespace-nowrap ${
                                active
                                  ? "border-orange-500 bg-orange-50 text-orange-600"
                                  : available
                                    ? "border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-600 cursor-pointer"
                                    : "border-zinc-200 text-zinc-300 bg-zinc-50 cursor-not-allowed"
                              }`}
                            >
                              {value}

                              {!available && (
                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="w-full h-px bg-zinc-300 rotate-[-20deg]" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex md:w-120 sm:w-100 flex-col gap-4 pt-1 px-1">
              {cartMessage && (
                <p className="text-sm text-emerald-600 font-medium">
                  {cartMessage}
                </p>
              )}

              <button
                onClick={() => {
                  if (cartButtonLabel === "Go to Cart") {
                    navigate("/cart");
                    return;
                  }

                  handleAddToCart();
                }}
                disabled={
                  isAddToCartDisabled && cartButtonLabel !== "Go to Cart"
                }
                id="btn-add-to-cart"
                className={`flex items-center justify-center gap-1.5 border border-orange-500 text-orange-500 text-sm font-medium px-4 py-2.5 rounded-lg transition-all ${
                  isAddToCartDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-orange-50 active:scale-[0.98] cursor-pointer"
                }`}
              >
                <ShoppingCart size={16} />
                {cartButtonLabel}
              </button>

              <button
                id="btn-buy-now"
                className="flex items-center justify-center gap-1.5 bg-orange-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm shadow-orange-200/60 hover:bg-orange-600 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Zap size={16} />
                Buy Now
              </button>
            </div>

            <div className="grid md:w-120 sm:w-100 grid-cols-2 gap-x-4 gap-y-1.5 px-2">
              {[
                { icon: Truck, label: "Free delivery" },
                { icon: Shield, label: "1-year warranty" },
                { icon: RotateCcw, label: "Easy returns" },
                { icon: Lock, label: "Secure payments" },
              ].map(({ icon: Icon, label }, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 text-sm text-zinc-500 ${
                    index % 2 === 1 ? "md:pl-24 sm:pl-12" : ""
                  }`}
                >
                  <Icon size={13} className="text-orange-500 shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            <div className="md:w-120 sm:w-100 rounded-t-2xl border-t border-l border-r border-zinc-200 bg-zinc-50/80 p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <Truck size={15} className="mt-0.5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    Shipping complimentary over INR 3000
                  </p>
                  <p className="text-sm text-zinc-500">
                    Free delivery on orders above ₹3,000.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw
                  size={15}
                  className="mt-0.5 text-orange-500 shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    Return within 7 days
                  </p>
                  <p className="text-sm text-zinc-500">
                    Easy returns and exchanges within 7 days of delivery.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Shield size={15} className="mt-0.5 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    Authenticity 100% guaranteed
                  </p>
                  <p className="text-sm text-zinc-500">
                    Every item is verified and backed by our quality promise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
