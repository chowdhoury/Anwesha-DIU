import React, { useState, useContext } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Authentication/AuthContext";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLogoGoogle,
} from "react-icons/io5";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import Logo from "../../Components/Logo/Logo";
import "./Auth.css";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signInWithGoogle, user,updateUserProfile, createUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { firstName, lastName, email, password } = data;
    const fullName = `${firstName} ${lastName}`;
    try {
      await createUser(email, password);
      await updateUserProfile(fullName);
      toast.success("Signup Successful");
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
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
          <h2>Join our community!</h2>
          <p>
            Create your free account and start earning digital rewards by
            helping others. No payments, just skills and collaboration.
          </p>
          <div className="auth-side-features">
            <div className="auth-side-feature">
              <span className="feature-dot"></span>
              <span>Earn rewards by helping others</span>
            </div>
            <div className="auth-side-feature">
              <span className="feature-dot"></span>
              <span>Use rewards to get help in return</span>
            </div>
            <div className="auth-side-feature">
              <span className="feature-dot"></span>
              <span>100% free — no money involved</span>
            </div>
            <div className="auth-side-feature">
              <span className="feature-dot"></span>
              <span>Build your reputation &amp; skills</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Start your journey with Anwesha today</p>
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
            <span>or sign up with email</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <IoPersonOutline className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    placeholder="John"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                </div>
                {errors.firstName && (
                  <span className="auth-error">{errors.firstName.message}</span>
                )}
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <IoPersonOutline className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Doe"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                </div>
                {errors.lastName && (
                  <span className="auth-error">{errors.lastName.message}</span>
                )}
              </div>
            </div>

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
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
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

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="auth-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="input-group-checkbox">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You must agree to the terms",
                })}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link to="/" className="inline-link">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/" className="inline-link">
                  Privacy Policy
                </Link>
              </label>
              {errors.terms && (
                <span className="auth-error">{errors.terms.message}</span>
              )}
            </div>

            <button type="submit" className="auth-submit-btn">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
