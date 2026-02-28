import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router";
import {
  IoMenu,
  IoClose,
  IoChevronDown,
  IoHandLeftOutline,
  IoRocketOutline,
  IoStorefrontOutline,
  IoGridOutline,
  IoSearchOutline,
  IoTrophyOutline,
  IoStarOutline,
  IoPeopleOutline,
  IoHelpCircleOutline,
  IoFlashOutline,
  IoPersonOutline,
  IoDocumentTextOutline,
  IoLogOutOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import Logo from "../Logo/Logo";
import { AuthContext } from "../../Authentication/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logOut } = useContext(AuthContext);
  const navRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navMenus = [
    {
      label: "Get Help",
      key: "gethelp",
      items: [
        { to: "/post-request", icon: <IoHandLeftOutline />, label: "Post a Request", desc: "Get help from the community" },
        // { to: "/skill-marketplace", icon: <IoSearchOutline />, label: "Browse Helpers", desc: "Find skilled people nearby" },
        { to: "/skill-marketplace", icon: <IoStorefrontOutline />, label: "Skill Marketplace", desc: "Explore available skills" },
        { to: "/project-catalog", icon: <IoGridOutline />, label: "Project Catalog", desc: "Browse active projects" },
      ],
    },
    {
      label: "Offer Help",
      key: "offerhelp",
      items: [
        { to: "/find-requests", icon: <IoRocketOutline />, label: "Find Requests", desc: "Help others & earn rewards" },
        // { to: "/my-rewards", icon: <IoTrophyOutline />, label: "My Rewards", desc: "View your earned rewards" },
        { to: "/post-skill", icon: <IoDocumentTextOutline />, label: "Offer a Skill", desc: "List your skill on the marketplace" },
      ],
    },
    {
      label: "Why Anwesha",
      key: "why",
      items: [
        { to: "/rewards", icon: <IoHelpCircleOutline />, label: "How Rewards Work", desc: "Understand the reward system" },
        // { to: "/community", icon: <IoStarOutline />, label: "Success Stories", desc: "Real stories from members" },
        { to: "/community", icon: <IoPeopleOutline />, label: "Community", desc: "Join the conversation" },
      ],
    },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {navMenus.map((menu) => (
              <li
                key={menu.key}
                className={`nav-item ${activeDropdown === menu.key ? "nav-item--open" : ""}`}
                onMouseEnter={() => setActiveDropdown(menu.key)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="nav-link"
                  onClick={() => handleDropdown(menu.key)}
                  aria-expanded={activeDropdown === menu.key}
                >
                  {menu.label}
                  <IoChevronDown className="nav-link-chevron" />
                </button>
                <div className="dropdown-menu">
                  <div className="dropdown-menu-inner">
                    {menu.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.to}
                        className="dropdown-item"
                      >
                        <span className="dropdown-item-icon">{item.icon}</span>
                        <div className="dropdown-item-text">
                          <span className="dropdown-item-label">{item.label}</span>
                          <span className="dropdown-item-desc">{item.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ))}
            <li className="nav-item">
              <Link to="/rewards" className="nav-link">
                <IoFlashOutline className="nav-link-icon" />
                Rewards
              </Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="nav-right">
            {user ? (
              <div
                className={`nav-profile ${activeDropdown === "profile" ? "nav-item--open" : ""}`}
                onMouseEnter={() => setActiveDropdown("profile")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="nav-avatar-btn"
                  onClick={() => handleDropdown("profile")}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="nav-avatar-img"
                    />
                  ) : (
                    <span className="nav-avatar-initials">
                      {getInitials(user.displayName)}
                    </span>
                  )}
                  <IoChevronDown className="nav-avatar-chevron" />
                </button>
                <div className="dropdown-menu dropdown-menu--profile">
                  <div className="dropdown-profile-header">
                    <span className="dropdown-profile-name">
                      {user.displayName || "User"}
                    </span>
                    <span className="dropdown-profile-email">
                      {user.email}
                    </span>
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-menu-inner">
                    <Link to="/dashboard" className="dropdown-item">
                      <span className="dropdown-item-icon"><IoSpeedometerOutline /></span>
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-label">Dashboard</span>
                      </div>
                    </Link>
                    <Link to="/my-profile" className="dropdown-item">
                      <span className="dropdown-item-icon"><IoPersonOutline /></span>
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-label">My Profile</span>
                      </div>
                    </Link>
                    <Link to="/my-rewards" className="dropdown-item">
                      <span className="dropdown-item-icon"><IoTrophyOutline /></span>
                      <div className="dropdown-item-text">
                        <span className="dropdown-item-label">My Rewards</span>
                      </div>
                    </Link>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-logout" onClick={handleLogout}>
                    <IoLogOutOutline />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="nav-auth">
                <Link to="/signin" className="btn-login">
                  Log In
                </Link>
                <Link to="/signup" className="btn-signup">
                  Sign Up
                  <span className="btn-signup-glow" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <span className={`hamburger ${mobileMenuOpen ? "hamburger--active" : ""}`}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? "mobile-overlay--visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "mobile-drawer--open" : ""}`}>
        <div className="mobile-drawer-header">
          <Logo size="sm" />
          <button
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <IoClose />
          </button>
        </div>

        <div className="mobile-drawer-content">
          {navMenus.map((menu) => (
            <div key={menu.key} className="mobile-section">
              <span className="mobile-section-title">{menu.label}</span>
              {menu.items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.to}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mobile-link-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <Link
            to="/rewards"
            className="mobile-link mobile-link--highlight"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="mobile-link-icon"><IoFlashOutline /></span>
            Rewards
          </Link>
        </div>

        <div className="mobile-drawer-footer">
          {user ? (
            <>
              <div className="mobile-user-info">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="mobile-user-avatar" />
                ) : (
                  <span className="mobile-user-avatar mobile-user-initials">
                    {getInitials(user.displayName)}
                  </span>
                )}
                <div>
                  <span className="mobile-user-name">{user.displayName || "User"}</span>
                  <span className="mobile-user-email">{user.email}</span>
                </div>
              </div>
              <button className="btn-logout-mobile" onClick={handleLogout}>
                <IoLogOutOutline /> Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link
                to="/signin"
                className="btn-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn-signup"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
