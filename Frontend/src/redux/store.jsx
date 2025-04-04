import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx"
import messageReducer from "./messagesSlice.jsx"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messageReducer,

    }
});