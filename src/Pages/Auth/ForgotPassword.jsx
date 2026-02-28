import React, { useState, useContext } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Authentication/AuthContext";
import { IoMailOutline, IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import Logo from "../../Components/Logo/Logo";
import "./Auth.css";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email } = data;
    setIsLoading(true);
    try {
      await resetPassword(email);
      setSubmittedEmail(email);
      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resetPassword(submittedEmail);
      toast.success("Reset email resent!");
    } catch (err) {
      console.error("Resend error:", err);
      toast.error(err?.message || "Failed to resend. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h2>Don't worry!</h2>
          <p>
            It happens to the best of us. Enter your email and we'll send you a
            link to reset your password and get back to the community.
          </p>
          <div className="auth-side-stats">
            <div className="auth-side-stat">
              <span className="auth-side-stat-val">24/7</span>
              <span className="auth-side-stat-label">Support Available</span>
            </div>
            <div className="auth-side-stat">
              <span className="auth-side-stat-val">Secure</span>
              <span className="auth-side-stat-label">Reset Process</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          <Link to="/signin" className="back-link">
            <IoArrowBack /> Back to Sign In
          </Link>

          {!submitted ? (
            <>
              <div className="auth-form-header">
                <div className="auth-icon-circle">
                  <IoMailOutline />
                </div>
                <h1>Forgot Password?</h1>
                <p>
                  No worries! Enter the email address associated with your
                  account and we'll send you a reset link.
                </p>
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

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="auth-success">
              <div className="success-icon">
                <IoCheckmarkCircle />
              </div>
              <h2>Check your email</h2>
              <p>
                We've sent a password reset link to{" "}
                <strong>{submittedEmail}</strong>. Please check your inbox and
                follow the instructions.
              </p>
              <p className="success-sub">
                Didn't receive the email?{" "}
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  {isLoading ? "Resending..." : "Click to resend"}
                </button>
              </p>
              <Link
                to="/signin"
                className="auth-submit-btn"
                style={{
                  textAlign: "center",
                  display: "block",
                  marginTop: "24px",
                }}
              >
                Back to Sign In
              </Link>
            </div>
          )}

          <p className="auth-switch">
            Remember your password? <Link to="/signin">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

