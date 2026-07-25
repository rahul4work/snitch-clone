import React from "react";

const ProductPreviewCard = ({ productData }) => {
  const previewImage =
    productData.images.length > 0
      ? URL.createObjectURL(productData.images[0])
      : null;

  const getCurrencySymbol = () => {
    switch (productData.currency) {
      case "USD":
        return "$";

      case "EUR":
        return "€";

      case "GBP":
        return "£";

      case "JYP":
        return "¥";

      default:
        return "₹";
    }
  };

  return (
    <div className="sticky top-8 w-full">
      <div className="aspect-4/5 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center relative">
        {previewImage ? (
          <img
            src={previewImage}
            alt="preview"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-sm font-medium">Image Preview</span>
          </div>
        )}
      </div>

      <div className="mt-5 px-1">
        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-1 text-lg">
          {productData.title || "Product Title"}
        </h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed min-h-10">
          {productData.description ||
            "Product description preview will appear here."}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-gray-900">
            {getCurrencySymbol()}
            {productData.price || "0"}
          </span>
          <span className="text-xs font-bold tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-md uppercase">
            Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewCard;
