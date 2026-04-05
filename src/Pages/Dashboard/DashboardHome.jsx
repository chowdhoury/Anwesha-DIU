import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import {
  IoSpeedometerOutline,
  IoRocketOutline,
  IoDocumentTextOutline,
  IoHandLeftOutline,
  IoTrophyOutline,
  IoFlashOutline,
  IoArrowForward,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
  IoPeopleOutline,
  IoAddCircleOutline,
  IoStorefrontOutline,
  IoSearchOutline,
  IoChatbubbleOutline,
  IoEllipseSharp,
  IoChevronForward,
  IoCalendarOutline,
  IoStarOutline,
  IoSendOutline,
  IoAlertCircleOutline,
  IoWalletOutline,
} from "react-icons/io5";
import "./DashboardHome.css";

const API_BASE = "http://localhost:3000";

const DashboardHome = () => {
  const { user, dbUser } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, projectsRes, skillsRes, requestsRes, offersRes] =
        await Promise.allSettled([
          fetch(`${API_BASE}/users/${user.email}/stats`),
          fetch(`${API_BASE}/projects?email=${user.email}`),
          fetch(`${API_BASE}/skills?seller=${user.email}`),
          fetch(`${API_BASE}/posts?user=${user.email}`),
          fetch(`${API_BASE}/applications/user/${user.email}`),
        ]);

      if (statsRes.status === "fulfilled" && statsRes.value.ok)
        setStats(await statsRes.value.json());
      if (projectsRes.status === "fulfilled" && projectsRes.value.ok)
        setProjects(await projectsRes.value.json());
      if (skillsRes.status === "fulfilled" && skillsRes.value.ok)
        setSkills(await skillsRes.value.json());
      if (requestsRes.status === "fulfilled" && requestsRes.value.ok)
        setRequests(await requestsRes.value.json());
      if (offersRes.status === "fulfilled" && offersRes.value.ok)
        setOffers(await offersRes.value.json());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    fetchDashboardData();
  }, [user, fetchDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getFirstName = () => {
    const name = user?.displayName || "there";
    return name.split(" ")[0];
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const activeProjects = projects.filter(
    (p) =>
      p.status === "in_progress" ||
      p.status === "delivered" ||
      p.status === "revision_requested",
  );
  const completedProjects = projects.filter((p) => p.status === "completed");
  const publishedSkills = skills.filter((s) => s.status === "published");
  const openRequests = requests.filter((r) => r.status === "OPEN");
  const pendingOffers = offers.filter((o) => o.status === "pending");

  const rewardPoints = dbUser?.rewardPoints ?? 0;
  const reservedPoints = dbUser?.tobereleased ?? 0;
  const availablePoints = rewardPoints - reservedPoints;

  const projectStatusConfig = {
    in_progress: { label: "In Progress", color: "#2563eb", bg: "#dbeafe" },
    delivered: { label: "Delivered", color: "#7c3aed", bg: "#ede9fe" },
    revision_requested: { label: "Revision", color: "#f59e0b", bg: "#fef3c7" },
    completed: { label: "Completed", color: "#10b981", bg: "#d1fae5" },
    cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
    cancel_pending: {
      label: "Cancel Pending",
      color: "#f97316",
      bg: "#fff7ed",
    },
  };

  if (loading) {
    return (
      <div className="dash-home-loading">
        <div className="dash-home-loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-home">
      {/* ── Welcome Section ── */}
      <section className="dash-welcome">
        <div className="dash-welcome-text">
          <h1>
            {getGreeting()}, <span>{getFirstName()}</span>
          </h1>
          <p>Here's what's happening across your Anwesha workspace today.</p>
        </div>
        <div className="dash-welcome-date">
          <IoCalendarOutline />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <section className="dash-stats-grid">
        <div className="dash-stat-card dash-stat-card--green">
          <div className="dash-stat-icon">
            <IoTrophyOutline />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{rewardPoints}</span>
            <span className="dash-stat-label">Reward Points</span>
            {reservedPoints > 0 && (
              <span className="dash-stat-sub">
                <IoWalletOutline /> {availablePoints} available
              </span>
            )}
          </div>
        </div>

        <div className="dash-stat-card dash-stat-card--blue">
          <div className="dash-stat-icon">
            <IoRocketOutline />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{activeProjects.length}</span>
            <span className="dash-stat-label">Active Projects</span>
            <span className="dash-stat-sub">
              {completedProjects.length} completed
            </span>
          </div>
        </div>

        <div className="dash-stat-card dash-stat-card--purple">
          <div className="dash-stat-icon">
            <IoDocumentTextOutline />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{publishedSkills.length}</span>
            <span className="dash-stat-label">Skills Listed</span>
            <span className="dash-stat-sub">{skills.length} total</span>
          </div>
        </div>

        <div className="dash-stat-card dash-stat-card--amber">
          <div className="dash-stat-icon">
            <IoHandLeftOutline />
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{openRequests.length}</span>
            <span className="dash-stat-label">Open Requests</span>
            <span className="dash-stat-sub">{requests.length} total</span>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section className="dash-quick-actions">
        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-actions-row">
          <Link
            to="/post-skill"
            className="dash-action-btn dash-action-btn--primary"
          >
            <IoAddCircleOutline />
            <span>Post a Skill</span>
          </Link>
          <Link
            to="/post-request"
            className="dash-action-btn dash-action-btn--secondary"
          >
            <IoSendOutline />
            <span>Post a Request</span>
          </Link>
          <Link
            to="/skill-marketplace"
            className="dash-action-btn dash-action-btn--tertiary"
          >
            <IoStorefrontOutline />
            <span>Explore Skills</span>
          </Link>
          <Link
            to="/find-requests"
            className="dash-action-btn dash-action-btn--quaternary"
          >
            <IoSearchOutline />
            <span>Find Requests</span>
          </Link>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="dash-content-grid">
        {/* Active Projects */}
        <section className="dash-card dash-card--projects">
          <div className="dash-card-header">
            <h2>
              <IoRocketOutline /> Active Projects
            </h2>
            <Link to="/dashboard/my-projects" className="dash-card-link">
              View All <IoChevronForward />
            </Link>
          </div>
          <div className="dash-card-body">
            {activeProjects.length === 0 ? (
              <div className="dash-empty">
                <IoRocketOutline className="dash-empty-icon" />
                <p>No active projects right now</p>
                <Link to="/find-requests" className="dash-empty-link">
                  Find work to get started
                </Link>
              </div>
            ) : (
              <div className="dash-project-list">
                {activeProjects.slice(0, 4).map((project) => {
                  const statusCfg = projectStatusConfig[project.status] || {
                    label: project.status,
                    color: "#6b7280",
                    bg: "#f1f5f9",
                  };
                  const isOwner = project.owner?.email === user.email;
                  return (
                    <div key={project._id} className="dash-project-item">
                      <div className="dash-project-top">
                        <h4 className="dash-project-title">{project.title}</h4>
                        <span
                          className="dash-project-status"
                          style={{
                            color: statusCfg.color,
                            background: statusCfg.bg,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </div>
                      <div className="dash-project-meta">
                        <span className="dash-project-role">
                          {isOwner ? "Owner" : "Helper"}
                        </span>
                        <span className="dash-project-separator">
                          <IoEllipseSharp />
                        </span>
                        <span className="dash-project-members">
                          <IoPeopleOutline /> {project.members?.length || 0}
                        </span>
                        {project.rewardPoints > 0 && (
                          <>
                            <span className="dash-project-separator">
                              <IoEllipseSharp />
                            </span>
                            <span className="dash-project-reward">
                              <IoTrophyOutline /> {project.rewardPoints} pts
                            </span>
                          </>
                        )}
                        <span className="dash-project-separator">
                          <IoEllipseSharp />
                        </span>
                        <span className="dash-project-time">
                          {formatTimeAgo(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Pending Offers */}
        <section className="dash-card dash-card--offers">
          <div className="dash-card-header">
            <h2>
              <IoSendOutline /> My Offers
            </h2>
            <Link to="/dashboard/my-offers" className="dash-card-link">
              View All <IoChevronForward />
            </Link>
          </div>
          <div className="dash-card-body">
            {pendingOffers.length === 0 ? (
              <div className="dash-empty">
                <IoSendOutline className="dash-empty-icon" />
                <p>No pending offers</p>
                <Link to="/find-requests" className="dash-empty-link">
                  Apply to requests
                </Link>
              </div>
            ) : (
              <div className="dash-offer-list">
                {pendingOffers.slice(0, 4).map((offer) => (
                  <div key={offer._id} className="dash-offer-item">
                    <div className="dash-offer-top">
                      <h4 className="dash-offer-title">
                        {offer.post?.title || "Untitled Request"}
                      </h4>
                      <span className="dash-offer-badge dash-offer-badge--pending">
                        Pending
                      </span>
                    </div>
                    <div className="dash-offer-meta">
                      <span className="dash-offer-reward">
                        <IoTrophyOutline /> {offer.expectedReward} pts
                      </span>
                      <span className="dash-offer-time">
                        <IoTimeOutline /> {formatTimeAgo(offer.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* My Skills Summary */}
        <section className="dash-card dash-card--skills">
          <div className="dash-card-header">
            <h2>
              <IoDocumentTextOutline /> My Skills
            </h2>
            <Link to="/dashboard/my-skills" className="dash-card-link">
              View All <IoChevronForward />
            </Link>
          </div>
          <div className="dash-card-body">
            {publishedSkills.length === 0 ? (
              <div className="dash-empty">
                <IoDocumentTextOutline className="dash-empty-icon" />
                <p>You haven't listed any skills yet</p>
                <Link to="/post-skill" className="dash-empty-link">
                  Post your first skill
                </Link>
              </div>
            ) : (
              <div className="dash-skill-list">
                {publishedSkills.slice(0, 3).map((skill) => (
                  <Link
                    to={`/skill/${skill._id}`}
                    key={skill._id}
                    className="dash-skill-item"
                  >
                    <div className="dash-skill-info">
                      <h4>{skill.title}</h4>
                      <span className="dash-skill-category">
                        {skill.category}
                      </span>
                    </div>
                    <IoChevronForward className="dash-skill-arrow" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Activity / Stats Summary */}
        <section className="dash-card dash-card--activity">
          <div className="dash-card-header">
            <h2>
              <IoTrendingUpOutline /> Activity Summary
            </h2>
          </div>
          <div className="dash-card-body">
            {stats ? (
              <div className="dash-activity-stats">
                <div className="dash-activity-row">
                  <div className="dash-activity-item">
                    <span className="dash-activity-num">
                      {stats.tasksCompleted}
                    </span>
                    <span className="dash-activity-desc">Tasks Completed</span>
                  </div>
                  <div className="dash-activity-item">
                    <span className="dash-activity-num">{stats.helpGiven}</span>
                    <span className="dash-activity-desc">Help Given</span>
                  </div>
                  <div className="dash-activity-item">
                    <span className="dash-activity-num">
                      {stats.helpReceived}
                    </span>
                    <span className="dash-activity-desc">Help Received</span>
                  </div>
                  <div className="dash-activity-item">
                    <span className="dash-activity-num">
                      {stats.activeContracts}
                    </span>
                    <span className="dash-activity-desc">Active Contracts</span>
                  </div>
                </div>

                {stats.recentActivity?.length > 0 && (
                  <div className="dash-recent-activity">
                    <h3>Recent Activity</h3>
                    <ul>
                      {stats.recentActivity.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="dash-recent-item">
                          <span
                            className={`dash-recent-dot ${item.type === "helped" ? "dash-recent-dot--green" : "dash-recent-dot--blue"}`}
                          />
                          <div className="dash-recent-info">
                            <span className="dash-recent-title">
                              {item.title}
                            </span>
                            <span className="dash-recent-meta">
                              <span className="dash-recent-reward">
                                {item.reward}
                              </span>
                              <span className="dash-recent-time">
                                {formatTimeAgo(item.time)}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="dash-empty">
                <IoTrendingUpOutline className="dash-empty-icon" />
                <p>No activity data yet</p>
                <span className="dash-empty-sub">
                  Start helping others to build your profile
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;
