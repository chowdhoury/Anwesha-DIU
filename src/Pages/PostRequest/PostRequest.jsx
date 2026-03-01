import React, { useState } from "react";
import { Link } from "react-router";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircle,
  IoFlashOutline,
  IoAddOutline,
  IoClose,
  IoInformationCircleOutline,
  IoHandLeftOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoSearchOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import "./PostRequest.css";

/* ─── Constants ─────────────────── */
const CATEGORIES = [
  "Tech",
  "Design",
  "Writing",
  "Education",
  "Music",
  "Business",
  "Lifestyle",
  "Other",
];

const URGENCY_OPTIONS = [
  { value: "low", label: "Low – No rush", color: "#10b981" },
  { value: "medium", label: "Medium – Within a week", color: "#f59e0b" },
  { value: "high", label: "High – Urgent!", color: "#ef4444" },
];

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

const STEPS = [
  { id: 1, label: "Details", icon: <IoDocumentTextOutline /> },
  { id: 2, label: "Preferences", icon: <IoSearchOutline /> },
  { id: 3, label: "Preview", icon: <IoCheckmarkCircle /> },
];

/* ─── Component ─────────────────── */
const PostRequest = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  /* Step 1: Details */
  const [details, setDetails] = useState({
    title: "",
    category: "",
    description: "",
    tags: [],
    tagInput: "",
  });

  /* Step 2: Preferences */
  const [prefs, setPrefs] = useState({
    points: "",
    deadline: "1 week",
    urgency: "medium",
    location: "Remote",
  });

  /* ── Handlers ── */
  const handleDetailsChange = (field, value) =>
    setDetails((prev) => ({ ...prev, [field]: value }));

  const handlePrefsChange = (field, value) =>
    setPrefs((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    const tag = details.tagInput.trim();
    if (tag && !details.tags.includes(tag) && details.tags.length < 8) {
      setDetails((prev) => ({ ...prev, tags: [...prev.tags, tag], tagInput: "" }));
    }
  };

  const removeTag = (tag) =>
    setDetails((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  /* ── Validation ── */
  const canProceedStep1 =
    details.title.length >= 10 &&
    details.category &&
    details.description.length >= 50;

  const canProceedStep2 = prefs.points && parseInt(prefs.points) > 0;

  const handleSubmit = () => setSubmitted(true);

  /* ══════════════════════════ SUCCESS SCREEN ══════════════════════════ */
  if (submitted) {
    return (
      <div className="pr-page">
        <div className="pr-success">
          <div className="pr-success-glow" />
          <div className="pr-success-icon">
            <IoCheckmarkCircle />
          </div>
          <h2>Request Posted!</h2>
          <p>
            Your help request is live. Community members will start applying
            soon. You'll be notified when someone offers to help.
          </p>
          <div className="pr-success-actions">
            <Link to="/find-requests" className="pr-success-btn pr-success-btn--primary">
              <IoSearchOutline /> Browse All Requests
            </Link>
            <button
              className="pr-success-btn pr-success-btn--outline"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setDetails({ title: "", category: "", description: "", tags: [], tagInput: "" });
                setPrefs({ points: "", deadline: "1 week", urgency: "medium", location: "Remote" });
              }}
            >
              Post Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════ MAIN FORM ══════════════════════════ */
  return (
    <div className="pr-page">
      <div className="pr-container">

        {/* ── Header ── */}
        <div className="pr-header">
          <Link to="/find-requests" className="pr-back-link">
            <IoArrowBack /> Back to Requests
          </Link>
          <div className="pr-header-text">
            <h1>Post a Help Request</h1>
            <p>Describe what you need and earn help from the community</p>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="pr-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={`pr-step ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}
              >
                <div className="pr-step-circle">
                  {step > s.id ? <IoCheckmarkCircle /> : s.icon}
                </div>
                <span className="pr-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`pr-step-line ${step > s.id ? "done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ════════════ STEP 1: Details ════════════ */}
        {step === 1 && (
          <div className="pr-form-card">
            <h2 className="pr-form-title">Request Details</h2>
            <p className="pr-form-subtitle">
              Be specific so community members know exactly what you need.
            </p>

            {/* Title */}
            <div className="pr-form-group">
              <label htmlFor="pr-title">
                Request Title <span className="pr-required">*</span>
              </label>
              <input
                id="pr-title"
                type="text"
                className="pr-input"
                placeholder='e.g. "Need a React developer to fix my authentication flow"'
                value={details.title}
                maxLength={100}
                onChange={(e) => handleDetailsChange("title", e.target.value)}
              />
              <div className="pr-char-count">
                {details.title.length}/100 · Min 10 characters
              </div>
            </div>

            {/* Category */}
            <div className="pr-form-group">
              <label htmlFor="pr-category">
                Category <span className="pr-required">*</span>
              </label>
              <div className="pr-select-wrap">
                <select
                  id="pr-category"
                  className="pr-select"
                  value={details.category}
                  onChange={(e) => handleDetailsChange("category", e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="pr-form-group">
              <label htmlFor="pr-desc">
                Description <span className="pr-required">*</span>
              </label>
              <textarea
                id="pr-desc"
                className="pr-textarea"
                rows={6}
                placeholder="Describe the task in detail. Include what you need done, any specific requirements, and what the helper will receive/need to deliver…"
                value={details.description}
                onChange={(e) => handleDetailsChange("description", e.target.value)}
              />
              <div className="pr-char-count">
                {details.description.length} characters · Min 50
              </div>
            </div>

            {/* Tags */}
            <div className="pr-form-group">
              <label>
                Skill Tags{" "}
                <span className="pr-label-hint">(up to 8 – helps helpers find your request)</span>
              </label>
              <div className="pr-tag-input-row">
                <input
                  type="text"
                  className="pr-input"
                  placeholder='e.g. "React", "Figma", "Copywriting" …'
                  value={details.tagInput}
                  onChange={(e) => handleDetailsChange("tagInput", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="pr-add-tag-btn"
                  onClick={addTag}
                  disabled={!details.tagInput.trim()}
                >
                  <IoAddOutline /> Add
                </button>
              </div>
              {details.tags.length > 0 && (
                <div className="pr-tags-preview">
                  {details.tags.map((tag) => (
                    <span key={tag} className="pr-tag-chip">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="pr-tag-remove" type="button">
                        <IoClose />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pr-form-actions">
              <div />
              <button
                className="pr-next-btn"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Next: Set Preferences <IoArrowForward />
              </button>
            </div>
          </div>
        )}

        {/* ════════════ STEP 2: Preferences ════════════ */}
        {step === 2 && (
          <div className="pr-form-card">
            <h2 className="pr-form-title">Request Preferences</h2>
            <p className="pr-form-subtitle">
              Configure how much you're offering and when you need it done.
            </p>

            {/* Reward Points */}
            <div className="pr-form-group">
              <label htmlFor="pr-points">
                <IoFlashOutline className="pr-label-icon" /> Reward Points Offered{" "}
                <span className="pr-required">*</span>
              </label>
              <div className="pr-pts-input-wrap">
                <input
                  id="pr-points"
                  type="number"
                  min={1}
                  max={999}
                  className="pr-input pr-pts-input"
                  placeholder="e.g. 100"
                  value={prefs.points}
                  onChange={(e) => handlePrefsChange("points", e.target.value)}
                />
                <span className="pr-pts-suffix">pts</span>
              </div>
              <div className="pr-tip">
                <IoInformationCircleOutline className="pr-tip-icon" />
                Higher points attract more experienced helpers. Consider what the task is worth.
              </div>
            </div>

            {/* Deadline */}
            <div className="pr-form-group">
              <label htmlFor="pr-deadline">
                <IoTimeOutline className="pr-label-icon" /> Deadline
              </label>
              <div className="pr-select-wrap">
                <select
                  id="pr-deadline"
                  className="pr-select"
                  value={prefs.deadline}
                  onChange={(e) => handlePrefsChange("deadline", e.target.value)}
                >
                  {DEADLINE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Urgency */}
            <div className="pr-form-group">
              <label>
                <IoAlertCircleOutline className="pr-label-icon" /> Urgency Level
              </label>
              <div className="pr-urgency-grid">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`pr-urgency-btn ${prefs.urgency === opt.value ? "pr-urgency-btn--active" : ""}`}
                    style={{ "--urgency-color": opt.color }}
                    onClick={() => handlePrefsChange("urgency", opt.value)}
                  >
                    <span className="pr-urgency-dot" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="pr-form-group">
              <label htmlFor="pr-location">
                <IoLocationOutline className="pr-label-icon" /> Location Preference
              </label>
              <div className="pr-location-grid">
                {["Remote", "Local", "Online", "Flexible"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    className={`pr-loc-btn ${prefs.location === loc ? "pr-loc-btn--active" : ""}`}
                    onClick={() => handlePrefsChange("location", loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="pr-form-actions">
              <button className="pr-back-btn-secondary" onClick={() => setStep(1)}>
                <IoArrowBack /> Back
              </button>
              <button
                className="pr-next-btn"
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Preview Request <IoArrowForward />
              </button>
            </div>
          </div>
        )}

        {/* ════════════ STEP 3: Preview ════════════ */}
        {step === 3 && (
          <div className="pr-form-card">
            <h2 className="pr-form-title">Preview Your Request</h2>
            <p className="pr-form-subtitle">
              This is how your request will appear to community helpers.
            </p>

            <div className="pr-preview-card">
              {/* Urgency */}
              {prefs.urgency === "high" && (
                <div className="pr-preview-urgency">🔥 Urgent</div>
              )}
              {prefs.urgency === "medium" && (
                <div className="pr-preview-urgency pr-preview-urgency--medium">⏳ Medium Priority</div>
              )}

              {/* Header */}
              <div className="pr-preview-header">
                <div className="pr-preview-avatar">
                  {details.title ? details.title.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                  <span className="pr-preview-poster">You</span>
                  <span className="pr-preview-meta-row">
                    <IoTimeOutline /> Just now
                  </span>
                </div>
              </div>

              {/* Category */}
              <span className="pr-preview-category">
                {details.category || "Category"}
              </span>

              {/* Title & Desc */}
              <h3 className="pr-preview-title">
                {details.title || "Your request title will appear here"}
              </h3>
              <p className="pr-preview-desc">
                {details.description || "Your description will appear here…"}
              </p>

              {/* Tags */}
              {details.tags.length > 0 && (
                <div className="pr-preview-tags">
                  {details.tags.map((tag) => (
                    <span key={tag} className="pr-preview-tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Meta row */}
              <div className="pr-preview-meta">
                <span className="pr-preview-meta-item">
                  <IoLocationOutline /> {prefs.location}
                </span>
                <span className="pr-preview-meta-item">
                  <IoTimeOutline /> Due: {prefs.deadline}
                </span>
              </div>

              {/* Footer */}
              <div className="pr-preview-footer">
                <div className="pr-preview-pts">
                  <IoFlashOutline /> {prefs.points || "—"} pts
                </div>
                <button className="pr-preview-apply" disabled>
                  Apply to Help <IoArrowForward />
                </button>
              </div>
            </div>

            <div className="pr-form-actions">
              <button className="pr-back-btn-secondary" onClick={() => setStep(2)}>
                <IoArrowBack /> Edit Preferences
              </button>
              <button className="pr-submit-btn" onClick={handleSubmit}>
                <IoHandLeftOutline /> Post Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostRequest;
