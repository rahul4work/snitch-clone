import { useDispatch } from "react-redux";
import { getMe, login, logout, register } from "../service/auth.api.js";
import {
  setError,
  setErrorCode,
  setLoading,
  setAuthRequestLoading,
  setUser,
} from "../state/auth.slice.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) => {
    try {
      dispatch(setAuthRequestLoading(true));
      dispatch(setError(null));
      dispatch(setErrorCode(null));

      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });

      dispatch(setUser(data.user));

      return data.user;
    } catch (error) {
      const code = error.response?.data?.code || "UNKNOWN_ERROR";
      const message = error.response?.data?.message || "Something went wrong";

      dispatch(setErrorCode(code));
      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setAuthRequestLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setAuthRequestLoading(true));
      dispatch(setError(null));
      dispatch(setErrorCode(null));

      const data = await login({ email, password });

      dispatch(setUser(data.user));

      return data.user;
    } catch (error) {
      const code = error.response?.data?.code || "UNKNOWN_ERROR";
      const message = error.response?.data?.message || "Something went wrong";

      dispatch(setErrorCode(code));
      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setAuthRequestLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setErrorCode(null));

      await logout();

      dispatch(setUser(null));
    } catch (error) {
      const code = error.response?.data?.code || "UNKNOWN_ERROR";
      const message = error.response?.data?.message || "Something went wrong";

      dispatch(setErrorCode(code));
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setErrorCode(null));

    try {
      const data = await getMe();

      dispatch(setUser(data.user));
    } catch (error) {
      const code = error.response?.data?.code;
      const message = error.response?.data?.message || "Something went wrong";

      if (code === "UNAUTHORIZED" || code === "TOKEN_EXPIRED") {
        dispatch(setUser(null));
        dispatch(setError(null));
        dispatch(setErrorCode(null));
        return;
      }

      dispatch(setErrorCode(code || "UNKNOWN_ERROR"));
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };
  return { handleRegister, handleLogin, handleLogout, handleGetMe };
};

export default useAuth;
