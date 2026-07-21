import { useNavigate } from "react-router";
import Logo from "../../../assets/Logo.png"

const TitleLogo = () => {
  const navigate = useNavigate();

  return (
    <div className="py-2 w-42.5 sm:w-50 select-none">
      <img
        src={Logo}
        alt="Snitch logo"
        onClick={() => navigate("/")}
        className="w-full h-auto object-contain cursor-pointer"
      />

      <div className="border-t border-gray-300 mt-1 mx-auto w-[90%]"></div>

      <p
        className="
          text-center
          text-[10px] sm:text-sm
          font-medium
          tracking-[0.25em]
          text-gray-700
          uppercase
          mt-2
        "
      >
        Elevate your style
      </p>
    </div>
  );
};

export default TitleLogo;
