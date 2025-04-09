import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { connectSocket, getSocket, disconnectSocket } from "../lib/socket";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const checkAuth = createAsyncThunk("authCheck", async () => {
  try {
    const response = await axiosInstance.get("/auth/check");
    // console.log("Auth check response", response.data);
    return response.data;
  } catch (error) {
    console.log("Error checking Auth", error);
  }
});

export const signUp = createAsyncThunk("signup", async (data) => {
  try {
    const response = await axiosInstance.post("/auth/signup", data);
    // console.log(data, "signup data")
    // console.log(response.data, "data to be send to server")
    toast.success("Account created Successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const login = createAsyncThunk("login", async (data) => {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    // console.log(data, "login data")
    toast.success("Login Successfully");
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const logOut = createAsyncThunk("logout", async () => {
  try {
    await axiosInstance.post("/auth/logout");
    toast.success("Logout Successfully");
    return null;
  } catch (error) {
    toast.error("Get Failed");
    console.log("Error during logout", error);
    return null;
  }
});

export const updateProfile = createAsyncThunk(
  "updating-profile",
  async (data) => {
    try {
      const response = await axiosInstance.put("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("my Response", response);
      toast.success("Profile updated successfully");
      console.log("myResponse", response.data);
      return response.data;
    } catch (error) {
      console.log("error in update profile", error);
      toast.error(error.response.data.message);
    }
  }
);

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
      .addCase(checkAuth.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        console.log("checking the user auth", state.user);

        //Connect Socket
        if(action.payload?._id) {
          const socket = connectSocket(action.payload._id)
          socket?.on("getOnlineUsers",(userIds) => {
            state.onlineUsers = userIds;
          })
        }
      })
      .addCase(signUp.pending, (state, action) => {
        state.isSigningUp = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.user = action.payload;
        console.log("Signup successful, user data:", state.user);

        if(action.payload?._id) {
          const socket = connectSocket(action.payload._id)
          socket?.on("getOnlineUsers",(userIds) => {
            state.onlineUsers = userIds;
          })
        }
      })
      .addCase(login.pending, (state, action) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.user = action.payload;

        if(action.payload?._id) {
          const socket = connectSocket(action.payload._id)
          socket?.on("getOnlineUsers",(userIds) => {
            state.onlineUsers = userIds;
          })
        }
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.user = null;
        state.onlineUsers = [];
        disconnectSocket();
      })
      .addCase(updateProfile.pending, (state, action) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = action.payload;
      });
  },
});

export const { auth, setOnlineUsers } = authSlice.actions;
export default authSlice.reducer;
