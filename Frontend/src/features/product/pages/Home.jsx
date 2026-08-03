import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Eye, Heart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import Navbar from "../../shared/components/Navbar.jsx";

import banner1 from "../../../assets/banner1.webp";
import banner2 from "../../../assets/banner2.webp";
import banner3 from "../../../assets/banner3.webp";
import banner4 from "../../../assets/banner4.webp";
import banner5 from "../../../assets/banner5.webp";
import banner6 from "../../../assets/banner6.webp";

import shirts from "../../../assets/shirts.jpeg";
import jeans from "../../../assets/jeans.jpeg";
import trousers from "../../../assets/trousers.jpeg";
import tshirts from "../../../assets/t-shirts.jpeg";
import cargos from "../../../assets/cargos.jpeg";
import polos from "../../../assets/polos.jpeg";
import shorts from "../../../assets/shorts.jpeg";
import shoes from "../../../assets/shoes.jpeg";
import useProduct from "../hook/useProduct.js";

const banners = [banner1, banner2, banner3, banner4, banner5, banner6];

const wardrobe = [
  { image: shirts, title: "SHIRTS" },
  { image: jeans, title: "JEANS" },
  { image: trousers, title: "TROUSERS" },
  { image: tshirts, title: "TSHIRTS" },
  { image: cargos, title: "CARGOS" },
  { image: polos, title: "POLOS" },
  { image: shorts, title: "SHORTS" },
  { image: shoes, title: "SHOES" },
];

const categories = [
  "ALL",
  "SHIRTS",
  "JEANS",
  "TROUSERS",
  "T-SHIRTS",
  "JACKETS",
  "SHOES",
  "PERFUMES",
];

const Home = () => {
  const { handleGetAllProducts } = useProduct();

  const products = useSelector((state) => state.product.products);

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await handleGetAllProducts();
      } catch (error) {
        console.error("Failed to fetch products: ", error);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistClick = () => {
    if (user) {
      navigate("/wishlist");
    } else {
      navigate("/login");
    }
  };

  return (
    <div id="main-div" className="w-full min-h-screen bg-white">
      {/* Main Content */}
      <main className="w-full h-full">
        <div className="max-w-350 mx-auto h-full relative">
          {/* Hero Section Banner */}
          <section className="w-full h-[calc(98vh-80px)] px-4 pt-8 pb-6">
            <Swiper
              modules={[Autoplay]}
              centeredSlides={false}
              slidesPerView={"auto"}
              spaceBetween={10}
              loop={true}
              speed={4000}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              className="h-full"
            >
              {banners.map((banner, index) => (
                <SwiperSlide key={index} className="w-130! h-full">
                  <div className="relative h-full w-full overflow-hidden cursor-pointer">
                    <img
                      src={banner}
                      alt=""
                      className="w-full h-full object-cover scale-[1.02]"
                    />

                    {/* Top Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-black/20 to-transparent" />

                    {/* Bottom Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          {/* ── Style Your Wardrobe ── */}
          <section className="w-full px-4 pb-4">
            <div className="text-center mb-4">
              <span className="overline font-semibold text-zinc-700">
                Style your
              </span>
              <span className="font-bold text-2xl text-[#1A312C] ml-2">
                WARDROBE
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {wardrobe.map((item, index) => (
                <div
                  key={index}
                  className="relative h-100 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-zinc-300 transition-all duration-300 cursor-pointer group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Text */}
                  <div className="absolute top-5 left-0 right-0 text-center">
                    <h3 className="text-zinc-700 text-xl font-bold tracking-widest drop-shadow-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── New Fresh Arrivals ── */}
          <section className="w-full px-4 py-6">
            <div className="text-center mb-8">
              <span className="overline font-semibold text-zinc-700">
                Discover
              </span>
              <span className="font-bold text-2xl text-[#1A312C] ml-2">
                NEW FRESH ARRIVALS
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 text-sm font-medium border transition-all duration-300 cursor-pointer
                    ${
                      activeCategory === category
                        ? "bg-[#FF653F] text-white border-[#FF653F]"
                        : "border-zinc-300 text-zinc-700 hover:border-[#FF653F] hover:text-[#FF653F]"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products?.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white border border-zinc-300 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-110 overflow-hidden bg-zinc-100 shrink-0">
                    {item.tag && (
                      <span className="absolute top-4 left-4 z-10 bg-[#FF653F] text-white text-xs px-3 py-1 rounded-full">
                        {item.tag}
                      </span>
                    )}

                    <button
                      onClick={handleWishlistClick}
                      className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow cursor-pointer"
                    >
                      <Heart size={16} />
                    </button>

                    <img
                      src={item.images?.[0]?.url}
                      alt={item.title}
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-linear-to-t from-black/50 via-black/30 to-transparent/5 flex justify-center gap-3 py-4">
                        <button
                          onClick={() => navigate(`/product/${item._id}`)}
                          className="bg-white p-2.5 rounded-full hover:bg-zinc-200 cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>

                        <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-orange-600 cursor-pointer">
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1 gap-4">
                    <div className="flex flex-col flex-1 gap-2 px-2">
                      {/* Title */}
                      <h3
                        title={item.title}
                        className="font-bold text-md text-zinc-800 leading-snug line-clamp-2"
                      >
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 min-h-10">
                        {item.description}
                      </p>

                      {/* Price */}
                      <span className="font-bold text-md text-black">
                        ₹{item.price.amount}
                      </span>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="mt-auto w-full py-2.5 border border-zinc-300 rounded-lg font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
