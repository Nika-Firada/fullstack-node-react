import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);
export const fetchUserRegister = createAsyncThunk(
  "auth/fetchUserRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);
export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async () => {
    const { data } = await axios.get("/auth/me");
    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchUserData.pending]: (state, action) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchUserData.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchUserData.rejected]: (state, action) => {
      state.status = "error";
      state.data = null;
    },
    [fetchAuthUser.pending]: (state, action) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuthUser.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuthUser.rejected]: (state, action) => {
      state.status = "error";
      state.data = null;
    },
    [fetchUserRegister.pending]: (state, action) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchUserRegister.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchUserRegister.rejected]: (state, action) => {
      state.status = "error";
      state.data = null;
    },
  },
});
export const userIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logOut } = authSlice.actions;
