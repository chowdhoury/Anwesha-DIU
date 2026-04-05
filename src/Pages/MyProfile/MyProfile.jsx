import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import {
  IoCamera,
  IoCreateOutline,
  IoMailOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoStarSharp,
  IoTrophyOutline,
  IoFlashOutline,
  IoCheckmarkCircle,
  IoRocketOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoCodeSlashOutline,
  IoColorPaletteOutline,
  IoCloseOutline,
  IoImageOutline,
  IoPersonOutline,
  IoAddOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
} from "react-icons/io5";
import { FaGithub, FaLinkedinIn, FaTwitter, FaHandshake } from "react-icons/fa";
import toast from "react-hot-toast";
import "./MyProfile.css";

const MyProfile = () => {
  const { user, updateUserProfile, setUser, dbUser, fetchDbUser } =
    useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    photoURL: "",
    bio: "",
    location: "",
    website: "",
    skills: [],
    github: "",
    linkedin: "",
    twitter: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch user stats from backend
  useEffect(() => {
    if (user?.email) {
      setStatsLoading(true);
      fetch(`http://localhost:3000/users/${user.email}/stats`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to fetch stats:", err))
        .finally(() => setStatsLoading(false));
    }
  }, [user?.email]);

  // Sync form with user data when modal opens
  useEffect(() => {
    if (editModalOpen && user) {
      setEditForm({
        displayName: user.displayName || dbUser?.name || "",
        photoURL: user.photoURL || dbUser?.profilePicture || "",
        bio: dbUser?.bio || "",
        location: dbUser?.location || "",
        website: dbUser?.website || "",
        skills: dbUser?.skills ? [...dbUser.skills] : [],
        github: dbUser?.github || "",
        linkedin: dbUser?.linkedin || "",
        twitter: dbUser?.twitter || "",
      });
      setSkillInput("");
    }
  }, [editModalOpen, user, dbUser]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = editModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editModalOpen]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !editForm.skills.includes(skill)) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skill] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editForm.displayName.trim()) {
      toast.error("Display name is required");
      return;
    }
    setSaving(true);
    try {
      // Update Firebase auth profile
      await updateUserProfile(
        editForm.displayName.trim(),
        editForm.photoURL.trim() || null,
      );
      setUser({
        ...user,
        displayName: editForm.displayName.trim(),
        photoURL: editForm.photoURL.trim() || null,
      });

      // Persist extended profile fields to backend DB
      const res = await fetch(`http://localhost:3000/users/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.displayName.trim(),
          profilePicture: editForm.photoURL.trim() || "",
          bio: editForm.bio.trim(),
          location: editForm.location.trim(),
          website: editForm.website.trim(),
          skills: editForm.skills,
          github: editForm.github.trim(),
          linkedin: editForm.linkedin.trim(),
          twitter: editForm.twitter.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile to database");

      // Refresh dbUser so the UI updates immediately
      await fetchDbUser(user.email);

      toast.success("Profile updated successfully!");
      setEditModalOpen(false);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
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

  // Helper to format ISO timestamps as relative time
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Derive member-since from user creation date
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const userSkills = dbUser?.skills || [];
  const rewardPoints = dbUser?.rewardPoints ?? 0;
  const recentActivity = stats?.recentActivity || [];

  // Compute badges dynamically based on real data
  const badges = [
    ...(memberSince
      ? [
          {
            icon: <IoRocketOutline />,
            label: "Early Adopter",
            color: "#6366f1",
          },
        ]
      : []),
    ...(stats?.helpGiven >= 5
      ? [
          {
            icon: <IoFlashOutline />,
            label: "Quick Responder",
            color: "#f59e0b",
          },
        ]
      : []),
    ...(user?.emailVerified
      ? [{ icon: <IoCheckmarkCircle />, label: "Verified", color: "#14a800" }]
      : []),
    ...(stats?.helpGiven >= 3
      ? [{ icon: <FaHandshake />, label: "Team Player", color: "#ec4899" }]
      : []),
  ];

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "activity", label: "Activity" },
    { key: "skills", label: "Skills" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div className="profile-page">
      {/* ══════ COVER & AVATAR ══════ */}
      <div className="profile-cover">
        <div className="profile-cover-gradient" />
        <div className="profile-cover-pattern" />
      </div>

      <div className="profile-container">
        {/* ══════ PROFILE HEADER ══════ */}
        <div className="profile-header">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName}
                  className="profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar-fallback">
                  {getInitials(user?.displayName)}
                </div>
              )}
              <button
                className="profile-avatar-edit"
                aria-label="Change photo"
                onClick={() => setEditModalOpen(true)}
              >
                <IoCamera />
              </button>
              <span className="profile-online-dot" />
            </div>

            <div className="profile-info">
              <div className="profile-name-row">
                <h1>{user?.displayName || "User"}</h1>
                <span className="profile-verified-badge">
                  <IoCheckmarkCircle /> Verified
                </span>
              </div>
              <p className="profile-email">{user?.email}</p>
              {dbUser?.bio && <p className="profile-bio">{dbUser.bio}</p>}
              <div className="profile-meta">
                {dbUser?.location && (
                  <span className="profile-meta-item">
                    <IoLocationOutline /> {dbUser.location}
                  </span>
                )}
                {memberSince && (
                  <span className="profile-meta-item">
                    <IoCalendarOutline /> Joined {memberSince}
                  </span>
                )}
                {dbUser?.website && (
                  <a
                    href={dbUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-meta-item profile-meta-link"
                  >
                    <IoGlobeOutline /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="profile-header-right">
            <Link to="/" className="profile-btn profile-btn--outline">
              <IoSettingsOutline /> Settings
            </Link>
            <button
              className="profile-btn profile-btn--primary"
              onClick={() => setEditModalOpen(true)}
            >
              <IoCreateOutline /> Edit Profile
            </button>
          </div>
        </div>

        {/* ══════ STATS CARDS ══════ */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card profile-stat-card--accent">
            <div className="profile-stat-icon">
              <IoTrophyOutline />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">
                {rewardPoints.toLocaleString()}
              </span>
              <span className="profile-stat-label">Reward Points</span>
            </div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <IoCheckmarkCircle />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">
                {statsLoading ? "—" : (stats?.tasksCompleted ?? 0)}
              </span>
              <span className="profile-stat-label">Tasks Completed</span>
            </div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <IoPeopleOutline />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">
                {statsLoading ? "—" : (stats?.helpGiven ?? 0)}
              </span>
              <span className="profile-stat-label">People Helped</span>
            </div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <IoStarSharp />
            </div>
            <div className="profile-stat-content">
              <span className="profile-stat-value">
                {statsLoading ? "—" : (stats?.totalContracts ?? 0)}
              </span>
              <span className="profile-stat-label">Total Contracts</span>
            </div>
          </div>
        </div>

        {/* ══════ TABS ══════ */}
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`profile-tab ${activeTab === tab.key ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════ TAB CONTENT ══════ */}
        <div className="profile-content">
          {/* LEFT COLUMN */}
          <div className="profile-main">
            {activeTab === "overview" && (
              <>
                {/* Recent Activity */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h3>Recent Activity</h3>
                    <button
                      className="profile-card-link"
                      onClick={() => setActiveTab("activity")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="activity-list">
                    {recentActivity.length === 0 && (
                      <p className="no-content-text">
                        No activity yet. Start helping others to build your
                        history!
                      </p>
                    )}
                    {recentActivity.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="activity-item">
                        <div
                          className={`activity-icon activity-icon--${item.type}`}
                        >
                          {item.type === "helped" ? (
                            <IoCodeSlashOutline />
                          ) : (
                            <IoColorPaletteOutline />
                          )}
                        </div>
                        <div className="activity-info">
                          <span className="activity-title">{item.title}</span>
                          <span className="activity-time">
                            {timeAgo(item.time)}
                          </span>
                        </div>
                        <span
                          className={`activity-reward activity-reward--${item.type}`}
                        >
                          {item.reward}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats summary */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h3>Summary</h3>
                  </div>
                  <div className="reviews-preview">
                    <div className="review-summary">
                      <span className="review-big-rating">
                        {statsLoading ? "\u2014" : (stats?.totalContracts ?? 0)}
                      </span>
                      <div className="review-stars">
                        <span className="review-count">
                          Total Contracts &middot; {stats?.helpGiven ?? 0}{" "}
                          helped &middot; {stats?.helpReceived ?? 0} received
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "activity" && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>All Activity</h3>
                </div>
                <div className="activity-list">
                  {recentActivity.length === 0 && (
                    <p className="no-content-text">No activity yet.</p>
                  )}
                  {recentActivity.map((item, idx) => (
                    <div key={idx} className="activity-item">
                      <div
                        className={`activity-icon activity-icon--${item.type}`}
                      >
                        {item.type === "helped" ? (
                          <IoCodeSlashOutline />
                        ) : (
                          <IoColorPaletteOutline />
                        )}
                      </div>
                      <div className="activity-info">
                        <span className="activity-title">{item.title}</span>
                        <span className="activity-time">
                          {timeAgo(item.time)}
                        </span>
                      </div>
                      <span
                        className={`activity-reward activity-reward--${item.type}`}
                      >
                        {item.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>Skills & Expertise</h3>
                </div>
                <div className="skills-list">
                  {userSkills.length === 0 && (
                    <p className="no-content-text">
                      No skills added yet. Edit your profile to add skills.
                    </p>
                  )}
                  {userSkills.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>All Reviews</h3>
                </div>
                <div className="reviews-preview">
                  <p className="no-content-text">
                    Detailed reviews will appear here as you help more people.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="profile-sidebar">
            {/* Skills */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Skills</h3>
              </div>
              <div className="skills-list">
                {userSkills.length === 0 && (
                  <p className="no-content-text">No skills yet</p>
                )}
                {userSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Badges</h3>
              </div>
              <div className="badges-grid">
                {badges.length === 0 && (
                  <p className="no-content-text">
                    Keep helping to earn badges!
                  </p>
                )}
                {badges.map((badge, idx) => (
                  <div className="badge-item" key={idx}>
                    <span
                      className="badge-icon-box"
                      style={{
                        background: `${badge.color}15`,
                        color: badge.color,
                      }}
                    >
                      {badge.icon}
                    </span>
                    <span className="badge-label">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="profile-card">
              <div className="profile-card-header">
                <h3>Connect</h3>
              </div>
              <div className="social-links-list">
                {dbUser?.github && (
                  <a
                    href={dbUser.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {dbUser?.linkedin && (
                  <a
                    href={dbUser.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                  >
                    <FaLinkedinIn /> LinkedIn
                  </a>
                )}
                {dbUser?.twitter && (
                  <a
                    href={dbUser.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                  >
                    <FaTwitter /> Twitter
                  </a>
                )}
                <a
                  href={`mailto:${user?.email}`}
                  className="social-link-item social-link-item--email"
                >
                  <IoMailOutline /> {user?.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ EDIT PROFILE MODAL ══════ */}
      {editModalOpen && (
        <div
          className="edit-modal-overlay"
          onClick={() => setEditModalOpen(false)}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Profile</h2>
              <button
                className="edit-modal-close"
                onClick={() => setEditModalOpen(false)}
                aria-label="Close modal"
              >
                <IoCloseOutline />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="edit-modal-form">
              {/* Avatar Preview */}
              <div className="edit-avatar-section">
                {editForm.photoURL ? (
                  <img
                    src={editForm.photoURL}
                    alt="Preview"
                    className="edit-avatar-preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="edit-avatar-preview edit-avatar-placeholder">
                    {getInitials(editForm.displayName)}
                  </div>
                )}
              </div>

              <div className="edit-form-group">
                <label htmlFor="editName">
                  <IoPersonOutline /> Display Name
                </label>
                <input
                  type="text"
                  id="editName"
                  name="displayName"
                  value={editForm.displayName}
                  onChange={handleEditChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="editPhoto">
                  <IoImageOutline /> Photo URL
                </label>
                <input
                  type="url"
                  id="editPhoto"
                  name="photoURL"
                  value={editForm.photoURL}
                  onChange={handleEditChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="edit-form-group">
                <label htmlFor="editBio">
                  <IoCreateOutline /> Bio
                </label>
                <textarea
                  id="editBio"
                  name="bio"
                  value={editForm.bio}
                  onChange={handleEditChange}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="editLocation">
                    <IoLocationOutline /> Location
                  </label>
                  <input
                    type="text"
                    id="editLocation"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    placeholder="City, Country"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="editWebsite">
                    <IoGlobeOutline /> Website
                  </label>
                  <input
                    type="url"
                    id="editWebsite"
                    name="website"
                    value={editForm.website}
                    onChange={handleEditChange}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="edit-form-group">
                <label>
                  <IoFlashOutline /> Skills
                </label>
                <div className="edit-skills-input-row">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    className="edit-skill-add-btn"
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim()}
                  >
                    <IoAddOutline />
                  </button>
                </div>
                {editForm.skills.length > 0 && (
                  <div className="edit-skills-tags">
                    {editForm.skills.map((skill) => (
                      <span key={skill} className="edit-skill-tag">
                        {skill}
                        <button
                          type="button"
                          className="edit-skill-remove"
                          onClick={() => handleRemoveSkill(skill)}
                          aria-label={`Remove ${skill}`}
                        >
                          <IoCloseOutline />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="edit-form-group">
                <label>
                  <IoGlobeOutline /> Social Links
                </label>
              </div>
              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label htmlFor="editGithub" className="edit-label-small">
                    <IoLogoGithub /> GitHub
                  </label>
                  <input
                    type="url"
                    id="editGithub"
                    name="github"
                    value={editForm.github}
                    onChange={handleEditChange}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="edit-form-group">
                  <label htmlFor="editLinkedin" className="edit-label-small">
                    <IoLogoLinkedin /> LinkedIn
                  </label>
                  <input
                    type="url"
                    id="editLinkedin"
                    name="linkedin"
                    value={editForm.linkedin}
                    onChange={handleEditChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
              <div className="edit-form-group">
                <label htmlFor="editTwitter" className="edit-label-small">
                  <IoLogoTwitter /> Twitter
                </label>
                <input
                  type="url"
                  id="editTwitter"
                  name="twitter"
                  value={editForm.twitter}
                  onChange={handleEditChange}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="edit-modal-actions">
                <button
                  type="button"
                  className="profile-btn profile-btn--outline"
                  onClick={() => setEditModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-btn profile-btn--primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
