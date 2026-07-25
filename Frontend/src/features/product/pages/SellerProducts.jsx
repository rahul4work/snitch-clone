import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Edit,
  Eye,
  LayoutGrid,
  List,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useProduct } from "../hook/useProduct.js";
import SideNavBar from "../components/SideNavBar.jsx";

const currencySymbols = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

const SellerProducts = () => {
  const { handleGetSellerProducts, handleDeleteProduct } = useProduct();

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [view, setView] = useState(() => {
    return sessionStorage.getItem("productView") || "grid";
  });

  const fetchProducts = async () => {
    try {
      const data = await handleGetSellerProducts();
      setProducts(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("productView", view);
  }, [view]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("productView");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(search.toLowerCase());
  });

  const deleteProduct = async (productId) => {
    try {
      await handleDeleteProduct(productId);

      setProducts((prev) =>
        prev.filter((product) => product._id !== productId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNavBar />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">
              Products
            </h1>
            <div className="mx-3 text-gray-600"> | </div>
            <p className="text-sm text-gray-500 font-medium">
              Manage your products
            </p>
          </div>

          <Link
            to="/seller/create-product"
            className="inline-flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold px-4 py-2 rounded-lg transition text-sm shadow-sm"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-4 bg-[#f8f9fa]">
          <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all bg-gray-50/50 focus:bg-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setView("list")}
                  className={`h-10 px-3 rounded-lg border flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors
                  ${view === "list" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <List size={16} />
                  List
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`h-10 px-3 rounded-lg border flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors
                  ${view === "grid" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  <LayoutGrid size={16} />
                  Grid
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center mt-8">
                <Package size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800">
                  No Products Found
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Start by creating your first product or try a different
                  search.
                </p>
              </div>
            ) : (
              <>
                {/* LIST VIEW */}
                {view === "list" && (
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3 font-medium">Product</th>
                          <th className="px-5 py-3 font-medium text-center">
                            Status
                          </th>
                          <th className="px-5 py-3 font-medium">Created</th>
                          <th className="px-5 py-3 font-medium">Price</th>
                          <th className="px-5 py-3 font-medium text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr
                            key={product._id}
                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                  <img
                                    src={
                                      product.images?.[0]?.url ||
                                      "https://placehold.co/100x100"
                                    }
                                    alt={product.title}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                                    {product.title}
                                  </h3>
                                  <p className="text-xs text-gray-500 line-clamp-1 max-w-62.5 mt-0.5">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold uppercase tracking-wider">
                                Active
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-500">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3">
                              <span className="font-bold text-gray-900">
                                {currencySymbols[product.price?.currency]}{" "}
                                {product.price?.amount}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center justify-center gap-2 transition-opacity">
                                <button
                                  onClick={() =>
                                    navigate(`/seller/product/${product._id}`)
                                  }
                                  className="p-1.5 border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shadow-sm"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    navigate(`/seller/product/${product._id}`)
                                  }
                                  className="p-1.5 border border-gray-200 rounded-md bg-white hover:bg-ornage-50 hover:border-orange-200 hover:text-orange-600 text-gray-600 transition-colors cursor-pointer shadow-sm"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(product._id)}
                                  className="p-1.5 border border-gray-200 rounded-md bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-600 transition-colors cursor-pointer shadow-sm"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* GRID VIEW */}
                {view === "grid" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="group bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col rounded-md"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-4/5 overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            onClick={() =>
                              navigate(`/seller/product/${product._id}`)
                            }
                            src={
                              product.images?.[0]?.url ||
                              "https://placehold.co/400x500"
                            }
                            alt={product.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Hover Actions */}
                          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                            <div className="bg-linear-to-t from-black/50 via-black/30 to-transparent/5 flex justify-center gap-2 py-3">
                              <button
                                onClick={() =>
                                  navigate(`/seller/product/${product._id}`)
                                }
                                className="bg-white p-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(`/seller/product/${product._id}`)
                                }
                                className="bg-orange-500 text-white px-2 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => deleteProduct(product._id)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 flex flex-col flex-1">
                          <h3
                            className="font-semibold text-sm text-gray-900 line-clamp-1"
                            title={product.title}
                          >
                            {product.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2 min-h-8 leading-relaxed">
                            {product.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-50">
                            <span className="font-bold text-gray-900 text-sm">
                              {currencySymbols[product.price?.currency]}{" "}
                              {product.price?.amount}
                            </span>
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerProducts;
