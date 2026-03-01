import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import {
  IoTrophyOutline,
  IoFlashOutline,
  IoPeopleOutline,
  IoCheckmarkCircle,
  IoStarSharp,
  IoRocketOutline,
  IoArrowForward,
  IoHandLeftOutline,
  IoStorefrontOutline,
  IoGridOutline,
  IoSearchOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoNotificationsOutline,
  IoTrendingUpOutline,
  IoAddCircleOutline,
  IoChevronForward,
  IoEllipsisHorizontal,
  IoCodeSlashOutline,
  IoColorPaletteOutline,
  IoBulbOutline,
  IoBookOutline,
  IoHelpCircleOutline,
  IoGiftOutline,
  IoCloseCircleOutline,
  IoChatbubbleOutline,
  IoCheckmarkDoneOutline,
  IoConstructOutline,
} from "react-icons/io5";
import { FaCoins, FaHandshake } from "react-icons/fa";
import "./Dashboard.css";

/* ─── Mock Data ─────────────────────────────────────── */
const mockStats = {
  rewardPoints: 1250,
  tasksCompleted: 34,
  helpGiven: 28,
  helpReceived: 6,
  rating: 4.9,
  reviews: 22,
  pointsThisWeek: +120,
  rankPercentile: 8,
};

const mockActivity = [
  {
    type: "helped",
    icon: <IoCodeSlashOutline />,
    title: "Helped debug a React application",
    reward: "+50 pts",
    time: "2 hours ago",
    user: "Priya S.",
  },
  {
    type: "received",
    icon: <IoColorPaletteOutline />,
    title: "Got help with logo redesign",
    reward: "-30 pts",
    time: "1 day ago",
    user: "Alex T.",
  },
  {
    type: "helped",
    icon: <IoBulbOutline />,
    title: "Mentored a junior developer",
    reward: "+75 pts",
    time: "3 days ago",
    user: "Rohan M.",
  },
  {
    type: "helped",
    icon: <IoBookOutline />,
    title: "Wrote a Python tutorial",
    reward: "+40 pts",
    time: "5 days ago",
    user: "Sarah K.",
  },
  {
    type: "received",
    icon: <IoHelpCircleOutline />,
    title: "Got SEO advice for my blog",
    reward: "-20 pts",
    time: "1 week ago",
    user: "Dan W.",
  },
];

const mockRequests = [
  {
    id: 1,
    title: "Need help with TypeScript generics",
    category: "Development",
    reward: 80,
    status: "open",
    bids: 3,
    deadline: "2 days",
    urgency: "high",
  },
  {
    id: 2,
    title: "Logo design for my startup",
    category: "Design",
    reward: 120,
    status: "in-progress",
    bids: 1,
    deadline: "5 days",
    urgency: "medium",
  },
  {
    id: 3,
    title: "Review my business plan",
    category: "Business",
    reward: 60,
    status: "open",
    bids: 0,
    deadline: "7 days",
    urgency: "low",
  },
];

const mockAvailableRequests = [
  {
    id: 1,
    title: "Fix responsive CSS layout issues",
    category: "Development & IT",
    reward: 90,
    deadline: "3 days",
    skills: ["CSS", "HTML"],
    postedBy: "Emma R.",
    bids: 2,
  },
  {
    id: 2,
    title: "Create social media graphics pack",
    category: "Design & Creative",
    reward: 150,
    deadline: "4 days",
    skills: ["Figma", "Illustrator"],
    postedBy: "James L.",
    bids: 5,
  },
  {
    id: 3,
    title: "Write product descriptions for e-commerce",
    category: "Writing",
    reward: 70,
    deadline: "2 days",
    skills: ["Copywriting", "SEO"],
    postedBy: "Maya P.",
    bids: 1,
  },
];

const mockHelpingTasks = [
  {
    id: 1,
    title: "Debug React application — state management issue",
    category: "Development & IT",
    reward: 50,
    status: "in-progress",
    requestedBy: "Priya S.",
    deadline: "1 day",
    progress: 70,
    startedAgo: "2 hours ago",
    skills: ["React", "JavaScript"],
  },
  {
    id: 2,
    title: "Mentor junior developer on Node.js basics",
    category: "Development & IT",
    reward: 75,
    status: "in-progress",
    requestedBy: "Rohan M.",
    deadline: "3 days",
    progress: 40,
    startedAgo: "3 days ago",
    skills: ["Node.js", "Mentoring"],
  },
  {
    id: 3,
    title: "Write a Python data science tutorial",
    category: "Writing",
    reward: 40,
    status: "completed",
    requestedBy: "Sarah K.",
    deadline: "Done",
    progress: 100,
    startedAgo: "5 days ago",
    skills: ["Python", "Writing"],
  },
  {
    id: 4,
    title: "Fix CSS responsive layout for landing page",
    category: "Design & IT",
    reward: 35,
    status: "completed",
    requestedBy: "Liam O.",
    deadline: "Done",
    progress: 100,
    startedAgo: "1 week ago",
    skills: ["CSS", "HTML"],
  },
  {
    id: 5,
    title: "Review and improve REST API documentation",
    category: "Development & IT",
    reward: 60,
    status: "in-progress",
    requestedBy: "Fatima A.",
    deadline: "2 days",
    progress: 55,
    startedAgo: "1 day ago",
    skills: ["API", "Technical Writing"],
  },
];

const mockBadges = [
  { icon: <IoRocketOutline />, label: "Early Adopter", color: "#6366f1" },
  { icon: <IoFlashOutline />, label: "Quick Responder", color: "#f59e0b" },
  { icon: <IoCheckmarkCircle />, label: "Verified", color: "#14a800" },
  { icon: <FaHandshake />, label: "Team Player", color: "#ec4899" },
];

const quickActions = [
  {
    icon: <IoHandLeftOutline />,
    label: "Post a Request",
    desc: "Get help from community",
    to: "/post-request",
    color: "#6366f1",
    bg: "#6366f115",
  },
  {
    icon: <IoSearchOutline />,
    label: "Find Requests",
    desc: "Help others & earn points",
    to: "/find-requests",
    color: "#14a800",
    bg: "#14a80015",
  },
  {
    icon: <IoDocumentTextOutline />,
    label: "Offer a Skill",
    desc: "List your skill for hire",
    to: "/post-skill",
    color: "#f59e0b",
    bg: "#f59e0b15",
  },
  {
    icon: <IoStorefrontOutline />,
    label: "Skill Marketplace",
    desc: "Explore available skills",
    to: "/skill-marketplace",
    color: "#0ea5e9",
    bg: "#0ea5e915",
  },
  {
    icon: <IoGridOutline />,
    label: "Project Catalog",
    desc: "Browse active projects",
    to: "/project-catalog",
    color: "#ec4899",
    bg: "#ec489915",
  },
  {
    icon: <IoTrophyOutline />,
    label: "My Rewards",
    desc: "View earned rewards",
    to: "/my-rewards",
    color: "#f97316",
    bg: "#f9731615",
  },
];

/* ─── Component ─────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("my-requests");
  const [notifOpen, setNotifOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="dashboard">
      {/* ══════ HERO BANNER ══════ */}
      <div className="dash-hero">
        <div className="dash-hero-bg" />
        <div className="dash-hero-container">
          <div className="dash-hero-left">
            <div className="dash-avatar-wrap">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName}
                  className="dash-avatar-img"
                />
              ) : (
                <div className="dash-avatar-fallback">
                  {getInitials(user?.displayName)}
                </div>
              )}
              <span className="dash-online-dot" />
            </div>
            <div className="dash-hero-info">
              <p className="dash-greeting">{getGreeting()},</p>
              <h1 className="dash-username">
                {user?.displayName || "Explorer"} 👋
              </h1>
              <p className="dash-tagline">
                You're in the top{" "}
                <span className="dash-rank">
                  {mockStats.rankPercentile}%
                </span>{" "}
                of helpers this week. Keep it up!
              </p>
            </div>
          </div>

          <div className="dash-hero-right">
            <div className="dash-points-badge">
              <FaCoins className="dash-coins-icon" />
              <div>
                <span className="dash-points-value">
                  {mockStats.rewardPoints.toLocaleString()}
                </span>
                <span className="dash-points-label">Reward Points</span>
              </div>
              <span className="dash-points-change">
                +{mockStats.pointsThisWeek} this week
              </span>
            </div>

            {/* Notification bell */}
            <div className="dash-notif-wrap">
              <button
                className="dash-notif-btn"
                onClick={() => setNotifOpen(!notifOpen)}
                aria-label="Notifications"
              >
                <IoNotificationsOutline />
                <span className="dash-notif-dot" />
              </button>
              {notifOpen && (
                <div className="dash-notif-dropdown">
                  <div className="dash-notif-header">
                    <span>Notifications</span>
                    <button onClick={() => setNotifOpen(false)}>
                      <IoCloseCircleOutline />
                    </button>
                  </div>
                  <div className="dash-notif-item dash-notif-item--unread">
                    <IoCheckmarkCircle className="dash-notif-icon green" />
                    <div>
                      <p>Priya accepted your offer!</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="dash-notif-item dash-notif-item--unread">
                    <IoTrophyOutline className="dash-notif-icon yellow" />
                    <div>
                      <p>You earned a new badge: Quick Responder</p>
                      <span>1 day ago</span>
                    </div>
                  </div>
                  <div className="dash-notif-item">
                    <IoPeopleOutline className="dash-notif-icon blue" />
                    <div>
                      <p>3 new requests match your skills</p>
                      <span>3 days ago</span>
                    </div>
                  </div>
                  <Link
                    to="/community"
                    className="dash-notif-all"
                    onClick={() => setNotifOpen(false)}
                  >
                    View all notifications <IoArrowForward />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-container">
        {/* ══════ STATS ROW ══════ */}
        <div className="dash-stats-grid">
          <div className="dash-stat-card dash-stat-card--purple">
            <div className="dash-stat-icon">
              <IoTrophyOutline />
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">
                {mockStats.rewardPoints.toLocaleString()}
              </span>
              <span className="dash-stat-label">Reward Points</span>
            </div>
            <div className="dash-stat-trend">
              <IoTrendingUpOutline />
              <span>+{mockStats.pointsThisWeek} wk</span>
            </div>
          </div>

          <div className="dash-stat-card dash-stat-card--green">
            <div className="dash-stat-icon">
              <IoPeopleOutline />
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{mockStats.helpGiven}</span>
              <span className="dash-stat-label">People Helped</span>
            </div>
            <Link to="/find-requests" className="dash-stat-action">
              Help more <IoChevronForward />
            </Link>
          </div>

          <div className="dash-stat-card dash-stat-card--blue">
            <div className="dash-stat-icon">
              <IoCheckmarkCircle />
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">
                {mockStats.tasksCompleted}
              </span>
              <span className="dash-stat-label">Tasks Completed</span>
            </div>
            <Link to="/my-profile" className="dash-stat-action">
              View all <IoChevronForward />
            </Link>
          </div>

          <div className="dash-stat-card dash-stat-card--yellow">
            <div className="dash-stat-icon">
              <IoStarSharp />
            </div>
            <div className="dash-stat-body">
              <span className="dash-stat-value">{mockStats.rating}</span>
              <span className="dash-stat-label">
                Avg Rating ({mockStats.reviews} reviews)
              </span>
            </div>
            <Link to="/my-profile" className="dash-stat-action">
              See reviews <IoChevronForward />
            </Link>
          </div>
        </div>

        {/* ══════ MAIN GRID ══════ */}
        <div className="dash-main-grid">
          {/* LEFT: Quick Actions + Requests Tabs */}
          <div className="dash-col-main">
            {/* Quick Actions */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <IoFlashOutline /> Quick Actions
                </h2>
              </div>
              <div className="dash-quick-grid">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    to={action.to}
                    className="dash-quick-item"
                    style={{ "--action-color": action.color, "--action-bg": action.bg }}
                  >
                    <span className="dash-quick-icon">{action.icon}</span>
                    <div className="dash-quick-text">
                      <span className="dash-quick-label">{action.label}</span>
                      <span className="dash-quick-desc">{action.desc}</span>
                    </div>
                    <IoChevronForward className="dash-quick-arrow" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Requests / Available Tabs */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <IoDocumentTextOutline /> Tasks & Requests
                </h2>
                <div className="dash-tabs">
                  <button
                    className={`dash-tab ${activeTab === "my-requests" ? "dash-tab--active" : ""}`}
                    onClick={() => setActiveTab("my-requests")}
                  >
                    My Requests
                  </button>
                  <button
                    className={`dash-tab ${activeTab === "helping" ? "dash-tab--active" : ""}`}
                    onClick={() => setActiveTab("helping")}
                  >
                    I'm Helping
                    <span className="dash-tab-badge">
                      {mockHelpingTasks.filter(t => t.status === "in-progress").length}
                    </span>
                  </button>
                  <button
                    className={`dash-tab ${activeTab === "available" ? "dash-tab--active" : ""}`}
                    onClick={() => setActiveTab("available")}
                  >
                    Find Work
                  </button>
                </div>
              </div>

              {activeTab === "my-requests" && (
                <div className="dash-requests-list">
                  {mockRequests.map((req) => (
                    <div key={req.id} className="dash-req-item">
                      <div className="dash-req-left">
                        <div className="dash-req-meta">
                          <span
                            className={`dash-req-status dash-req-status--${req.status}`}
                          >
                            {req.status === "open" ? "Open" : "In Progress"}
                          </span>
                          <span
                            className={`dash-req-urgency dash-req-urgency--${req.urgency}`}
                          >
                            {req.urgency}
                          </span>
                        </div>
                        <h3 className="dash-req-title">{req.title}</h3>
                        <div className="dash-req-info">
                          <span>
                            <IoTimeOutline /> {req.deadline} left
                          </span>
                          <span>
                            <IoPeopleOutline /> {req.bids} bid
                            {req.bids !== 1 ? "s" : ""}
                          </span>
                          <span className="dash-req-cat">{req.category}</span>
                        </div>
                      </div>
                      <div className="dash-req-right">
                        <div className="dash-req-reward">
                          <FaCoins className="dash-coin-icon" />
                          <span>{req.reward} pts</span>
                        </div>
                        <button className="dash-req-btn">
                          <IoEllipsisHorizontal />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Link to="/post-request" className="dash-add-request-btn">
                    <IoAddCircleOutline /> Post New Request
                  </Link>
                </div>
              )}

              {activeTab === "helping" && (
                <div className="dash-requests-list">
                  {/* Summary strip */}
                  <div className="dash-helping-summary">
                    <div className="dash-helping-pill dash-helping-pill--active">
                      <IoConstructOutline />
                      <span>{mockHelpingTasks.filter(t => t.status === "in-progress").length} In Progress</span>
                    </div>
                    <div className="dash-helping-pill dash-helping-pill--done">
                      <IoCheckmarkDoneOutline />
                      <span>{mockHelpingTasks.filter(t => t.status === "completed").length} Completed</span>
                    </div>
                  </div>

                  {mockHelpingTasks.map((task) => (
                    <div key={task.id} className={`dash-req-item dash-helping-item dash-helping-item--${task.status}`}>
                      <div className="dash-req-left">
                        <div className="dash-req-meta">
                          <span className={`dash-req-status dash-req-status--${task.status === "in-progress" ? "in-progress" : "done"}`}>
                            {task.status === "in-progress" ? (
                              <><IoConstructOutline style={{marginRight:3}}/> In Progress</>
                            ) : (
                              <><IoCheckmarkDoneOutline style={{marginRight:3}}/> Completed</>
                            )}
                          </span>
                          <span className="dash-req-cat">{task.category}</span>
                        </div>

                        <h3 className="dash-req-title">{task.title}</h3>

                        <div className="dash-req-info">
                          <span><IoPeopleOutline /> For: <strong>{task.requestedBy}</strong></span>
                          {task.status === "in-progress" && (
                            <span><IoTimeOutline /> {task.deadline} left</span>
                          )}
                          <span style={{color:"#9ca3af"}}>Started {task.startedAgo}</span>
                        </div>

                        <div className="dash-req-skills" style={{marginTop:6}}>
                          {task.skills.map((s) => (
                            <span key={s} className="dash-skill-chip">{s}</span>
                          ))}
                        </div>

                        {/* Progress bar */}
                        {task.status === "in-progress" && (
                          <div className="dash-task-progress">
                            <div className="dash-task-progress-bar">
                              <div
                                className="dash-task-progress-fill"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                            <span className="dash-task-progress-pct">{task.progress}%</span>
                          </div>
                        )}
                      </div>

                      <div className="dash-req-right">
                        <div className="dash-req-reward">
                          <FaCoins className="dash-coin-icon" />
                          <span>{task.status === "completed" ? "+" : ""}{task.reward} pts</span>
                        </div>
                        {task.status === "in-progress" ? (
                          <button className="dash-req-offer-btn" style={{background:"#6366f1"}}>
                            <IoChatbubbleOutline /> Message
                          </button>
                        ) : (
                          <span className="dash-done-label">
                            <IoCheckmarkDoneOutline /> Rewarded
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <Link to="/find-requests" className="dash-view-more-btn">
                    Find More Tasks to Help With <IoArrowForward />
                  </Link>
                </div>
              )}

              {activeTab === "available" && (
                <div className="dash-requests-list">
                  {mockAvailableRequests.map((req) => (
                    <div key={req.id} className="dash-req-item">
                      <div className="dash-req-left">
                        <h3 className="dash-req-title">{req.title}</h3>
                        <div className="dash-req-info">
                          <span>
                            <IoTimeOutline /> {req.deadline} left
                          </span>
                          <span>
                            <IoPeopleOutline /> {req.bids} bid
                            {req.bids !== 1 ? "s" : ""}
                          </span>
                          <span className="dash-req-cat">{req.category}</span>
                        </div>
                        <div className="dash-req-skills">
                          {req.skills.map((s) => (
                            <span key={s} className="dash-skill-chip">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="dash-req-right">
                        <div className="dash-req-reward">
                          <FaCoins className="dash-coin-icon" />
                          <span>{req.reward} pts</span>
                        </div>
                        <Link
                          to="/find-requests"
                          className="dash-req-offer-btn"
                        >
                          Offer Help <IoArrowForward />
                        </Link>
                      </div>
                    </div>
                  ))}
                  <Link to="/find-requests" className="dash-view-more-btn">
                    Browse All Requests <IoArrowForward />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="dash-col-sidebar">
            {/* Progress Card */}
            <div className="dash-card dash-progress-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <IoTrendingUpOutline /> Weekly Progress
                </h2>
              </div>
              <div className="dash-progress-body">
                <div className="dash-progress-item">
                  <div className="dash-progress-label-row">
                    <span>Help Given</span>
                    <span className="dash-progress-val">
                      {mockStats.helpGiven} / 30
                    </span>
                  </div>
                  <div className="dash-progress-bar">
                    <div
                      className="dash-progress-fill dash-progress-fill--green"
                      style={{
                        width: `${(mockStats.helpGiven / 30) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="dash-progress-item">
                  <div className="dash-progress-label-row">
                    <span>Tasks Done</span>
                    <span className="dash-progress-val">
                      {mockStats.tasksCompleted} / 40
                    </span>
                  </div>
                  <div className="dash-progress-bar">
                    <div
                      className="dash-progress-fill dash-progress-fill--purple"
                      style={{
                        width: `${(mockStats.tasksCompleted / 40) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="dash-progress-item">
                  <div className="dash-progress-label-row">
                    <span>Rating Goal</span>
                    <span className="dash-progress-val">
                      {mockStats.rating} / 5.0
                    </span>
                  </div>
                  <div className="dash-progress-bar">
                    <div
                      className="dash-progress-fill dash-progress-fill--yellow"
                      style={{
                        width: `${(mockStats.rating / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Rank badge */}
              <div className="dash-rank-badge">
                <div className="dash-rank-circle">
                  <span className="dash-rank-num">
                    Top {mockStats.rankPercentile}%
                  </span>
                  <span className="dash-rank-sub">Helper</span>
                </div>
                <div className="dash-rank-info">
                  <p>
                    You're among the top{" "}
                    <strong>{mockStats.rankPercentile}%</strong> of helpers
                    in the community this week!
                  </p>
                  <Link to="/rewards" className="dash-rank-link">
                    View leaderboard <IoArrowForward />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <IoTimeOutline /> Recent Activity
                </h2>
                <Link to="/my-profile" className="dash-card-link">
                  View All
                </Link>
              </div>
              <div className="dash-activity-list">
                {mockActivity.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="dash-activity-item">
                    <div
                      className={`dash-activity-icon dash-activity-icon--${item.type}`}
                    >
                      {item.icon}
                    </div>
                    <div className="dash-activity-info">
                      <span className="dash-activity-title">{item.title}</span>
                      <div className="dash-activity-meta">
                        <span className="dash-activity-user">
                          with {item.user}
                        </span>
                        <span className="dash-activity-time">{item.time}</span>
                      </div>
                    </div>
                    <span
                      className={`dash-activity-reward dash-activity-reward--${item.type}`}
                    >
                      {item.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <IoGiftOutline /> My Badges
                </h2>
                <Link to="/my-rewards" className="dash-card-link">
                  All Rewards
                </Link>
              </div>
              <div className="dash-badges-grid">
                {mockBadges.map((badge, idx) => (
                  <div key={idx} className="dash-badge-item">
                    <span
                      className="dash-badge-icon"
                      style={{
                        background: `${badge.color}18`,
                        color: badge.color,
                      }}
                    >
                      {badge.icon}
                    </span>
                    <span className="dash-badge-label">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA: Post a Request */}
            <div className="dash-card dash-cta-card">
              <div className="dash-cta-icon">
                <IoRocketOutline />
              </div>
              <h3>Need help with something?</h3>
              <p>
                Post a request and let the community come to you. Spend your
                reward points to get expert help.
              </p>
              <Link to="/post-request" className="dash-cta-btn">
                Post a Request <IoArrowForward />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
