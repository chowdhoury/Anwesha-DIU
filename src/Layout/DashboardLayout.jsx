import React, { useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import {
  IoMenuOutline,
  IoChevronBackOutline,
  IoHomeOutline,
  IoSpeedometerOutline,
  IoPersonOutline,
  IoDocumentTextOutline,
  IoHandLeftOutline,
  IoTrophyOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoSearchOutline,
  IoChevronDown,
  IoStorefrontOutline,
  IoRocketOutline,
  IoPeopleOutline,
  IoSendOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import Logo from "../Components/Logo/Logo";
import { AuthContext } from "../Authentication/AuthContext";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logOut, dbUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
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

  // const menuItems = [
  //   {
  //     section: "Main",
  //     items: [
  //       {
  //         to: "/dashboard",
  //         icon: <IoSpeedometerOutline />,
  //         label: "Dashboard",
  //       },
  //       {
  //         to: "/dashboard/my-requests",
  //         icon: <IoHandLeftOutline />,
  //         label: "My Requests",
  //       },
  //       {
  //         to: "/dashboard/my-skills",
  //         icon: <IoDocumentTextOutline />,
  //         label: "My Skills",
  //       },
  //       // {
  //       //   to: "/dashboard/my-offers",
  //       //   icon: <IoRocketOutline />,
  //       //   label: "My Offers",
  //       // },
  //       {
  //           to: "/dashboard/community-posts",
  //           icon: <IoPeopleOutline />,
  //           label: "Community Posts",
  //       }
  //     ],
  //   },
  //   // {
  //   //   section: "Explore",
  //   //   items: [
  //   //     {
  //   //       to: "/skill-marketplace",
  //   //       icon: <IoStorefrontOutline />,
  //   //       label: "Skill Marketplace",
  //   //     },
  //   //     {
  //   //       to: "/find-requests",
  //   //       icon: <IoSearchOutline />,
  //   //       label: "Find Requests",
  //   //     },
  //   //   ],
  //   // },
  //   {
  //     section: "Account",
  //     items: [
  //       { to: "/my-profile", icon: <IoPersonOutline />, label: "My Profile" },
  //       { to: "/my-rewards", icon: <IoTrophyOutline />, label: "My Rewards" },
  //       {
  //         to: "/dashboard/settings",
  //         icon: <IoSettingsOutline />,
  //         label: "Settings",
  //       },
  //     ],
  //   },
  // ];

  const menuItems = [
    {
      section: "Main",
      items: [
        {
          to: "/dashboard",
          icon: <IoSpeedometerOutline />,
          label: "Dashboard",
        },
        {
          to: "/dashboard/my-requests",
          icon: <IoHandLeftOutline />,
          label: "My Requests",
        },
        {
          to: "/dashboard/my-skills",
          icon: <IoDocumentTextOutline />,
          label: "My Skills",
        },
        {
          to: "/dashboard/my-projects",
          icon: <IoRocketOutline />,
          label: "My Projects",
        },
        {
          to: "/dashboard/my-offers",
          icon: <IoSendOutline />,
          label: "My Offers",
        },
        {
          to: "/dashboard/community-posts",
          icon: <IoPeopleOutline />,
          label: "Community Posts",
        },
      ],
    },
    {
      section: "Communication",
      items: [
        {
          to: "/dashboard/messages",
          icon: <IoChatbubbleOutline />,
          label: "Messages",
        },
        {
          to: "/dashboard/notifications",
          icon: <IoNotificationsOutline />,
          label: "Notifications",
        },
      ],
    },
  ];
  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside
        className={`dashboard-sidebar ${sidebarCollapsed ? "dashboard-sidebar--collapsed" : ""} ${mobileMenuOpen ? "dashboard-sidebar--mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            {sidebarCollapsed ? (
              <Logo size="sm" iconOnly />
            ) : (
              <Logo size="sm" />
            )}
          </Link>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <IoChevronBackOutline
              className={`sidebar-toggle-icon ${sidebarCollapsed ? "sidebar-toggle-icon--rotated" : ""}`}
            />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((section) => (
            <div key={section.section} className="sidebar-section">
              {!sidebarCollapsed && (
                <span className="sidebar-section-title">{section.section}</span>
              )}
              <ul className="sidebar-menu">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`sidebar-link ${isActive(item.to) ? "sidebar-link--active" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className="sidebar-link-icon">{item.icon}</span>
                      {!sidebarCollapsed && (
                        <span className="sidebar-link-label">{item.label}</span>
                      )}
                      {isActive(item.to) && (
                        <span className="sidebar-link-indicator" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link
            to="/"
            className="sidebar-link"
            title={sidebarCollapsed ? "Back to Home" : undefined}
          >
            <span className="sidebar-link-icon">
              <IoHomeOutline />
            </span>
            {!sidebarCollapsed && (
              <span className="sidebar-link-label">Back to Home</span>
            )}
          </Link>
          <Link
            to="/rewards"
            className="sidebar-link"
            title={sidebarCollapsed ? "Help Center" : undefined}
          >
            <span className="sidebar-link-icon">
              <IoHelpCircleOutline />
            </span>
            {!sidebarCollapsed && (
              <span className="sidebar-link-label">Help Center</span>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div
        className={`dashboard-overlay ${mobileMenuOpen ? "dashboard-overlay--visible" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`dashboard-main ${sidebarCollapsed ? "dashboard-main--expanded" : ""}`}
      >
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <IoMenuOutline />
            </button>
            <div className="header-search">
              <IoSearchOutline className="header-search-icon" />
              <input
                type="text"
                placeholder="Search..."
                className="header-search-input"
              />
            </div>
          </div>

          <div className="header-right">
            <Link to="/my-rewards" className="header-reward-badge">
              <IoTrophyOutline />
              <span className="header-reward-points">
                {dbUser?.rewardPoints ?? 0} pts
              </span>
            </Link>

            <button className="header-notification-btn">
              <IoNotificationsOutline />
              <span className="notification-badge">3</span>
            </button>

            <div
              className={`header-profile ${profileDropdownOpen ? "header-profile--open" : ""}`}
              onMouseEnter={() => setProfileDropdownOpen(true)}
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <button
                className="header-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="header-avatar-img"
                  />
                ) : (
                  <span className="header-avatar-initials">
                    {getInitials(user?.displayName)}
                  </span>
                )}
                <div className="header-user-info">
                  <span className="header-user-name">
                    {user?.displayName || "User"}
                  </span>
                  <span className="header-user-role">Member</span>
                </div>
                <IoChevronDown className="header-avatar-chevron" />
              </button>

              <div className="header-dropdown">
                <div className="header-dropdown-header">
                  <span className="header-dropdown-name">
                    {user?.displayName || "User"}
                  </span>
                  <span className="header-dropdown-email">{user?.email}</span>
                </div>
                <div className="header-dropdown-divider" />
                <Link to="/my-profile" className="header-dropdown-item">
                  <IoPersonOutline />
                  My Profile
                </Link>
                <Link to="/my-rewards" className="header-dropdown-item">
                  <IoTrophyOutline />
                  My Rewards
                </Link>
                <Link to="/dashboard/settings" className="header-dropdown-item">
                  <IoSettingsOutline />
                  Settings
                </Link>
                <div className="header-dropdown-divider" />
                <button
                  className="header-dropdown-logout"
                  onClick={handleLogout}
                >
                  <IoLogOutOutline />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
