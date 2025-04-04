import React, { useEffect, useState } from "react";
import { signUp } from "../redux/authSlice";
import { MessageSquare } from "lucide-react";
import { TextField, Button, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";


const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  // console.log("Current Redux state user:", authUser)
  const dispatch = useDispatch();
  const isSigningUp = useSelector((state) => state.auth.isSigningUp);

  // Ensure that navigate is part of the dependency list
  

  const handleTogglePassword =() => {
    setShowPassword((icon) => !icon);
  }

  const validateForm = () => {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!formData.fullName.trim()) return toast.error("Full name is required");
    if(!formData.email.trim()) return toast.error("Email is required");
    if(!emailRegex.test(formData.email)) return toast.error("Invalid Email format");
    if(!formData.password) return toast.error("Password is Required");
    if(formData.password.length < 6 ) return toast.error("Password must be at least more than 6 characters");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const success = validateForm();
    if (!success) return;
  
    // Dispatch the signUp action and await its resolution
    const result = await dispatch(signUp(formData));  // Wait for signup completion
    
    // Navigate after successful signup and payload is returned
    if (result.payload) {
      navigate("/");  // Navigate immediately after signup
    }
  };
  
  useEffect(() => {
    // console.log(authUser, "authenticated user");
    if (authUser) {
      navigate('/');  // Navigate to homepage after signup if authUser is present
    }
  }, [authUser, navigate]);


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              type="text"
              placeholder="Full Name"
              variant="outlined"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
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
            <TextField
              placeholder="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })}
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
                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                      </IconButton>
                    </InputAdornment>
                  )
                },
              }}
            />
            <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex item-center"
            onClick={() => setShowPassword(!showPassword)}
            ></button>

            {/* Submit Button */}
            <Button type="submit" disabled={isSigningUp} variant="contained" color="primary" fullWidth>
            {isSigningUp ? (
                <>
                  <CircularProgress size={24} />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

          </form>
          <div className="text-center">
            <p>Already have an account?
              <Link to='/login' className="text-blue-800 ml-2">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <AuthImagePattern
      title="Join our Community"
      subtitle="COnnect with friends, share moments, and stay in touch with you"
      />
    </div>
  );
};

export default SignUpPage;
