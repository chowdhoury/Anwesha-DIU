import React from "react";
import { Link } from "react-router";
import { IoHomeOutline, IoArrowBack, IoSearchOutline } from "react-icons/io5";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="nf-page">
      <div className="nf-bg-orbs">
        <span className="nf-orb nf-orb--1" />
        <span className="nf-orb nf-orb--2" />
      </div>
      <div className="nf-inner">
        <div className="nf-code">404</div>
        <div className="nf-emoji">🌿</div>
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-desc">
          Looks like this page got lost in the community garden. Let&apos;s get
          you back on track.
        </p>
        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">
            <IoHomeOutline /> Go Home
          </Link>
          <button className="nf-btn-secondary" onClick={() => window.history.back()}>
            <IoArrowBack /> Go Back
          </button>
        </div>
        <div className="nf-suggestions">
          <p className="nf-suggestions-label">You might be looking for:</p>
          <div className="nf-suggestions-links">
            <Link to="/skill-marketplace" className="nf-suggestion-chip">
              <IoSearchOutline /> Skill Marketplace
            </Link>
            <Link to="/rewards" className="nf-suggestion-chip">
              Rewards
            </Link>
            <Link to="/post-skill" className="nf-suggestion-chip">
              Offer a Skill
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
