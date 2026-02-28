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
  IoShieldCheckmarkOutline,
  IoCodeSlashOutline,
  IoColorPaletteOutline,
  IoBulbOutline,
  IoBookOutline,
  IoCloseOutline,
  IoImageOutline,
  IoPersonOutline,
  IoAddOutline,
  IoLogoGithub,
  IoLogoLinkedin,
  IoLogoTwitter,
} from "react-icons/io5";
import {
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaHandshake,
} from "react-icons/fa";
import toast from "react-hot-toast";
import "./MyProfile.css";

const MyProfile = () => {
  const { user, updateUserProfile, setUser } = useContext(AuthContext);
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

  // Sync form with user data when modal opens
  useEffect(() => {
    if (editModalOpen && user) {
      setEditForm({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        skills: [...profileData.skills],
        github: "",
        linkedin: "",
        twitter: "",
      });
      setSkillInput("");
    }
  }, [editModalOpen, user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = editModalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
      await updateUserProfile(editForm.displayName.trim(), editForm.photoURL.trim() || null);
      // Force user state refresh
      setUser({ ...user, displayName: editForm.displayName.trim(), photoURL: editForm.photoURL.trim() || null });
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

  // Placeholder data (would come from DB in production)
  const profileData = {
    bio: "Passionate developer who loves building things and helping others. Always curious, always learning.",
    location: "Dhaka, Bangladesh",
    website: "https://example.com",
    memberSince: "February 2026",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "UI/UX Design",
      "Firebase",
      "MongoDB",
      "Git",
    ],
    stats: {
      rewardPoints: 1250,
      tasksCompleted: 34,
      helpGiven: 28,
      helpReceived: 6,
      rating: 4.9,
      reviews: 22,
    },
    badges: [
      {
        icon: <IoRocketOutline />,
        label: "Early Adopter",
        color: "#6366f1",
      },
      {
        icon: <IoFlashOutline />,
        label: "Quick Responder",
        color: "#f59e0b",
      },
      {
        icon: <IoCheckmarkCircle />,
        label: "Verified",
        color: "#14a800",
      },
      {
        icon: <FaHandshake />,
        label: "Team Player",
        color: "#ec4899",
      },
    ],
    recentActivity: [
      {
        type: "helped",
        icon: <IoCodeSlashOutline />,
        title: "Helped debug a React application",
        reward: "+50 pts",
        time: "2 hours ago",
      },
      {
        type: "received",
        icon: <IoColorPaletteOutline />,
        title: "Got help with logo redesign",
        reward: "-30 pts",
        time: "1 day ago",
      },
      {
        type: "helped",
        icon: <IoBulbOutline />,
        title: "Mentored a junior developer",
        reward: "+75 pts",
        time: "3 days ago",
      },
      {
        type: "helped",
        icon: <IoBookOutline />,
        title: "Wrote a Python tutorial",
        reward: "+40 pts",
        time: "5 days ago",
      },
    ],
  };

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
              <button className="profile-avatar-edit" aria-label="Change photo" onClick={() => setEditModalOpen(true)}>
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
              <p className="profile-bio">{profileData.bio}</p>
              <div className="profile-meta">
                <span className="profile-meta-item">
                  <IoLocationOutline /> {profileData.location}
                </span>
                <span className="profile-meta-item">
                  <IoCalendarOutline /> Joined {profileData.memberSince}
                </span>
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-meta-item profile-meta-link"
                >
                  <IoGlobeOutline /> Website
                </a>
              </div>
            </div>
          </div>

          <div className="profile-header-right">
            <Link to="/" className="profile-btn profile-btn--outline">
              <IoSettingsOutline /> Settings
            </Link>
            <button className="profile-btn profile-btn--primary" onClick={() => setEditModalOpen(true)}>
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
                {profileData.stats.rewardPoints.toLocaleString()}
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
                {profileData.stats.tasksCompleted}
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
                {profileData.stats.helpGiven}
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
                {profileData.stats.rating}
              </span>
              <span className="profile-stat-label">
                Rating ({profileData.stats.reviews} reviews)
              </span>
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
                    {profileData.recentActivity.map((item, idx) => (
                      <div key={idx} className="activity-item">
                        <div
                          className={`activity-icon activity-icon--${item.type}`}
                        >
                          {item.icon}
                        </div>
                        <div className="activity-info">
                          <span className="activity-title">{item.title}</span>
                          <span className="activity-time">{item.time}</span>
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

                {/* Reviews preview */}
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h3>Reviews</h3>
                    <button
                      className="profile-card-link"
                      onClick={() => setActiveTab("reviews")}
                    >
                      View All
                    </button>
                  </div>
                  <div className="reviews-preview">
                    <div className="review-summary">
                      <span className="review-big-rating">
                        {profileData.stats.rating}
                      </span>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <IoStarSharp
                            key={i}
                            className={`star-icon ${i < Math.floor(profileData.stats.rating) ? "star-filled" : "star-empty"}`}
                          />
                        ))}
                        <span className="review-count">
                          {profileData.stats.reviews} reviews
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
                  {profileData.recentActivity.map((item, idx) => (
                    <div key={idx} className="activity-item">
                      <div
                        className={`activity-icon activity-icon--${item.type}`}
                      >
                        {item.icon}
                      </div>
                      <div className="activity-info">
                        <span className="activity-title">{item.title}</span>
                        <span className="activity-time">{item.time}</span>
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
                  {profileData.skills.map((skill) => (
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
                  <div className="review-summary">
                    <span className="review-big-rating">
                      {profileData.stats.rating}
                    </span>
                    <div className="review-stars">
                      {[...Array(5)].map((_, i) => (
                        <IoStarSharp
                          key={i}
                          className={`star-icon ${i < Math.floor(profileData.stats.rating) ? "star-filled" : "star-empty"}`}
                        />
                      ))}
                      <span className="review-count">
                        {profileData.stats.reviews} reviews
                      </span>
                    </div>
                  </div>
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
                {profileData.skills.map((skill) => (
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
                {profileData.badges.map((badge, idx) => (
                  <div className="badge-item" key={idx}>
                    <span
                      className="badge-icon-box"
                      style={{ background: `${badge.color}15`, color: badge.color }}
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
                <a href="#" className="social-link-item">
                  <FaGithub /> GitHub
                </a>
                <a href="#" className="social-link-item">
                  <FaLinkedinIn /> LinkedIn
                </a>
                <a href="#" className="social-link-item">
                  <FaTwitter /> Twitter
                </a>
                <a href="#" className="social-link-item social-link-item--email">
                  <IoMailOutline /> {user?.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ EDIT PROFILE MODAL ══════ */}
      {editModalOpen && (
        <div className="edit-modal-overlay" onClick={() => setEditModalOpen(false)}>
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
                    onError={(e) => { e.target.style.display = 'none'; }}
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
