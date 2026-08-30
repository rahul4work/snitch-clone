import { Link, useNavigate } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

import pageNotFoundImg from "../../../assets/pagenotfound-image.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-2xl text-center">

        {/* 404 Image */}
        <div className="flex justify-center mb-6">
          <img
            src={pageNotFoundImg}
            alt="Page not found"
            className="
              w-full
              max-w-105
              sm:max-w-125
              h-auto
              max-h-75
              object-contain
              select-none
            "
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
            Oops! Can't Find That.
          </h2>

          <p className="max-w-md mx-auto text-sm sm:text-base leading-relaxed text-zinc-500">
            Looks like the page you're looking for doesn't exist or may have
            been moved somewhere else.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="
              group
              w-full sm:w-auto
              min-w-35
              inline-flex items-center justify-center gap-2
              px-5 py-2.5
              rounded-xl
              border border-zinc-200
              bg-white
              text-sm font-medium text-zinc-700
              shadow-sm
              hover:border-zinc-300
              hover:bg-zinc-50
              hover:shadow-md
              active:scale-[0.97]
              transition-all duration-200
              cursor-pointer
            "
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            Go Back
          </button>

          {/* Back to Home */}
          <Link
            to="/"
            className="
              group
              w-full sm:w-auto
              min-w-35
              inline-flex items-center justify-center gap-2
              px-5 py-2.5
              rounded-xl
              bg-orange-500
              text-white
              text-sm font-medium
              shadow-md shadow-orange-200/60
              hover:bg-orange-600
              hover:shadow-lg hover:shadow-orange-200/70
              active:scale-[0.97]
              transition-all duration-200
            "
          >
            <Home
              size={16}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
};

export default NotFound;