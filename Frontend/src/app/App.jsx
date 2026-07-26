import { RouterProvider } from "react-router";
import "./App.css";
import router from "./app.routes.jsx";
import useAuth from "../features/auth/hook/useAuth.js";
import { useEffect } from "react";

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
