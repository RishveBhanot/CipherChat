import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { connectSocket, disconnectSocket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { initializeSocketEvents } from "../lib/socketListeners"; // import the new handler

// Thunks
export const checkAuth = createAsyncThunk("authCheck", async (_, { dispatch }) => {
  try {
    const response = await axiosInstance.get("/auth/check");
    if (response.data?._id) {
      initializeSocketEvents(response.data._id, dispatch);
    }
    return response.data;
  } catch (error) {
    console.log("Error checking Auth", error);
  }
});

export const signUp = createAsyncThunk("signup", async (data, { dispatch }) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    toast.success("Account created Successfully");
    if (response.data?._id) {
      initializeSocketEvents(response.data._id, dispatch);
    }
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const login = createAsyncThunk("login", async (data, { dispatch }) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    toast.success("Login Successfully");
    if (response.data?._id) {
      initializeSocketEvents(response.data._id, dispatch);
    }
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const logOut = createAsyncThunk("logout", async () => {
  try {
    await axiosInstance.post("/auth/logout");
    toast.success("Logout Successfully");
    disconnectSocket();
    return null;
  } catch (error) {
    toast.error("Logout Failed");
    console.log("Error during logout", error);
    return null;
  }
});

export const updateProfile = createAsyncThunk("updating-profile", async (data) => {
  try {
    const response = await axiosInstance.put("/auth/update-profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Profile updated successfully");
    return response.data;
  } catch (error) {
    console.log("error in update profile", error);
    toast.error(error.response.data.message);
  }
});

// Slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(signUp.pending, (state) => {
        state.isSigningUp = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.user = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.onlineUsers = [];
      })
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
      });
  },
});

export const { setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
