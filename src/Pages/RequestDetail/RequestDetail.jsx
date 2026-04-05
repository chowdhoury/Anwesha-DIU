import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoLocationOutline,
  IoTimeOutline,
  IoFlashOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoEyeOutline,
  IoPeopleOutline,
  IoCheckmarkCircle,
  IoHeartOutline,
  IoShareSocialOutline,
  IoWarningOutline,
  IoChatbubbleOutline,
  IoSendOutline,
  IoStarOutline,
  IoCloseOutline,
  IoChevronDown,
} from "react-icons/io5";
import { AuthContext } from "../../Authentication/AuthContext";
import { messagesApi } from "../../utils/messagesApi";
import toast from "react-hot-toast";
import "./RequestDetail.css";

/* ─── Helper Functions ─────────────────────────────── */
const getTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#14b8a6",
  ];
  if (!name) return colors[0];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getUrgencyConfig = (urgency) => {
  const configs = {
    HIGH: {
      label: "Urgent",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    MEDIUM: {
      label: "Medium Priority",
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    LOW: {
      label: "Flexible",
      color: "#22c55e",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
  };
  return configs[urgency] || configs.MEDIUM;
};

/* ─── Component ─────────────────────────────────────── */
const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [applyForm, setApplyForm] = useState({
    proposedDeadline: "",
    expectedReward: "",
    skills: [],
    coverMessage: "",
  });
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const DEADLINE_OPTIONS = [
    "24 hours",
    "2 days",
    "3 days",
    "5 days",
    "1 week",
    "2 weeks",
    "1 month",
    "Flexible",
  ];

  const SKILL_OPTIONS = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "C++",
    "PHP",
    "Vue.js",
    "Angular",
    "Next.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "PostgreSQL",
    "MySQL",
    "GraphQL",
    "REST API",
    "Docker",
    "AWS",
    "Firebase",
    "Flutter",
    "React Native",
    "Figma",
    "Adobe Photoshop",
    "UI Design",
    "UX Design",
    "Logo",
    "Graphic Design",
    "Web Design",
    "Video Editing",
    "3D Modeling",
    "SEO",
    "Content Writing",
    "Copywriting",
    "Translation",
    "Technical Writing",
    "Social Media Marketing",
    "Google Ads",
    "Email Marketing",
    "Excel",
    "Financial Modeling",
    "Data Entry",
    "Virtual Assistant",
    "AutoCAD",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Project Management",
    "Business Analysis",
    "Consulting",
  ];

  const filteredSkills = SKILL_OPTIONS.filter(
    (s) =>
      s.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !applyForm.skills.includes(s),
  );

  const handleMessageAuthor = async () => {
    if (!user) {
      toast.error("Please sign in to send a message");
      return navigate("/signin");
    }
    if (!request?.author?.uid) {
      return toast.error("Cannot message this user");
    }
    if (request.author.uid === user.uid) {
      return toast.error("This is your own request");
    }

    setMessagingLoading(true);
    try {
      const { conversationId } = await messagesApi.findOrCreateConversation({
        myUid: user.uid,
        myName: user.displayName,
        myPhoto: user.photoURL,
        myEmail: user.email,
        otherUid: request.author.uid,
        otherName: request.author.displayName,
        otherPhoto: request.author.photoURL,
        otherEmail: request.author.email,
      });
      navigate(`/dashboard/messages?c=${encodeURIComponent(conversationId)}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversation");
    } finally {
      setMessagingLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://anwesha-backend.vercel.app/posts/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Request not found");
        return response.json();
      })
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const openApplyModal = () => {
    if (!user) {
      toast.error("Please sign in to apply");
      return navigate("/signin");
    }
    if (isOwner) {
      return toast.error("You cannot apply to your own request");
    }
    console.log(
      "DEBUG deadline:",
      JSON.stringify(request.deadline),
      "| match:",
      DEADLINE_OPTIONS.includes(request.deadline),
    );
    setApplyForm({
      proposedDeadline: request.deadline || "",
      expectedReward: request.rewardPoints || "",
      skills: [],
      coverMessage: "",
    });
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setApplyForm({
      proposedDeadline: "",
      expectedReward: "",
      skills: [],
      coverMessage: "",
    });
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const handleApplyFormChange = (field, value) => {
    setApplyForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill) => {
    if (applyForm.skills.length >= 5) return;
    setApplyForm((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setSkillSearch("");
    setShowSkillDropdown(false);
  };

  const removeSkill = (skill) => {
    setApplyForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (
      !applyForm.proposedDeadline ||
      !applyForm.expectedReward ||
      !applyForm.skills.length
    ) {
      return toast.error("Please fill in all required fields");
    }
    setApplyLoading(true);
    try {
      const res = await fetch(
        "https://anwesha-backend.vercel.app/applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId: id,
            proposedDeadline: applyForm.proposedDeadline,
            expectedReward: applyForm.expectedReward,
            skills: applyForm.skills,
            coverMessage: applyForm.coverMessage,
            applicant: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            },
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to submit application");
      toast.success("Application submitted successfully!");
      closeApplyModal();
      setRequest((prev) => ({
        ...prev,
        applicantsCount: (prev.applicantsCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rd-page">
        <div className="rd-container rd-loading">
          <div className="rd-spinner"></div>
          <p>Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="rd-page">
        <div className="rd-container rd-error">
          <IoWarningOutline className="rd-error-icon" />
          <h2>Request Not Found</h2>
          <p>
            {error ||
              "The request you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/find-requests")}
            className="rd-cta-btn"
          >
            <IoArrowBack /> Back to Requests
          </button>
        </div>
      </div>
    );
  }

  const urgency = getUrgencyConfig(request.urgency);
  const authorName = request.author?.displayName || "Anonymous";
  const authorInitials = getInitials(authorName);
  const authorColor = getAvatarColor(authorName);
  const isOwner = user?.uid === request.author?.uid;

  return (
    <div className="rd-page">
      <div className="rd-container">
        {/* ── Breadcrumb ── */}
        <div className="rd-breadcrumb">
          <button className="rd-back-btn" onClick={() => navigate(-1)}>
            <IoArrowBack /> Back
          </button>
          <nav className="rd-nav-crumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/find-requests">Find Requests</Link>
            <span>/</span>
            <span>{request.category}</span>
          </nav>
        </div>

        <div className="rd-body">
          {/* ══════ LEFT: Main Content ══════ */}
          <div className="rd-main">
            {/* Status Banner */}
            <div className="rd-status-banner">
              <span
                className="rd-urgency-badge"
                style={{
                  color: urgency.color,
                  background: urgency.bg,
                  borderColor: urgency.border,
                }}
              >
                {urgency.label}
              </span>
              <span
                className={`rd-status-pill rd-status--${request.status?.toLowerCase() || "open"}`}
              >
                {request.status || "OPEN"}
              </span>
            </div>

            {/* Title */}
            <h1 className="rd-title">{request.title}</h1>

            {/* Meta Info */}
            <div className="rd-meta-strip">
              <span className="rd-meta-item">
                <IoCalendarOutline /> Posted {getTimeAgo(request.createdAt)}
              </span>
              <span className="rd-meta-item">
                <IoLocationOutline /> {request.location || "Remote"}
              </span>
              <span className="rd-meta-item">
                <IoEyeOutline /> {request.viewsCount || 0} views
              </span>
              <span className="rd-meta-item">
                <IoPeopleOutline /> {request.applicantsCount || 0} applicants
              </span>
            </div>

            {/* Category & Tags */}
            <div className="rd-tags-section">
              <span className="rd-category-pill">{request.category}</span>
              {request.tags?.map((tag) => (
                <span key={tag} className="rd-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <section className="rd-section">
              <h2 className="rd-section-title">Description</h2>
              <div className="rd-description">{request.description}</div>
            </section>

            {/* Requirements (if any) */}
            {request.requirements && request.requirements.length > 0 && (
              <section className="rd-section">
                <h2 className="rd-section-title">Requirements</h2>
                <ul className="rd-requirements-list">
                  {request.requirements.map((req, i) => (
                    <li key={i}>
                      <IoCheckmarkCircle className="rd-check-icon" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Timeline */}
            <section className="rd-section">
              <h2 className="rd-section-title">Timeline & Reward</h2>
              <div className="rd-info-cards">
                <div className="rd-info-card">
                  <IoTimeOutline className="rd-info-icon" />
                  <div className="rd-info-content">
                    <span className="rd-info-label">Deadline</span>
                    <span className="rd-info-value">{request.deadline}</span>
                  </div>
                </div>
                <div className="rd-info-card rd-info-card--highlight">
                  <IoFlashOutline className="rd-info-icon" />
                  <div className="rd-info-content">
                    <span className="rd-info-label">Reward Points</span>
                    <span className="rd-info-value">
                      {request.rewardPoints} pts
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Apply Button (Mobile) */}
            {!isOwner && (
              <div className="rd-apply-section-mobile">
                <button
                  className="rd-cta-btn rd-cta-btn--full"
                  onClick={openApplyModal}
                >
                  <IoFlashOutline /> Apply to Help
                </button>
              </div>
            )}
          </div>

          {/* ══════ RIGHT: Sidebar ══════ */}
          <aside className="rd-sidebar">
            {/* Author Card */}
            <div className="rd-author-card">
              <div className="rd-author-header">
                {request.author?.photoURL ? (
                  <img
                    src={request.author.photoURL}
                    alt={authorName}
                    className="rd-author-avatar"
                  />
                ) : (
                  <div
                    className="rd-author-avatar rd-author-initials"
                    style={{ background: authorColor }}
                  >
                    {authorInitials}
                  </div>
                )}
                <div className="rd-author-info">
                  <span className="rd-author-name">{authorName}</span>
                  <span className="rd-author-meta">
                    <IoStarOutline /> Member
                  </span>
                </div>
              </div>
              {!isOwner && (
                <div className="rd-author-actions">
                  <button
                    className="rd-message-btn"
                    onClick={handleMessageAuthor}
                    disabled={messagingLoading}
                  >
                    <IoChatbubbleOutline />{" "}
                    {messagingLoading ? "Opening..." : "Message"}
                  </button>
                </div>
              )}
            </div>

            {/* Reward Card */}
            <div className="rd-reward-card">
              <div className="rd-reward-header">
                <IoFlashOutline className="rd-reward-icon" />
                <span className="rd-reward-amount">{request.rewardPoints}</span>
                <span className="rd-reward-label">reward points</span>
              </div>
              <div className="rd-reward-details">
                <div className="rd-reward-row">
                  <IoTimeOutline />
                  <span>Deadline: {request.deadline}</span>
                </div>
                <div className="rd-reward-row">
                  <IoLocationOutline />
                  <span>{request.location || "Remote"}</span>
                </div>
              </div>

              {!isOwner && (
                <>
                  <button
                    className="rd-cta-btn rd-cta-btn--full"
                    onClick={openApplyModal}
                  >
                    <IoFlashOutline /> Apply to Help
                  </button>
                  <div className="rd-action-row">
                    <button
                      className={`rd-icon-btn ${saved ? "rd-icon-btn--active" : ""}`}
                      onClick={() => setSaved(!saved)}
                    >
                      <IoHeartOutline /> Save
                    </button>
                    <button className="rd-icon-btn">
                      <IoShareSocialOutline /> Share
                    </button>
                  </div>
                </>
              )}

              {isOwner && (
                <div className="rd-owner-notice">
                  <IoPersonOutline />
                  <span>This is your request</span>
                </div>
              )}
            </div>

            {/* Safety Tips */}
            <div className="rd-tips-card">
              <h4>Safety Tips</h4>
              <ul>
                <li>Communicate through the platform</li>
                <li>Never share personal financial info</li>
                <li>Report suspicious activity</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════ APPLY MODAL ══════ */}
      {showApplyModal && (
        <div className="rd-modal-overlay" onClick={closeApplyModal}>
          <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rd-modal-header">
              <div>
                <h2 className="rd-modal-title">Apply to Help</h2>
                <p className="rd-modal-subtitle">
                  Submit your proposal for &ldquo;{request.title}&rdquo;
                </p>
              </div>
              <button className="rd-modal-close" onClick={closeApplyModal}>
                <IoCloseOutline />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="rd-modal-body">
              {/* Proposed Deadline */}
              <div className="rd-modal-field">
                <label className="rd-modal-label">
                  <IoCalendarOutline />
                  Proposed Deadline <span className="rd-required">*</span>
                </label>
                <select
                  className="rd-modal-input"
                  value={applyForm.proposedDeadline}
                  onChange={(e) =>
                    handleApplyFormChange("proposedDeadline", e.target.value)
                  }
                  required
                >
                  <option value="">Select a deadline…</option>
                  {(request.deadline &&
                  !DEADLINE_OPTIONS.includes(request.deadline)
                    ? [request.deadline, ...DEADLINE_OPTIONS]
                    : DEADLINE_OPTIONS
                  ).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Reward */}
              <div className="rd-modal-field">
                <label className="rd-modal-label">
                  <IoFlashOutline />
                  Expected Reward (Points){" "}
                  <span className="rd-required">*</span>
                </label>
                <input
                  type="number"
                  className="rd-modal-input"
                  placeholder="e.g. 50"
                  value={applyForm.expectedReward}
                  onChange={(e) =>
                    handleApplyFormChange("expectedReward", e.target.value)
                  }
                  min={1}
                  required
                />
                {request.rewardPoints && (
                  <span className="rd-modal-hint">
                    Requester is offering {request.rewardPoints} pts
                  </span>
                )}
              </div>

              {/* Skills Dropdown */}
              <div className="rd-modal-field">
                <label className="rd-modal-label">
                  <IoStarOutline />
                  Your Relevant Skills <span className="rd-required">*</span>
                </label>
                {applyForm.skills.length > 0 && (
                  <div className="rd-modal-skill-tags">
                    {applyForm.skills.map((skill) => (
                      <span key={skill} className="rd-modal-skill-tag">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="rd-modal-skill-remove"
                        >
                          <IoCloseOutline />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="rd-modal-dropdown-wrap">
                  <input
                    type="text"
                    className="rd-modal-input"
                    placeholder={
                      applyForm.skills.length >= 5
                        ? "Maximum 5 skills selected"
                        : "Search and select skills..."
                    }
                    value={skillSearch}
                    onChange={(e) => {
                      setSkillSearch(e.target.value);
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSkillDropdown(false), 200)
                    }
                    disabled={applyForm.skills.length >= 5}
                  />
                  <IoChevronDown className="rd-modal-dropdown-icon" />
                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="rd-modal-dropdown">
                      {filteredSkills.slice(0, 8).map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          className="rd-modal-dropdown-item"
                          onMouseDown={() => addSkill(skill)}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Message */}
              <div className="rd-modal-field">
                <label className="rd-modal-label">
                  <IoChatbubbleOutline />
                  Cover Message
                </label>
                <textarea
                  className="rd-modal-textarea"
                  placeholder="Introduce yourself and explain why you're a great fit for this request..."
                  value={applyForm.coverMessage}
                  onChange={(e) =>
                    handleApplyFormChange("coverMessage", e.target.value)
                  }
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="rd-modal-actions">
                <button
                  type="button"
                  className="rd-modal-cancel"
                  onClick={closeApplyModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rd-cta-btn"
                  disabled={applyLoading}
                >
                  {applyLoading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <IoSendOutline /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
