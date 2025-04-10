import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk("get-users", async () => {
  try {
    const response = await axiosInstance.get("/messages/users");
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const getMessages = createAsyncThunk("get-messages", async (userId) => {
  try {
    const response = await axiosInstance.get(`/messages/${userId}`);
    console.log("my get message response", response.data);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
});

export const sendMessage = createAsyncThunk("send-message", async (messageData, { getState }) => {
  try {
    const { messages, selectedUser } = getState().messages;
    console.log("messages sent to server", messages);

    const formData = new FormData();
    formData.append("text", messageData.text);
    if (messageData.imageFile) {
      formData.append("image", messageData.imageFile); 
    }

    const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send message");
  
  }
});

// Todo : optimize this later.


export const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: true,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addMessageExternally: (state, action) => {
      state.messages.push(action.payload);
    },   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(getMessages.pending, (state, action) => {
        state.isMessagesLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload); 
      });
      
  },
});
export const {setSelectedUser, addMessageExternally} = messagesSlice.actions
export default messagesSlice.reducer;
