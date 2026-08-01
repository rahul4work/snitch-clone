import googleLogo from "../../../assets/google.svg";

const ContinueWithGoogle = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-12 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center gap-3 transition cursor-pointer"
    >
      <img src={googleLogo} alt="Google" className="w-5 h-5" />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

export default ContinueWithGoogle;
