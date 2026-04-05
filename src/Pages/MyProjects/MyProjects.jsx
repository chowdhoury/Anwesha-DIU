import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import { messagesApi } from "../../utils/messagesApi";
import toast from "react-hot-toast";
import {
  IoRocketOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoChevronForward,
  IoRefreshOutline,
  IoPersonOutline,
  IoTrophyOutline,
  IoChatbubbleOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import ProjectChat from "./ProjectChat";
import "./MyProjects.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusConfig = {
  in_progress: {
    label: "In Progress",
    color: "#f59e0b",
    icon: <IoRocketOutline />,
  },
  delivered: {
    label: "Delivered",
    color: "#8b5cf6",
    icon: <IoCheckmarkCircleOutline />,
  },
  revision_requested: {
    label: "Revision",
    color: "#ef4444",
    icon: <IoRefreshOutline />,
  },
  completed: {
    label: "Completed",
    color: "#10b981",
    icon: <IoTrophyOutline />,
  },
  disputed: {
    label: "Disputed",
    color: "#ef4444",
    icon: <IoAlertCircleOutline />,
  },
  cancel_pending: {
    label: "Cancel Pending",
    color: "#f97316",
    icon: <IoTimeOutline />,
  },
  cancelled: {
    label: "Cancelled",
    color: "#6b7280",
    icon: <IoAlertCircleOutline />,
  },
};

const MyProjects = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [chatProject, setChatProject] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/projects?email=${encodeURIComponent(user?.email)}`,
      );
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getMyRole = (project) => {
    const member = project.members?.find((m) => m.email === user?.email);
    return member?.role || "member";
  };

  const getOtherMembers = (project) => {
    return (project.members || []).filter((m) => m.email !== user?.email);
  };

  const handleOpenChat = (e, project) => {
    e.stopPropagation();
    setChatProject(project);
  };

  const handleProjectUpdate = (projectId, newStatus, extraFields = {}) => {
    setProjects((prev) =>
      prev.map((p) =>
        p._id === projectId ? { ...p, status: newStatus, ...extraFields } : p,
      ),
    );
    // Also update chatProject if it's the one open
    setChatProject((prev) =>
      prev && prev._id === projectId
        ? { ...prev, status: newStatus, ...extraFields }
        : prev,
    );
  };

  const handleMessageMember = async (e, member) => {
    e.stopPropagation();
    if (!user || !member?.uid) {
      toast.error("Cannot start conversation");
      return;
    }
    try {
      const { conversationId } = await messagesApi.findOrCreateConversation({
        myUid: user.uid,
        myName: user.displayName,
        myPhoto: user.photoURL,
        myEmail: user.email,
        otherUid: member.uid,
        otherName: member.displayName,
        otherPhoto: member.photoURL,
        otherEmail: member.email,
      });
      navigate(`/dashboard/messages?c=${encodeURIComponent(conversationId)}`);
    } catch {
      toast.error("Failed to open conversation");
    }
  };

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.status === filter);

  const stats = {
    active: projects.filter((p) =>
      [
        "in_progress",
        "delivered",
        "revision_requested",
        "cancel_pending",
      ].includes(p.status),
    ).length,
    completed: projects.filter((p) => p.status === "completed").length,
    total: projects.length,
  };

  if (loading) {
    return (
      <div className="myprojects-loading">
        <div className="myprojects-spinner" />
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="myprojects">
      <div className="myprojects-header">
        <div>
          <h1 className="myprojects-title">My Projects</h1>
          <p className="myprojects-subtitle">
            Track your active and completed projects
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="myprojects-stats">
        <div className="myprojects-stat">
          <div className="stat-icon stat-icon--active">
            <IoRocketOutline />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
        <div className="myprojects-stat">
          <div className="stat-icon stat-icon--completed">
            <IoCheckmarkCircleOutline />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="myprojects-stat">
          <div className="stat-icon stat-icon--total">
            <IoTrophyOutline />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="myprojects-filters">
        {[
          { key: "all", label: "All" },
          { key: "in_progress", label: "In Progress" },
          { key: "delivered", label: "Delivered" },
          { key: "revision_requested", label: "Revision" },
          { key: "completed", label: "Completed" },
          { key: "cancel_pending", label: "Cancel Pending" },
          { key: "cancelled", label: "Cancelled" },
        ].map((f) => (
          <button
            key={f.key}
            className={`filter-btn ${filter === f.key ? "filter-btn--active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {filtered.length === 0 ? (
        <div className="myprojects-empty">
          <IoRocketOutline className="empty-icon" />
          <h3>No projects found</h3>
          <p>
            {filter === "all"
              ? "You don't have any projects yet. Help someone or post a request!"
              : `No ${filter.replace("_", " ")} projects.`}
          </p>
          <div className="empty-actions">
            <Link to="/find-requests" className="empty-btn empty-btn--primary">
              Find Requests
            </Link>
            <Link to="/post-request" className="empty-btn empty-btn--secondary">
              Post a Request
            </Link>
          </div>
        </div>
      ) : (
        <div className="myprojects-list">
          {filtered.map((project) => {
            const config =
              statusConfig[project.status] || statusConfig.in_progress;
            const myRole = getMyRole(project);
            const otherMembers = getOtherMembers(project);
            const isOwner = myRole === "owner";

            return (
              <div key={project._id} className="project-card">
                <div className="project-card-header">
                  <div className="project-card-role">
                    <span
                      className={`role-badge role-badge--${isOwner ? "requester" : "helper"}`}
                    >
                      <IoPersonOutline />
                      {isOwner ? "Owner" : "Helper"}
                    </span>
                  </div>
                  <span
                    className="project-status-badge"
                    style={{
                      color: config.color,
                      background: `${config.color}18`,
                    }}
                  >
                    {config.icon}
                    {config.label}
                  </span>
                </div>

                <h3 className="project-card-title">
                  {project.title || "Untitled Project"}
                </h3>

                {project.description && (
                  <p className="project-card-desc">{project.description}</p>
                )}

                <div className="project-card-meta">
                  {project.rewardPoints > 0 && (
                    <div className="meta-item">
                      <IoTrophyOutline />
                      <span>{project.rewardPoints} pts</span>
                    </div>
                  )}
                  {project.category && (
                    <div className="meta-item">
                      <span className="meta-chip">{project.category}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <IoTimeOutline />
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {project.deadline && (
                    <div className="meta-item">
                      <IoTimeOutline />
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  )}
                </div>

                {project.tags?.length > 0 && (
                  <div className="project-tags">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="project-tag project-tag--more">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Members */}
                <div className="project-members">
                  <span className="project-members-label">
                    <IoPeopleOutline /> Team
                  </span>
                  <div className="project-members-list">
                    {(project.members || []).map((member, idx) => (
                      <div key={idx} className="project-member">
                        {member.photoURL ? (
                          <img
                            src={member.photoURL}
                            alt={member.displayName}
                            referrerPolicy="no-referrer"
                            className="project-member-avatar"
                          />
                        ) : (
                          <div className="project-member-avatar project-member-avatar--placeholder">
                            {(member.displayName || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <span className="project-member-name">
                          {member.email === user?.email
                            ? "You"
                            : member.displayName || "User"}
                        </span>
                        <span
                          className={`project-member-role project-member-role--${member.role}`}
                        >
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="project-progress">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.progress || 0}%`,
                        background:
                          project.progress >= 100
                            ? "linear-gradient(90deg, #10b981, #059669)"
                            : "linear-gradient(90deg, #6366f1, #8b5cf6)",
                      }}
                    />
                  </div>
                </div>

                <div className="project-card-footer">
                  <button
                    className="project-chat-btn"
                    onClick={(e) => handleOpenChat(e, project)}
                    title="Open project chat"
                  >
                    <IoChatbubbleOutline /> Project Chat
                  </button>
                  {otherMembers.map((member, idx) => (
                    <button
                      key={idx}
                      className="project-message-btn"
                      onClick={(e) => handleMessageMember(e, member)}
                      title={`Message ${member.displayName}`}
                    >
                      <IoChatbubbleOutline /> DM {member.displayName || "User"}
                    </button>
                  ))}
                  <span className="project-view-link">
                    <IoChevronForward />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Project Chat Modal */}
      {chatProject && (
        <ProjectChat
          project={chatProject}
          onClose={() => setChatProject(null)}
          onProjectUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
};

export default MyProjects;
