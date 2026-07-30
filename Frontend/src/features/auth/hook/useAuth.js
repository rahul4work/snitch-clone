import { useDispatch } from "react-redux";
import { getMe, login, logout, register } from "../service/auth.api.js";
import { setError, setLoading, setUser } from "../state/auth.slice.js";

const useAuth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({ email, contact, password, fullname, isSeller = false }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await register({ email, contact, password, fullname, isSeller });
      dispatch(setUser(data.user));

      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({ email, password });
      dispatch(setUser(data.user));

      return data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      dispatch(setError(message));

      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await logout();
      
      dispatch(setUser(null));
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrorng";
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrorng";
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleRegister, handleLogin, handleLogout, handleGetMe };
};

export default useAuth;
