import React, { useState } from "react";
import SideNavBar from "../components/SideNavBar.jsx";
import ProductForm from "../components/ProductForm.jsx";
import ProductPreviewCard from "../components/ProductPreviewCard.jsx";

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
    currency: "INR",
  });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavBar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shrink-0 shadow-xs">
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">
            Create Product
          </h1>
          <div className="mx-3 text-gray-600"> | </div>
          <p className="text-sm text-gray-500 font-medium">
            Add a new product to your SNITCH store
          </p>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-4 bg-[#f8f9fa]">
          <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 h-full">
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
              {/* Form */}
              <div className="w-full lg:flex-1 order-2 lg:order-1">
                <ProductForm
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>

              {/* Preview */}
              <div className="w-full lg:w-85 shrink-0 order-1 lg:order-2">
                <ProductPreviewCard productData={productData} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateProduct;
