import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoHelpCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoTrophyOutline,
  IoChevronForward,
  IoLayersOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoPeopleOutline,
  IoAddOutline,
  IoCloseOutline,
  IoRefreshOutline,
  IoBanOutline,
  IoClose,
  IoChevronDown,
  IoChevronUp,
  IoMailOutline,
  IoCalendarOutline,
  IoFlashOutline,
  IoCheckmarkOutline,
  IoCloseCircle,
  IoChatbubbleOutline,
} from "react-icons/io5";
import "./MyRequests.css";

// Helper to normalize status to lowercase
const normalizeStatus = (status) => {
  const s = (status || "open").toLowerCase();
  if (s === "inprocess") return "in_progress";
  return s;
};

const statusMap = {
  open: { label: "Open", color: "#10b981", bg: "#d1fae5" },
  in_progress: { label: "In Progress", color: "#6366f1", bg: "#e0e7ff" },
  completed: { label: "Completed", color: "#8b5cf6", bg: "#ede9fe" },
  delivered: { label: "Delivered", color: "#8b5cf6", bg: "#f5f3ff" },
  closed: { label: "Closed", color: "#6b7280", bg: "#f1f5f9" },
  cancelled: { label: "Cancelled", color: "#ef4444", bg: "#fef2f2" },
};

const CATEGORIES = [
  "Development & IT",
  "Design & Creative",
  "Sales & Marketing",
  "Writing & Translation",
  "Admin & Customer Support",
  "Finance & Accounting",
  "Engineering & Architecture",
  "AI & Machine Learning",
  "Other",
];

const SKILLS_BY_CATEGORY = {
  "Development & IT": [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "Vue.js",
    "Angular",
    "Next.js",
    "Express.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Laravel",
    "Ruby on Rails",
    "ASP.NET",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "GraphQL",
    "REST API",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Google Cloud",
    "DevOps",
    "CI/CD",
    "Git",
    "WordPress",
    "Flutter",
    "Firebase",
    "React Native",
  ],
  "Design & Creative": [
    "Figma",
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Adobe XD",
    "Sketch",
    "UI Design",
    "UX Design",
    "Wireframing",
    "Prototyping",
    "Logo",
    "Branding",
    "Graphic Design",
    "Web Design",
    "Mobile App Design",
    "Motion Graphics",
    "Video Editing",
    "3D Modeling",
    "Blender",
    "Animation",
    "Canva",
    "InDesign",
    "After Effects",
  ],
  "Writing & Translation": [
    "SEO",
    "Blog Posts",
    "Technical Writing",
    "Copywriting",
    "Content Writing",
    "Proofreading",
    "Editing",
    "Translation",
    "Creative Writing",
    "Ghostwriting",
    "Article Writing",
    "Script Writing",
    "Grant Writing",
  ],
  "Sales & Marketing": [
    "Instagram",
    "TikTok",
    "Content Calendar",
    "Social Media Marketing",
    "Email Marketing",
    "Google Ads",
    "Facebook Ads",
    "Analytics",
    "Lead Generation",
    "Brand Strategy",
    "Influencer Marketing",
    "Marketing Automation",
    "CRM",
    "Salesforce",
    "HubSpot",
  ],
  "Finance & Accounting": [
    "Excel",
    "DCF",
    "Financial Modeling",
    "QuickBooks",
    "Accounting",
    "Bookkeeping",
    "Tax Preparation",
    "Financial Analysis",
    "Budgeting",
    "Payroll",
    "Xero",
    "SAP",
    "Tally",
  ],
  "Admin & Customer Support": [
    "Intercom",
    "Zendesk",
    "Chatbots",
    "Virtual Assistant",
    "Data Entry",
    "Customer Service",
    "Live Chat",
    "Help Desk",
    "Scheduling",
    "Email Management",
    "Calendar Management",
    "Research",
  ],
  "Engineering & Architecture": [
    "AutoCAD",
    "Revit",
    "SolidWorks",
    "SketchUp",
    "Civil 3D",
    "Structural Design",
    "MEP Design",
    "3D Rendering",
    "BIM",
    "Interior Design",
    "Landscape Design",
    "Urban Planning",
  ],
  "AI & Machine Learning": [
    "TensorFlow",
    "PyTorch",
    "FastAPI",
    "OpenAI",
    "LangChain",
    "API",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "Data Science",
    "Neural Networks",
    "ChatGPT Integration",
    "Hugging Face",
  ],
  Other: [
    "Resume",
    "LinkedIn",
    "Career Coaching",
    "Interview Prep",
    "Project Management",
    "Business Analysis",
    "Consulting",
    "Training",
    "Tutoring",
    "Music Production",
    "Voice Over",
  ],
};

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

const URGENCY_OPTIONS = [
  { value: "LOW", label: "Low", color: "#10b981" },
  { value: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { value: "HIGH", label: "High", color: "#ef4444" },
  { value: "CRITICAL", label: "Critical", color: "#dc2626" },
];

const MyRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editModal, setEditModal] = useState({ open: false, request: null });
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    tagInput: "",
    rewardPoints: 0,
    deadline: "",
    urgency: "LOW",
  });
  const [applications, setApplications] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchMyRequests();
    fetchApplications();
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/posts?user=${user?.email}`,
      );
      const data = await res.json();
      setRequests(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/applications/owner/${user?.email}`,
      );
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  const getApplicationsForPost = (postId) => {
    return applications.filter(
      (app) => app.postId?.toString() === postId?.toString(),
    );
  };

  const handleApplicationStatus = async (appId, status) => {
    try {
      // If accepting, check reward balance and create project first
      if (status === "accepted") {
        const app = applications.find((a) => a._id === appId);
        const request = requests.find(
          (r) => r._id?.toString() === app?.postId?.toString(),
        );
        if (app && request) {
          const projectRes = await fetch("http://localhost:3000/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: request._id,
              owner: {
                uid: user?.uid,
                email: user?.email,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
              },
              helper: {
                uid: app.applicant?.uid || null,
                email: app.applicant?.email,
                displayName: app.applicant?.displayName,
                photoURL: app.applicant?.photoURL,
              },
              title: request.title,
              description: request.description,
              category: request.category,
              tags: request.tags,
              rewardPoints: app.expectedReward,
              deadline: request.deadline,
              urgency: request.urgency,
            }),
          });

          if (!projectRes.ok) {
            const errData = await projectRes.json();
            if (errData.error === "Insufficient reward points") {
              toast.error(
                `Not enough points! Need ${errData.required} pts but only ${errData.available} pts available (${errData.tobereleased} pts reserved for other projects).`,
              );
              return;
            }
            toast.error(errData.error || "Failed to create project");
            return;
          }

          const projectData = await projectRes.json();

          // Create a contract record for this accepted application
          await fetch("http://localhost:3000/contracts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postId: request._id,
              applicationId: app._id,
              projectId: projectData.project?._id || null,
              author: {
                uid: user?.uid,
                email: user?.email,
                displayName: user?.displayName,
                photoURL: user?.photoURL,
              },
              helper: {
                uid: app.applicant?.uid || null,
                email: app.applicant?.email,
                displayName: app.applicant?.displayName,
                photoURL: app.applicant?.photoURL,
              },
              rewardPoints: app.expectedReward,
              title: request.title,
              description: request.description,
              category: request.category,
              tags: request.tags,
              deadline: request.deadline,
              urgency: request.urgency,
            }),
          });
        }
      }

      // Update application status only after project is created successfully
      await fetch(`http://localhost:3000/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      toast.success(
        status === "accepted"
          ? "Offer accepted! Project created."
          : "Offer rejected",
      );
      fetchApplications();
      fetchMyRequests();
    } catch (err) {
      toast.error(err.message || "Failed to update application");
    }
  };

  const toggleExpand = (requestId) => {
    setExpandedRequest((prev) => (prev === requestId ? null : requestId));
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this request?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "request-swal-popup",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" });
      await Swal.fire({
        title: "Deleted!",
        text: "Your request has been deleted successfully.",
        icon: "success",
        customClass: {
          popup: "request-swal-popup",
        },
      });
      fetchMyRequests();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to delete request",
        icon: "error",
        customClass: {
          popup: "request-swal-popup",
        },
      });
    }
  };

  const handleClose = async (id) => {
    if (!confirm("Close this request? No more offers will be accepted."))
      return;
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "closed" }),
      });
      toast.success("Request closed");
      fetchMyRequests();
    } catch (err) {
      toast.error(err.message || "Failed to close request");
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel this request?",
      text: "You can reopen it later if needed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      customClass: {
        popup: "request-swal-popup",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      toast.success("Request cancelled");
      fetchMyRequests();
    } catch (err) {
      toast.error(err.message || "Failed to cancel request");
    }
  };

  const handleReopen = async (id) => {
    try {
      await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "OPEN" }),
      });
      toast.success("Request reopened");
      fetchMyRequests();
    } catch (err) {
      toast.error(err.message || "Failed to reopen request");
    }
  };

  const handleEditClick = (request) => {
    setEditForm({
      title: request.title || "",
      description: request.description || "",
      category: request.category || "",
      tags: request.tags || [],
      tagInput: "",
      rewardPoints: request.rewardPoints || 0,
      deadline: request.deadline || "",
      urgency: request.urgency || "LOW",
    });
    setShowSkillDropdown(false);
    setEditModal({ open: true, request });
  };

  // Skill tag handlers
  const availableSkills = editForm.category
    ? SKILLS_BY_CATEGORY[editForm.category] || []
    : [];

  const filteredSkills = availableSkills.filter(
    (skill) =>
      !editForm.tags.includes(skill) &&
      skill.toLowerCase().includes(editForm.tagInput.toLowerCase()),
  );

  const selectTag = (tag) => {
    if (tag && !editForm.tags.includes(tag) && editForm.tags.length < 8) {
      setEditForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
      setShowSkillDropdown(false);
    }
  };

  const removeTag = (tag) => {
    setEditForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleCategoryChange = (newCategory) => {
    setEditForm((prev) => ({
      ...prev,
      category: newCategory,
      tags: [],
      tagInput: "",
    }));
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      await fetch(`http://localhost:3000/posts/${editModal.request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          category: editForm.category.trim(),
          tags: editForm.tags,
          rewardPoints: Number(editForm.rewardPoints) || 0,
          deadline: editForm.deadline,
          urgency: editForm.urgency,
        }),
      });
      await Swal.fire({
        title: "Updated!",
        text: "Your request has been updated successfully.",
        icon: "success",
        customClass: {
          popup: "request-swal-popup",
        },
      });
      setEditModal({ open: false, request: null });
      fetchMyRequests();
    } catch (err) {
      toast.error(err.message || "Failed to update request");
    }
  };

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((r) => normalizeStatus(r.status) === filter);

  const stats = {
    open: requests.filter((r) => normalizeStatus(r.status) === "open").length,
    inProgress: requests.filter(
      (r) => normalizeStatus(r.status) === "in_progress",
    ).length,
    completed: requests.filter((r) => normalizeStatus(r.status) === "completed")
      .length,
    total: requests.length,
  };

  if (loading) {
    return (
      <div className="myrequests-loading">
        <div className="myrequests-spinner" />
        <p>Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="myrequests">
      <div className="myrequests-header">
        <div className="myrequests-header-left">
          <h1 className="myrequests-title">My Requests</h1>
          <p className="myrequests-subtitle">
            Track help requests you've posted to the community
          </p>
        </div>
        <Link to="/post-request" className="myrequests-add-btn">
          <IoAddOutline /> Post New Request
        </Link>
      </div>

      <div className="myrequests-stats myrequests-stats--inline">
        <div className="myrequests-stat">
          <div className="rqstat-icon rqstat-icon--open">
            <IoHelpCircleOutline />
          </div>
          <div className="rqstat-info">
            <span className="rqstat-value">{stats.open}</span>
            <span className="rqstat-label">Open</span>
          </div>
        </div>
        <div className="myrequests-stat">
          <div className="rqstat-icon rqstat-icon--progress">
            <IoTimeOutline />
          </div>
          <div className="rqstat-info">
            <span className="rqstat-value">{stats.inProgress}</span>
            <span className="rqstat-label">In Progress</span>
          </div>
        </div>
        <div className="myrequests-stat">
          <div className="rqstat-icon rqstat-icon--total">
            <IoLayersOutline />
          </div>
          <div className="rqstat-info">
            <span className="rqstat-value">{stats.completed}</span>
            <span className="rqstat-label">Completed</span>
          </div>
        </div>
        <div className="myrequests-stat">
          <div className="rqstat-icon rqstat-icon--total">
            <IoLayersOutline />
          </div>
          <div className="rqstat-info">
            <span className="rqstat-value">{stats.total}</span>
            <span className="rqstat-label">Total Posted</span>
          </div>
        </div>
      </div>

      <div className="myrequests-filters">
        {[
          "all",
          "open",
          "in_progress",
          "delivered",
          "completed",
          "closed",
          "cancelled",
        ].map((f) => (
          <button
            key={f}
            className={`rqfilt-btn ${filter === f ? "rqfilt-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : statusMap[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="myrequests-empty">
          <IoHelpCircleOutline className="empty-icon" />
          <h3>No requests found</h3>
          <p>
            Need help with something? Post a request and let the community
            assist you.
          </p>
          <Link to="/post-request" className="empty-link">
            Post Your First Request
          </Link>
        </div>
      ) : (
        <div className="myrequests-list">
          {filtered.map((request) => {
            const status = normalizeStatus(request.status);
            const s = statusMap[status] || statusMap.open;
            const offersCount =
              request.offers?.length ||
              request.offersCount ||
              request.applicantsCount ||
              0;
            const urgencyLower = (request.urgency || "").toLowerCase();

            return (
              <div key={request._id} className="request-card">
                <div className="request-card-top">
                  <span
                    className="request-status"
                    style={{ color: s.color, background: s.bg }}
                  >
                    {s.label}
                  </span>
                  <span className="request-date">
                    <IoTimeOutline />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="request-title">{request.title}</h3>

                <p className="request-desc">{request.description}</p>

                <div className="request-card-meta">
                  {request.category && (
                    <span className="request-meta-chip">
                      {request.category}
                    </span>
                  )}
                  {request.rewardPoints > 0 && (
                    <span className="request-meta-chip request-meta-chip--reward">
                      <IoTrophyOutline /> {request.rewardPoints} pts
                    </span>
                  )}
                  {request.urgency && (
                    <span
                      className={`request-meta-chip request-meta-chip--${urgencyLower}`}
                    >
                      {urgencyLower === "high"
                        ? "🔥 Urgent"
                        : urgencyLower === "medium"
                          ? "⚡ Medium"
                          : "📋 Low"}
                    </span>
                  )}
                  <span className="request-meta-chip request-meta-chip--offers">
                    <IoPeopleOutline /> {offersCount} offer
                    {offersCount !== 1 ? "s" : ""}
                  </span>
                </div>

                {request.tags?.length > 0 && (
                  <div className="request-tags">
                    {request.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="request-tag">
                        {tag}
                      </span>
                    ))}
                    {request.tags.length > 4 && (
                      <span className="request-tag request-tag--more">
                        +{request.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="request-card-actions">
                  <div className="request-actions-left">
                    {status === "cancelled" ? (
                      <button
                        className="request-action-btn request-action-btn--reopen"
                        onClick={() => handleReopen(request._id)}
                        title="Reopen request"
                      >
                        <IoRefreshOutline /> Reopen
                      </button>
                    ) : status === "open" ? (
                      <button
                        className="request-action-btn request-action-btn--cancel"
                        onClick={() => handleCancel(request._id)}
                        title="Cancel request"
                      >
                        <IoBanOutline /> Cancel
                      </button>
                    ) : null}
                    {/* <button
                      className="request-action-btn request-action-btn--delete"
                      onClick={() => handleDelete(request._id)}
                      title="Delete request"
                    >
                      <IoTrashOutline />
                    </button> */}
                  </div>
                  <div className="request-actions-right">
                    <button
                      className="request-edit-btn"
                      onClick={() => handleEditClick(request)}
                    >
                      <IoCreateOutline /> Edit
                    </button>
                    {getApplicationsForPost(request._id).length > 0 && (
                      <button
                        className="request-applications-toggle"
                        onClick={() => toggleExpand(request._id)}
                      >
                        <IoPeopleOutline />
                        {getApplicationsForPost(request._id).length} Offer
                        {getApplicationsForPost(request._id).length !== 1
                          ? "s"
                          : ""}
                        {expandedRequest === request._id ? (
                          <IoChevronUp />
                        ) : (
                          <IoChevronDown />
                        )}
                      </button>
                    )}
                    <Link
                      to={`/request/${request._id}`}
                      className="request-view-btn"
                    >
                      {offersCount > 0 ? "View Offers" : "View"}{" "}
                      <IoChevronForward />
                    </Link>
                  </div>
                </div>

                {/* Expandable Applications Section */}
                {expandedRequest === request._id && (
                  <div className="request-applications-panel">
                    <h4 className="applications-panel-title">
                      <IoPeopleOutline /> Offers (
                      {getApplicationsForPost(request._id).length})
                    </h4>
                    {getApplicationsForPost(request._id).map((app) => {
                      const appStatus = (app.status || "pending").toLowerCase();
                      return (
                        <div
                          key={app._id}
                          className={`application-card application-card--${appStatus}`}
                        >
                          <div className="application-card-header">
                            <div className="application-applicant">
                              {app.applicant?.photoURL ? (
                                <img
                                  src={app.applicant.photoURL}
                                  alt={app.applicant.displayName}
                                  referrerPolicy="no-referrer"
                                  className="application-avatar"
                                />
                              ) : (
                                <div className="application-avatar application-avatar--placeholder">
                                  {(app.applicant?.displayName || "U")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <div className="application-applicant-info">
                                <span className="application-name">
                                  {app.applicant?.displayName || "Anonymous"}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`application-status application-status--${appStatus}`}
                            >
                              {appStatus === "pending"
                                ? "Pending"
                                : appStatus === "accepted"
                                  ? "Accepted"
                                  : appStatus === "rejected"
                                    ? "Rejected"
                                    : appStatus === "withdrawn"
                                      ? "Withdrawn"
                                      : appStatus}
                            </span>
                          </div>

                          <div className="application-details">
                            <div className="application-detail-item">
                              <IoCalendarOutline />
                              <span>
                                Proposed Deadline:{" "}
                                <strong>{app.proposedDeadline}</strong>
                              </span>
                            </div>
                            <div className="application-detail-item">
                              <IoFlashOutline />
                              <span>
                                Expected Reward:{" "}
                                <strong>{app.expectedReward} pts</strong>
                              </span>
                            </div>
                          </div>

                          {app.skills?.length > 0 && (
                            <div className="application-skills">
                              {app.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="application-skill-tag"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.coverMessage && (
                            <div className="application-cover">
                              <IoChatbubbleOutline />
                              <p>{app.coverMessage}</p>
                            </div>
                          )}

                          <div className="application-meta">
                            <span className="application-date">
                              <IoTimeOutline /> Applied{" "}
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {appStatus === "pending" && (
                            <div className="application-actions">
                              <button
                                className="application-accept-btn"
                                onClick={() =>
                                  handleApplicationStatus(app._id, "accepted")
                                }
                              >
                                <IoCheckmarkOutline /> Accept
                              </button>
                              <button
                                className="application-reject-btn"
                                onClick={() =>
                                  handleApplicationStatus(app._id, "rejected")
                                }
                              >
                                <IoCloseCircle /> Reject
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
          onClick={() => setEditModal({ open: false, request: null })}
        >
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Request</h2>
              <button
                className="edit-modal-close"
                onClick={() => setEditModal({ open: false, request: null })}
              >
                <IoCloseOutline />
              </button>
            </div>
            <div className="edit-modal-body">
              {/* Title */}
              <div className="pr-form-group">
                <label>
                  Request Title <span className="pr-required">*</span>
                </label>
                <input
                  type="text"
                  className="pr-input"
                  value={editForm.title}
                  maxLength={100}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder='e.g. "Need a React developer to fix my authentication flow"'
                />
                <div className="pr-char-count">{editForm.title.length}/100</div>
              </div>

              {/* Category */}
              <div className="pr-form-group">
                <label>
                  Category <span className="pr-required">*</span>
                </label>
                <div className="pr-select-wrap">
                  <select
                    className="pr-select"
                    value={editForm.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="pr-form-group">
                <label>
                  Description <span className="pr-required">*</span>
                </label>
                <textarea
                  className="pr-textarea"
                  rows={5}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Describe what you need help with in detail..."
                />
                <div className="pr-char-count">
                  {editForm.description.length} characters
                </div>
              </div>

              {/* Reward Points */}
              <div className="pr-form-group">
                <label>
                  Reward Points <span className="pr-required">*</span>
                </label>
                <div className="pr-pts-input-wrap">
                  <IoTrophyOutline className="pr-pts-icon" />
                  <input
                    type="number"
                    className="pr-input"
                    min="1"
                    value={editForm.rewardPoints}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rewardPoints: e.target.value })
                    }
                    placeholder="e.g. 50"
                  />
                  <span className="pr-pts-label">points</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="pr-form-group">
                <label>Deadline</label>
                <div className="pr-radio-group">
                  {DEADLINE_OPTIONS.map((d) => (
                    <label
                      key={d}
                      className={`pr-radio-chip ${editForm.deadline === d ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="deadline"
                        value={d}
                        checked={editForm.deadline === d}
                        onChange={() =>
                          setEditForm({ ...editForm, deadline: d })
                        }
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div className="pr-form-group">
                <label>Urgency Level</label>
                <div className="pr-radio-group">
                  {URGENCY_OPTIONS.map((u) => (
                    <label
                      key={u.value}
                      className={`pr-radio-chip ${editForm.urgency === u.value ? "active" : ""}`}
                      style={{
                        borderColor:
                          editForm.urgency === u.value ? u.color : undefined,
                        background:
                          editForm.urgency === u.value
                            ? `${u.color}10`
                            : undefined,
                        color:
                          editForm.urgency === u.value ? u.color : undefined,
                      }}
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={u.value}
                        checked={editForm.urgency === u.value}
                        onChange={() =>
                          setEditForm({ ...editForm, urgency: u.value })
                        }
                      />
                      {u.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="pr-form-group">
                <label>
                  Skill Tags{" "}
                  <span className="pr-label-hint">
                    (up to 8 – helps helpers find your request)
                  </span>
                </label>
                <div className="pr-skill-select-wrapper">
                  <input
                    type="text"
                    className="pr-input"
                    placeholder={
                      editForm.category
                        ? "Search and select skills..."
                        : "Please select a category first"
                    }
                    value={editForm.tagInput}
                    onChange={(e) => {
                      setEditForm({ ...editForm, tagInput: e.target.value });
                      setShowSkillDropdown(true);
                    }}
                    onFocus={() => setShowSkillDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowSkillDropdown(false), 200)
                    }
                    disabled={!editForm.category || editForm.tags.length >= 8}
                  />
                  {showSkillDropdown && filteredSkills.length > 0 && (
                    <div className="pr-skill-dropdown">
                      {filteredSkills.slice(0, 10).map((skill) => (
                        <div
                          key={skill}
                          className="pr-skill-option"
                          onMouseDown={() => selectTag(skill)}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {editForm.tags.length > 0 && (
                  <div className="pr-tags-preview">
                    {editForm.tags.map((tag) => (
                      <span key={tag} className="pr-tag-chip">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="pr-tag-remove"
                          type="button"
                        >
                          <IoClose />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="edit-modal-footer">
              <button
                className="edit-modal-cancel"
                onClick={() => setEditModal({ open: false, request: null })}
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

export default MyRequests;
