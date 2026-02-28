import React from "react";
import "./Logo.css";

const Logo = ({ variant = "default", size = "md" }) => {
  return (
    <span className={`logo logo--${variant} logo--${size}`}>
      <span className="logo-icon">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          {/* Outer ring with gradient */}
          <defs>
            <linearGradient id="logoGrad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14a800" />
              <stop offset="100%" stopColor="#6fda44" />
            </linearGradient>
            <linearGradient id="logoGrad2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0e8c00" />
              <stop offset="100%" stopColor="#14a800" />
            </linearGradient>
          </defs>
          {/* Stylized "A" mark with abstract connection nodes */}
          <circle cx="20" cy="20" r="18" stroke="url(#logoGrad1)" strokeWidth="2.5" fill="none" />
          <path
            d="M20 8L12 28h3.5l1.8-4h5.4l1.8 4H28L20 8zm0 7.5L23.2 22h-6.4L20 15.5z"
            fill="url(#logoGrad2)"
          />
          {/* Connection dots representing collaboration */}
          <circle cx="8" cy="14" r="2" fill="#6fda44" opacity="0.8" />
          <circle cx="32" cy="14" r="2" fill="#14a800" opacity="0.8" />
          <circle cx="20" cy="34" r="2" fill="#0e8c00" opacity="0.8" />
          {/* Connection lines */}
          <line x1="10" y1="14" x2="14" y2="18" stroke="#6fda44" strokeWidth="0.8" opacity="0.4" />
          <line x1="30" y1="14" x2="26" y2="18" stroke="#14a800" strokeWidth="0.8" opacity="0.4" />
        </svg>
      </span>
      <span className="logo-wordmark">
        <span className="logo-word-primary">anwe</span>
        <span className="logo-word-accent">sha</span>
      </span>
    </span>
  );
};

export default Logo;
