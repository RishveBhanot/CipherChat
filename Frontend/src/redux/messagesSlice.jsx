import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk("get-users", async() => {
    try {
        const response = await axiosInstance.get("/messages/users")
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});

export const getMessages = createAsyncThunk("get-messages", async(userId) => {
    try {
        const response = await axiosInstance.get(`/messages/${userId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
})

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        messages: [],
        users: [],
        selectedUser: null,
        isUsersLoading: false,
        isMessagesLoading: false
    },
    reducers: {

    },
    extraReducers:(builder) => {
        builder
        .addCase(getUsers.fulfilled, (state,action) => {
            state.isUsersLoading= true
            state.users = action.payload;
        })
        .addCase(getMessages.fulfilled, (state, action) => {
            state.isMessagesLoading = true;
            state.messages = action.payload;
        })
    }
})

export default messagesSlice.reducer