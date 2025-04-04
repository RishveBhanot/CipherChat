import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
// import { ColorRing } from 'react-loader-spinner'

const App = () => {
  const dispatch = useDispatch();

  const { isLoading, user } = useSelector((state) => state.auth);
  console.log("current redux state user", user);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme !== "valentine") {
      document.documentElement.setAttribute("data-theme", "valentine");
    }
  }, []);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // if(isLoading && !authUser) {
  //   return (<ColorRing
  //     visible={true}
  //     height="80"
  //     width="80"
  //     ariaLabel="color-ring-loading"
  //     wrapperStyle={{}}
  //     wrapperClass="color-ring-wrapper"
  //     colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
  //     />)
  // }

  return (
    <div>
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
