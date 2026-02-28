import React from "react";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import Logo from "../Logo/Logo";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-grid">
          {/* Column 1 - Get Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Get Help</h4>
            <ul className="footer-list">
              <li>
                <Link to="/">Post a Request</Link>
              </li>
              <li>
                <Link to="/">Browse Helpers</Link>
              </li>
              <li>
                <Link to="/">Skill Marketplace</Link>
              </li>
              <li>
                <Link to="/">Project Catalog</Link>
              </li>
              <li>
                <Link to="/">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Offer Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Offer Help</h4>
            <ul className="footer-list">
              <li>
                <Link to="/">Find Requests</Link>
              </li>
              <li>
                <Link to="/">Earn Rewards</Link>
              </li>
              <li>
                <Link to="/">My Rewards</Link>
              </li>
              <li>
                <Link to="/">Leaderboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-list">
              <li>
                <Link to="/">Help & Support</Link>
              </li>
              <li>
                <Link to="/">Success Stories</Link>
              </li>
              <li>
                <Link to="/">How Rewards Work</Link>
              </li>
              <li>
                <Link to="/">Blog</Link>
              </li>
              <li>
                <Link to="/">Community</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-list">
              <li>
                <Link to="/">About Us</Link>
              </li>
              <li>
                <Link to="/">Our Mission</Link>
              </li>
              <li>
                <Link to="/">Careers</Link>
              </li>
              <li>
                <Link to="/">Press</Link>
              </li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
              <li>
                <Link to="/">Trust & Safety</Link>
              </li>
            </ul>
          </div>

          {/* Column 5 - Follow Us */}
          <div className="footer-col">
            <h4 className="footer-heading">Follow Us</h4>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
            <h4 className="footer-heading mt-24">Mobile App</h4>
            <div className="app-badges">
              <a href="#" className="app-badge">
                <FaApple className="app-badge-icon" />
                <div>
                  <span className="app-badge-sub">Download on the</span>
                  <span className="app-badge-main">App Store</span>
                </div>
              </a>
              <a href="#" className="app-badge">
                <FaGooglePlay className="app-badge-icon" />
                <div>
                  <span className="app-badge-sub">Get it on</span>
                  <span className="app-badge-main">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <Logo variant="light" size="sm" />
            <span className="footer-copy">&copy; 2026 Anwesha Inc.</span>
          </div>
          <div className="footer-bottom-right">
            <Link to="/">Terms of Service</Link>
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Cookie Settings</Link>
            <Link to="/">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
