import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    authRequestLoading: false,
    error: null,
    errorCode: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthRequestLoading: (state, action) => {
      state.authRequestLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setErrorCode: (state, action) => {
      state.errorCode = action.payload;
    },
  },
});

export const { setUser, setLoading, setAuthRequestLoading, setError, setErrorCode } =
  authSlice.actions;

export default authSlice.reducer;
