import React, { useState } from "react";
import { TextField, Button, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { MessageSquare } from "lucide-react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { login } from "../redux/authSlice";

const LoginPage = () => {

  const { isLoggingIn} = useSelector(state => state.auth.isLoggingIn);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  }

  const handleTogglePassword =() => {
    setShowPassword((icon) => !icon);
  }
  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <MessageSquare className="size-6 text primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-bas-content"></p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="form-control">
              <TextField
                placeholder="Email"
                variant="outlined"
                fullWidth
                type="email"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <TextField
                placeholder="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
            <Button type="submit" onClick={handleLogin} disabled={isLoggingIn} variant="contained" color="primary" fullWidth>
            {isLoggingIn ? (
                <>
                  <CircularProgress size={24} />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">Doesn't have an Account
            <Link to="/signup" className="link link-primary">
            Create account
            </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthImagePattern
      title={"Welcome Back!"}
      subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;
