import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import TitleLogo from "../components/TitleLogo.jsx";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";
import ImageSection from "../components/ImageSection.jsx";
import useAuth from "../hook/useAuth.js";
import { useDispatch, useSelector } from "react-redux";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { setError } from "../state/auth.slice.js";

const Register = () => {
  const { handleRegister } = useAuth();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Enter a valid 10 digit number";
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

    await handleRegister(formData);

    navigate("/");
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="w-full h-screen flex overflow-x-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto bg-linear-to-br from-white to-orange-50">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <TitleLogo />

          <div className="ml-1">
            {/* Heading */}
            <div className="mb-5 mt-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Create Account
              </h2>

              <p className="text-gray-500 font-normal mt-2 text-sm sm:text-base">
                Join Snitch and start shopping today.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 transition
                    ${
                      errors.fullname
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }
                  `}
                />

                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
                )}
              </div>

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

              {/* Contact */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Contact Number
                </label>

                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter your number"
                  className={`w-full h-12 px-4 rounded-xl border bg-white focus:outline-none focus:ring-2 transition
                    ${
                      errors.contact
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                    }
                  `}
                />

                {errors.contact && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Create Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full h-12 px-4 pr-12 rounded-xl border bg-white focus:outline-none focus:ring-2 transition
                      ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                      }
                    `}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Seller Checkbox */}
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleChange}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
                Register as Seller
              </label>

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
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-sm text-gray-400">OR</span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google */}
            <ContinueWithGoogle onClick={handleGoogleLogin} />

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?
              <Link
                to="/login"
                className="text-orange-500 font-medium ml-1 hover:text-orange-600"
              >
                Login
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

export default Register;
