import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/authSlice.js";
import { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";

import { store } from "./redux/store"; // ✅ added
import { initializeSocketEvents } from "./lib/socketListeners"; // ✅ added

const App = () => {
  const dispatch = useDispatch();
  const { isLoading, user, onlineUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme !== "valentine") {
      document.documentElement.setAttribute("data-theme", "valentine");
    }
  }, []);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ✅ Socket init: only when user is set after checkAuth
  useEffect(() => {
    if (user?._id) {
      initializeSocketEvents(user._id, store.dispatch, store);
    }
  }, [user]);

  return (
    <div data-theme="retro">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={user ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/profile"
              element={user ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
          <Toaster />
        </div>
      )}
    </div>
  );
};

export default App;
