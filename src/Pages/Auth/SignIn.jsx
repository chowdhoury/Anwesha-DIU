import React, { use, useContext, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLogoGoogle,
} from "react-icons/io5";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import Logo from "../../Components/Logo/Logo";
import "./Auth.css";
import { AuthContext } from "../../Authentication/AuthContext";
import toast from "react-hot-toast";

const SignIn = () => {
  const { signInWithGoogle, user, signIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signIn(data.email, data.password);
      // Optionally redirect or show success
      toast.success("Sign-in successful!");
    } catch (error) {
      // Optionally handle error, e.g. show error message
        toast.error("Sign-in failed. Please check your credentials and try again.");
      console.error("Firebase signIn error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Optionally redirect or show success
      toast.success("Google sign-in successful!");
      console.log("Google signIn successful, user:", user);
    } catch (error) {
      // Optionally handle error, e.g. show error message
        toast.error("Google sign-in failed. Please try again.");
      console.error("Firebase Google signIn error:", error);
    }
  };

  return (
    <div className="auth-page">
      {/* Left - Decorative Panel */}
      <div className="auth-side-panel">
        <div className="auth-side-content">
          <Link to="/" className="auth-logo">
            <Logo variant="light" size="lg" />
          </Link>
          <h2>Welcome back!</h2>
          <p>
            Sign in to continue helping others, earning rewards, and being part
            of our amazing community.
          </p>
          <div className="auth-side-stats">
            <div className="auth-side-stat">
              <span className="auth-side-stat-val">50K+</span>
              <span className="auth-side-stat-label">Tasks Completed</span>
            </div>
            <div className="auth-side-stat">
              <span className="auth-side-stat-val">10K+</span>
              <span className="auth-side-stat-label">Active Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* Social Login */}
          <div className="social-auth">
            <button
              className="social-auth-btn"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <IoLogoGoogle />
              <span>Google</span>
            </button>
            <button className="social-auth-btn" type="button">
              <FaGithub />
              <span>GitHub</span>
            </button>
            <button className="social-auth-btn" type="button">
              <FaLinkedinIn />
              <span>LinkedIn</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <IoMailOutline className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <span className="auth-error">{errors.email.message}</span>
              )}
            </div>

            <div className="input-group">
              <div className="input-label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
              {errors.password && (
                <span className="auth-error">{errors.password.message}</span>
              )}
            </div>

            <div className="input-group-checkbox">
              <input type="checkbox" id="remember" {...register("remember")} />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign In
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default SignIn;
