import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoFlashOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoStarSharp,
  IoChevronForward,
  IoLayersOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoCloseOutline,
  IoTrendingUpOutline,
  IoPeopleOutline,
  IoChevronDown,
  IoChevronUp,
  IoCalendarOutline,
  IoCheckmarkOutline,
  IoCloseCircle,
  IoChatbubbleOutline,
  IoCubeOutline,
} from "react-icons/io5";
import "./MySkills.css";

const statusMap = {
  published: { label: "Published", color: "#10b981", bg: "#d1fae5" },
  pending: { label: "Pending Review", color: "#f59e0b", bg: "#fef3c7" },
  archived: { label: "Archived", color: "#6b7280", bg: "#f1f5f9" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#fef2f2" },
};

const CATEGORIES = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Writing & Translation",
  "Admin & Customer Support",
  "Finance & Accounting",
  "Engineering & Architecture",
  "Others",
];

const hireStatusMap = {
  pending: { label: "Pending", color: "#b45309", bg: "#fef3c7" },
  accepted: { label: "Accepted", color: "#047857", bg: "#d1fae5" },
  declined: { label: "Declined", color: "#dc2626", bg: "#fef2f2" },
  cancelled: { label: "Cancelled", color: "#64748b", bg: "#f1f5f9" },
};

const MySkills = () => {
  const { user } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editModal, setEditModal] = useState({ open: false, skill: null });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
  });
  const [hireRequests, setHireRequests] = useState([]);
  const [expandedSkill, setExpandedSkill] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchMySkills();
    fetchHireRequests();
  }, [user]);

  const fetchMySkills = async () => {
    try {
      setLoading(true);
      // Fetch skills for current user
      const res = await fetch(
        `https://anwesha-backend.vercel.app/skills?seller=${user?.email}`,
      );
      const data = await res.json();
      setSkills(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const fetchHireRequests = async () => {
    try {
      const res = await fetch(
        `https://anwesha-backend.vercel.app/hire-requests?email=${user?.email}`,
      );
      const data = await res.json();
      setHireRequests(data || []);
    } catch (err) {
      console.error("Failed to load hire requests", err);
    }
  };

  const getHireRequestsForSkill = (skillId) => {
    return hireRequests.filter(
      (hr) =>
        hr.skillId?.toString() === skillId?.toString() &&
        hr.provider?.email === user?.email,
    );
  };

  const toggleExpandSkill = (skillId) => {
    setExpandedSkill((prev) => (prev === skillId ? null : skillId));
  };

  const handleHireRequestStatus = async (hrId, status) => {
    try {
      if (status === "accepted") {
        const hr = hireRequests.find((h) => h._id === hrId);
        if (hr) {
          // Create a project (client is the owner, provider is the helper)
          const projectRes = await fetch(
            "https://anwesha-backend.vercel.app/projects",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                postId: hr.skillId,
                owner: {
                  uid: hr.client?.uid,
                  email: hr.client?.email,
                  displayName: hr.client?.name,
                  photoURL: hr.client?.photoURL,
                },
                helper: {
                  uid: hr.provider?.uid,
                  email: hr.provider?.email,
                  displayName: hr.provider?.name,
                  photoURL: hr.provider?.photoURL,
                },
                title: hr.skillTitle,
                description: hr.message || "",
                category: "",
                tags: [],
                rewardPoints: hr.rewardPoints,
                deadline: `${hr.deliveryDays} days`,
                urgency: "LOW",
              }),
            },
          );

          if (!projectRes.ok) {
            const errData = await projectRes.json();
            if (errData.error === "Insufficient reward points") {
              toast.error(
                `Client doesn't have enough points! Need ${errData.required} pts but only ${errData.available} pts available.`,
              );
              return;
            }
            toast.error(errData.error || "Failed to create project");
            return;
          }

          const projectData = await projectRes.json();

          // Create a contract
          await fetch("https://anwesha-backend.vercel.app/contracts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: hr.skillId,
              applicationId: hr._id,
              projectId: projectData.project?._id || null,
              author: {
                uid: hr.client?.uid,
                email: hr.client?.email,
                displayName: hr.client?.name,
                photoURL: hr.client?.photoURL,
              },
              helper: {
                uid: hr.provider?.uid,
                email: hr.provider?.email,
                displayName: hr.provider?.name,
                photoURL: hr.provider?.photoURL,
              },
              rewardPoints: hr.rewardPoints,
              title: hr.skillTitle,
              description: hr.message || "",
              deadline: `${hr.deliveryDays} days`,
              urgency: "LOW",
            }),
          });
        }
      }

      // Update hire request status
      await fetch(`https://anwesha-backend.vercel.app/hire-requests/${hrId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      toast.success(
        status === "accepted"
          ? "Hire request accepted! Project created."
          : "Hire request declined",
      );
      fetchHireRequests();
    } catch (err) {
      toast.error(err.message || "Failed to update hire request");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this skill?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "skill-swal-popup",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`https://anwesha-backend.vercel.app/skills/${id}`, {
        method: "DELETE",
      });
      await Swal.fire({
        title: "Deleted!",
        text: "Your skill has been deleted successfully.",
        icon: "success",
        customClass: {
          popup: "skill-swal-popup",
        },
      });
      fetchMySkills();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to delete skill",
        icon: "error",
        customClass: {
          popup: "skill-swal-popup",
        },
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "archived" : "published";
    try {
      await fetch(`https://anwesha-backend.vercel.app/skills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(
        `Skill ${newStatus === "published" ? "published" : "archived"}`,
      );
      fetchMySkills();
    } catch (err) {
      toast.error(err.message || "Failed to update skill");
    }
  };

  const handleEditClick = (skill) => {
    setEditForm({
      title: skill.title || "",
      description: skill.description || "",
      category: skill.category || "",
      tags: skill.tags?.join(", ") || "",
    });
    setEditModal({ open: true, skill });
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      await fetch(
        `https://anwesha-backend.vercel.app/skills/${editModal.skill._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            category: editForm.category.trim(),
            tags: editForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }),
        },
      );
      await Swal.fire({
        title: "Updated!",
        text: "Your skill has been updated successfully.",
        icon: "success",
        customClass: {
          popup: "skill-swal-popup",
        },
      });
      setEditModal({ open: false, skill: null });
      fetchMySkills();
    } catch (err) {
      toast.error(err.message || "Failed to update skill");
    }
  };

  const filtered =
    filter === "all" ? skills : skills.filter((s) => s.status === filter);

  const stats = {
    published: skills.filter((s) => s.status === "published" || !s.status)
      .length,
    archived: skills.filter((s) => s.status === "archived").length,
    total: skills.length,
  };

  // Generate avatar color from name
  const generateAvatarColor = (name = "") => {
    const colors = [
      "#6366f1",
      "#8b5cf6",
      "#ec4899",
      "#f43f5e",
      "#f97316",
      "#22c55e",
      "#14b8a6",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (loading) {
    return (
      <div className="myskills-loading">
        <div className="myskills-spinner" />
        <p>Loading your skills...</p>
      </div>
    );
  }

  return (
    <div className="myskills">
      <div className="myskills-header">
        <div className="myskills-header-left">
          <h1 className="myskills-title">My Skills</h1>
          <p className="myskills-subtitle">
            Manage the skills you offer to the community
          </p>
        </div>
        <Link to="/post-skill" className="myskills-add-btn">
          <IoFlashOutline /> Post New Skill
        </Link>
      </div>

      <div className="myskills-stats">
        <div className="myskills-stat">
          <div className="skstat-icon skstat-icon--active">
            <IoCheckmarkCircleOutline />
          </div>
          <div className="skstat-info">
            <span className="skstat-value">{stats.published}</span>
            <span className="skstat-label">Published</span>
          </div>
        </div>
        <div className="myskills-stat">
          <div className="skstat-icon skstat-icon--pending">
            <IoTimeOutline />
          </div>
          <div className="skstat-info">
            <span className="skstat-value">{stats.archived}</span>
            <span className="skstat-label">Archived</span>
          </div>
        </div>
        <div className="myskills-stat">
          <div className="skstat-icon skstat-icon--total">
            <IoLayersOutline />
          </div>
          <div className="skstat-info">
            <span className="skstat-value">{stats.total}</span>
            <span className="skstat-label">Total Skills</span>
          </div>
        </div>
      </div>

      <div className="myskills-filters">
        {["all", "published", "pending", "archived"].map((f) => (
          <button
            key={f}
            className={`skfilt-btn ${filter === f ? "skfilt-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : statusMap[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="myskills-empty">
          <IoFlashOutline className="empty-icon" />
          <h3>No skills found</h3>
          <p>Start offering your expertise by posting your first skill.</p>
          <Link to="/post-skill" className="empty-link">
            Post Your First Skill
          </Link>
        </div>
      ) : (
        <div className="myskills-list">
          {filtered.map((skill) => {
            const s = statusMap[skill.status] || statusMap.published;
            const starterPkg =
              skill.packages?.find((p) => p.name === "Starter") ||
              skill.packages?.[0];

            return (
              <div key={skill._id} className="skill-card">
                <div className="skill-card-top">
                  <span
                    className="skill-status"
                    style={{ color: s.color, background: s.bg }}
                  >
                    {s.label}
                  </span>
                  <span className="skill-date">
                    <IoTimeOutline />
                    {new Date(skill.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="skill-title">{skill.title}</h3>

                <p className="skill-desc">{skill.description}</p>

                <div className="skill-card-meta">
                  {skill.category && (
                    <span className="skill-meta-chip">{skill.category}</span>
                  )}
                  {starterPkg?.price && (
                    <span className="skill-meta-chip">
                      <IoFlashOutline /> {starterPkg.price} pts
                    </span>
                  )}
                  {starterPkg?.deliveryDays && (
                    <span className="skill-meta-chip">
                      <IoTimeOutline /> {starterPkg.deliveryDays}d delivery
                    </span>
                  )}
                  {skill.rating > 0 && (
                    <span className="skill-meta-chip skill-meta-chip--rating">
                      <IoStarSharp /> {skill.rating?.toFixed(1)}
                    </span>
                  )}
                </div>

                {skill.tags?.length > 0 && (
                  <div className="skill-tags">
                    {skill.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="skill-tag">
                        {tag}
                      </span>
                    ))}
                    {skill.tags.length > 4 && (
                      <span className="skill-tag skill-tag--more">
                        +{skill.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="skill-card-actions">
                  <div className="skill-actions-left">
                    {skill.status === "archived" ? (
                      <button
                        className="skill-action-btn skill-action-btn--publish"
                        onClick={() =>
                          handleToggleStatus(skill._id, "archived")
                        }
                        title="Publish skill"
                      >
                        <IoTrendingUpOutline /> Publish
                      </button>
                    ) : (
                      <button
                        className="skill-action-btn skill-action-btn--archive"
                        onClick={() =>
                          handleToggleStatus(skill._id, "published")
                        }
                        title="Archive skill"
                      >
                        <IoLayersOutline /> Archive
                      </button>
                    )}
                    <button
                      className="skill-action-btn skill-action-btn--delete"
                      onClick={() => handleDelete(skill._id)}
                      title="Delete skill"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                  <div className="skill-actions-right">
                    <button
                      className="skill-edit-btn"
                      onClick={() => handleEditClick(skill)}
                    >
                      <IoCreateOutline /> Edit
                    </button>
                    {getHireRequestsForSkill(skill._id).length > 0 && (
                      <button
                        className="skill-hire-toggle"
                        onClick={() => toggleExpandSkill(skill._id)}
                      >
                        <IoPeopleOutline />
                        {getHireRequestsForSkill(skill._id).length} Hire
                        {getHireRequestsForSkill(skill._id).length !== 1
                          ? "s"
                          : ""}
                        {expandedSkill === skill._id ? (
                          <IoChevronUp />
                        ) : (
                          <IoChevronDown />
                        )}
                      </button>
                    )}
                    <Link to={`/skill/${skill._id}`} className="skill-view-btn">
                      View <IoChevronForward />
                    </Link>
                  </div>
                </div>

                {/* Expandable Hire Requests Section */}
                {expandedSkill === skill._id && (
                  <div className="skill-hire-panel">
                    <h4 className="hire-panel-title">
                      <IoPeopleOutline /> Hire Requests (
                      {getHireRequestsForSkill(skill._id).length})
                    </h4>
                    {getHireRequestsForSkill(skill._id).map((hr) => {
                      const hrStatus = (hr.status || "pending").toLowerCase();
                      const hs =
                        hireStatusMap[hrStatus] || hireStatusMap.pending;
                      return (
                        <div
                          key={hr._id}
                          className={`hire-card hire-card--${hrStatus}`}
                        >
                          <div className="hire-card-header">
                            <div className="hire-applicant">
                              {hr.client?.photoURL ? (
                                <img
                                  src={hr.client.photoURL}
                                  alt={hr.client.name}
                                  referrerPolicy="no-referrer"
                                  className="hire-avatar"
                                />
                              ) : (
                                <div className="hire-avatar hire-avatar--placeholder">
                                  {(hr.client?.name || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div className="hire-applicant-info">
                                <span className="hire-name">
                                  {hr.client?.name || "Anonymous"}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`hire-status hire-status--${hrStatus}`}
                              style={{ color: hs.color, background: hs.bg }}
                            >
                              {hs.label}
                            </span>
                          </div>

                          <div className="hire-details">
                            <div className="hire-detail-item">
                              <IoCubeOutline />
                              <span>
                                Package: <strong>{hr.package || "N/A"}</strong>
                              </span>
                            </div>
                            <div className="hire-detail-item">
                              <IoFlashOutline />
                              <span>
                                Reward: <strong>{hr.rewardPoints} pts</strong>
                              </span>
                            </div>
                            <div className="hire-detail-item">
                              <IoCalendarOutline />
                              <span>
                                Delivery:{" "}
                                <strong>{hr.deliveryDays} days</strong>
                              </span>
                            </div>
                          </div>

                          {hr.message && (
                            <div className="hire-cover">
                              <IoChatbubbleOutline />
                              <p>{hr.message}</p>
                            </div>
                          )}

                          <div className="hire-meta">
                            <span className="hire-date">
                              <IoTimeOutline /> Sent{" "}
                              {new Date(hr.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {hrStatus === "pending" && (
                            <div className="hire-actions">
                              <button
                                className="hire-accept-btn"
                                onClick={() =>
                                  handleHireRequestStatus(hr._id, "accepted")
                                }
                              >
                                <IoCheckmarkOutline /> Accept
                              </button>
                              <button
                                className="hire-reject-btn"
                                onClick={() =>
                                  handleHireRequestStatus(hr._id, "declined")
                                }
                              >
                                <IoCloseCircle /> Decline
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div
          className="edit-modal-overlay"
          onClick={() => setEditModal({ open: false, skill: null })}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Skill</h2>
              <button
                className="edit-modal-close"
                onClick={() => setEditModal({ open: false, skill: null })}
              >
                <IoCloseOutline />
              </button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="Skill title"
                />
              </div>
              <div className="edit-form-group">
                <label>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-form-group">
                <label>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Describe your skill..."
                  rows={5}
                />
              </div>
              <div className="edit-form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) =>
                    setEditForm({ ...editForm, tags: e.target.value })
                  }
                  placeholder="e.g., React, Node.js, E-commerce"
                />
              </div>
            </div>
            <div className="edit-modal-footer">
              <button
                className="edit-modal-cancel"
                onClick={() => setEditModal({ open: false, skill: null })}
              >
                Cancel
              </button>
              <button className="edit-modal-save" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySkills;
