import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { CircleAlert } from "lucide-react";
import TitleLogo from "../components/TitleLogo.jsx";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import ImageSection from "../components/ImageSection.jsx";
import { setError } from "../state/auth.slice.js";
import useAuth from "../hook/useAuth.js";

const Login = () => {
  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(setError(null));
    }, 4000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const user = await handleLogin(formData);

      if (user.role === "buyer") {
        navigate("/");
      } else if (user.role === "seller") {
        navigate("/seller/dashboard");
      }
    } catch (error) {}
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="w-full min-h-screen lg:h-screen flex overflow-x-hidden">
      {/* Left Section */}
      <div
        className="
          w-full lg:w-1/2
          flex items-start lg:items-center
          justify-center
          px-5 sm:px-8 lg:px-16
          py-8 sm:py-12 md:py-14 lg:py-10
          bg-linear-to-br from-white to-orange-50
        "
      >
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <TitleLogo />

          <div className="ml-1">
            {/* Heading */}
            <div className="mb-6 sm:mb-8 mt-6 sm:mt-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Welcome Back
              </h2>

              <p className="text-gray-500 font-normal mt-2 text-sm sm:text-base">
                Sign in to continue your shopping journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 transition
                    ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }
                  `}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 transition
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }
                  `}
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-orange-500 hover:text-orange-600 transition cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  h-12
                  rounded-xl
                  bg-orange-500
                  hover:bg-orange-600
                  cursor-pointer
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  text-white
                  font-semibold
                  transition-all
                  duration-200
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                {loading ? (
                  <>
                    <div
                      className="
                        h-5
                        w-5
                        rounded-full
                        border-2
                        border-white
                        border-t-transparent
                        animate-spin
                      "
                    />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {error && (
              <div
                className="
                  flex items-start gap-2
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3 mt-4
                "
              >
                <CircleAlert
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />

                <p className="text-sm text-red-600 leading-5">{error}</p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4 my-6 sm:my-7">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-sm text-gray-400">OR</span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <ContinueWithGoogle onClick={handleGoogleLogin} />

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-6 sm:mt-8">
              Don't have an account?
              <Link
                to="/register"
                className="text-orange-500 font-medium ml-1 hover:text-orange-600"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <ImageSection />
    </div>
  );
};

export default Login;
