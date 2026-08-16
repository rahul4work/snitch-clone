import { useState } from "react";
import googleLogo from "../../../assets/google.svg";

const ContinueWithGoogle = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setTimeout(() => {
      setIsLoading(true);
      onClick();
    }, 120);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="
        w-full
        h-12
        border
        border-gray-300
        rounded-xl
        bg-white
        hover:bg-gray-50
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-70
        flex
        items-center
        justify-center
        gap-3
        transition-all
        duration-150
        cursor-pointer
      "
    >
      {isLoading ? (
        <>
          <div
            className="
              h-5
              w-5
              rounded-full
              border-2
              border-gray-500
              border-t-transparent
              animate-spin
            "
          />
          <span className="font-medium text-gray-700">Continuing...</span>
        </>
      ) : (
        <>
          <img src={googleLogo} alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </>
      )}
    </button>
  );
};

export default ContinueWithGoogle;
