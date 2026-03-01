import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircle,
  IoFlashOutline,
  IoAddOutline,
  IoClose,
  IoInformationCircleOutline,
  IoStorefrontOutline,
  IoTimeOutline,
  IoRepeatOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";
import "./PostSkill.css";

const CATEGORIES = [
  "Development & IT",
  "Design & Creative",
  "Writing & Translation",
  "Sales & Marketing",
  "Finance & Accounting",
  "Admin & Customer Support",
  "Engineering & Architecture",
  "AI & Machine Learning",
  "Other",
];

const DELIVERY_OPTIONS = [1, 2, 3, 5, 7, 10, 14, 21, 30];
const REVISION_OPTIONS = ["1", "2", "3", "5", "Unlimited"];

const STEPS = [
  { id: 1, label: "Overview", icon: <IoDocumentTextOutline /> },
  { id: 2, label: "Packages", icon: <IoFlashOutline /> },
  { id: 3, label: "Preview", icon: <IoCheckmarkCircle /> },
];

const initialPackages = [
  { name: "Starter", pts: "", delivery: 3, revisions: "1", features: [""] },
  { name: "Standard", pts: "", delivery: 5, revisions: "3", features: [""] },
  { name: "Premium", pts: "", delivery: 7, revisions: "Unlimited", features: [""] },
];

const PostSkill = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  /* Step 1: Overview */
  const [overview, setOverview] = useState({
    title: "",
    category: "",
    description: "",
    tags: [],
    tagInput: "",
  });

  /* Step 2: Packages */
  const [packages, setPackages] = useState(initialPackages);

  const handleOverviewChange = (field, value) => {
    setOverview((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = overview.tagInput.trim();
    if (tag && !overview.tags.includes(tag) && overview.tags.length < 8) {
      setOverview((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tag) => {
    setOverview((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const updatePackage = (pkgIdx, field, value) => {
    setPackages((prev) =>
      prev.map((p, i) => (i === pkgIdx ? { ...p, [field]: value } : p))
    );
  };

  const updateFeature = (pkgIdx, featIdx, value) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? {
              ...p,
              features: p.features.map((f, fi) => (fi === featIdx ? value : f)),
            }
          : p
      )
    );
  };

  const addFeature = (pkgIdx) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx ? { ...p, features: [...p.features, ""] } : p
      )
    );
  };

  const removeFeature = (pkgIdx, featIdx) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? { ...p, features: p.features.filter((_, fi) => fi !== featIdx) }
          : p
      )
    );
  };

  const canProceedStep1 =
    overview.title.length >= 10 &&
    overview.category &&
    overview.description.length >= 50;

  const canProceedStep2 = packages.every(
    (p) => p.pts && parseInt(p.pts) > 0 && p.features.some((f) => f.trim())
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="post-skill-page">
        <div className="ps-success">
          <div className="ps-success-icon">
            <IoCheckmarkCircle />
          </div>
          <h2>Skill Posted Successfully!</h2>
          <p>
            Your skill is now live on the marketplace. Community members can
            browse and request it using their reward points.
          </p>
          <div className="ps-success-actions">
            <Link to="/skill-marketplace" className="ps-success-btn ps-success-btn--primary">
              <IoStorefrontOutline /> View Marketplace
            </Link>
            <button
              className="ps-success-btn ps-success-btn--outline"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setOverview({ title: "", category: "", description: "", tags: [], tagInput: "" });
                setPackages(initialPackages);
              }}
            >
              Post Another Skill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-skill-page">
      <div className="ps-container">
        {/* ── Header ── */}
        <div className="ps-header">
          <Link to="/skill-marketplace" className="ps-back-link">
            <IoArrowBack /> Back to Marketplace
          </Link>
          <div className="ps-header-text">
            <h1>Offer a Skill</h1>
            <p>Share your expertise and earn reward points from the community</p>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="ps-stepper">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={`ps-step ${step === s.id ? "active" : ""} ${
                  step > s.id ? "done" : ""
                }`}
              >
                <div className="ps-step-circle">
                  {step > s.id ? <IoCheckmarkCircle /> : s.icon}
                </div>
                <span className="ps-step-label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`ps-step-line ${step > s.id ? "done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ══════ STEP 1: Overview ══════ */}
        {step === 1 && (
          <div className="ps-form-card">
            <h2 className="ps-form-title">Skill Overview</h2>
            <p className="ps-form-subtitle">
              Give your skill a compelling title, category, and description.
            </p>

            {/* Title */}
            <div className="ps-form-group">
              <label htmlFor="ps-title">
                Skill Title
                <span className="ps-required">*</span>
              </label>
              <input
                id="ps-title"
                type="text"
                className="ps-input"
                placeholder='e.g. "I will build a modern React web application"'
                value={overview.title}
                maxLength={80}
                onChange={(e) => handleOverviewChange("title", e.target.value)}
              />
              <div className="ps-char-count">
                {overview.title.length}/80 · Min 10 characters
              </div>
            </div>

            {/* Category */}
            <div className="ps-form-group">
              <label htmlFor="ps-category">
                Category
                <span className="ps-required">*</span>
              </label>
              <div className="ps-select-wrap">
                <select
                  id="ps-category"
                  className="ps-select"
                  value={overview.category}
                  onChange={(e) => handleOverviewChange("category", e.target.value)}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="ps-form-group">
              <label htmlFor="ps-desc">
                Description
                <span className="ps-required">*</span>
              </label>
              <textarea
                id="ps-desc"
                className="ps-textarea"
                rows={6}
                placeholder="Describe what you offer, your experience, tools used, and what the requester will receive…"
                value={overview.description}
                onChange={(e) =>
                  handleOverviewChange("description", e.target.value)
                }
              />
              <div className="ps-char-count">
                {overview.description.length} characters · Min 50
              </div>
            </div>

            {/* Tags */}
            <div className="ps-form-group">
              <label>
                Skill Tags
                <span className="ps-label-hint">(up to 8)</span>
              </label>
              <div className="ps-tag-input-row">
                <input
                  type="text"
                  className="ps-input"
                  placeholder='e.g. "React", "Python", "Figma" …'
                  value={overview.tagInput}
                  onChange={(e) =>
                    handleOverviewChange("tagInput", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  className="ps-add-tag-btn"
                  onClick={addTag}
                  disabled={!overview.tagInput.trim()}
                >
                  <IoAddOutline /> Add
                </button>
              </div>
              {overview.tags.length > 0 && (
                <div className="ps-tags-preview">
                  {overview.tags.map((tag) => (
                    <span key={tag} className="ps-tag-chip">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ps-tag-remove"
                        type="button"
                      >
                        <IoClose />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="ps-form-actions">
              <div />
              <button
                className="ps-next-btn"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Next: Set Packages <IoArrowForward />
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 2: Packages ══════ */}
        {step === 2 && (
          <div className="ps-form-card">
            <h2 className="ps-form-title">Define Your Packages</h2>
            <p className="ps-form-subtitle">
              Set up three tiers of service. Reward points instead of money!
            </p>

            <div className="ps-packages-grid">
              {packages.map((pkg, pkgIdx) => (
                <div
                  key={pkg.name}
                  className={`ps-pkg-card ${pkgIdx === 1 ? "ps-pkg-card--popular" : ""}`}
                >
                  {pkgIdx === 1 && (
                    <div className="ps-pkg-popular-label">Most Popular</div>
                  )}
                  <h3 className="ps-pkg-name">{pkg.name}</h3>

                  {/* Reward Points */}
                  <div className="ps-form-group">
                    <label>
                      <IoFlashOutline className="ps-label-icon" /> Reward Points
                    </label>
                    <div className="ps-pts-input-wrap">
                      <input
                        type="number"
                        min={1}
                        max={999}
                        className="ps-input ps-pts-input"
                        placeholder="e.g. 80"
                        value={pkg.pts}
                        onChange={(e) =>
                          updatePackage(pkgIdx, "pts", e.target.value)
                        }
                      />
                      <span className="ps-pts-suffix">pts</span>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="ps-form-group">
                    <label>
                      <IoTimeOutline className="ps-label-icon" /> Delivery Time
                    </label>
                    <div className="ps-select-wrap">
                      <select
                        className="ps-select"
                        value={pkg.delivery}
                        onChange={(e) =>
                          updatePackage(pkgIdx, "delivery", parseInt(e.target.value))
                        }
                      >
                        {DELIVERY_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d} day{d !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Revisions */}
                  <div className="ps-form-group">
                    <label>
                      <IoRepeatOutline className="ps-label-icon" /> Revisions
                    </label>
                    <div className="ps-select-wrap">
                      <select
                        className="ps-select"
                        value={pkg.revisions}
                        onChange={(e) =>
                          updatePackage(pkgIdx, "revisions", e.target.value)
                        }
                      >
                        {REVISION_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r} revision{r !== "1" && r !== "Unlimited" ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="ps-form-group">
                    <label>What's Included</label>
                    <div className="ps-features-list">
                      {pkg.features.map((feat, featIdx) => (
                        <div key={featIdx} className="ps-feature-row">
                          <input
                            type="text"
                            className="ps-input"
                            placeholder={`Feature ${featIdx + 1}…`}
                            value={feat}
                            onChange={(e) =>
                              updateFeature(pkgIdx, featIdx, e.target.value)
                            }
                          />
                          {pkg.features.length > 1 && (
                            <button
                              type="button"
                              className="ps-remove-feature"
                              onClick={() => removeFeature(pkgIdx, featIdx)}
                            >
                              <IoClose />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="ps-add-feature-btn"
                      onClick={() => addFeature(pkgIdx)}
                      disabled={pkg.features.length >= 8}
                    >
                      <IoAddOutline /> Add Feature
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-tip">
              <IoInformationCircleOutline className="ps-tip-icon" />
              Tip: Your Standard package should offer the best value. Most community members will choose the middle tier.
            </div>

            <div className="ps-form-actions">
              <button className="ps-back-btn-secondary" onClick={() => setStep(1)}>
                <IoArrowBack /> Back
              </button>
              <button
                className="ps-next-btn"
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Preview Skill <IoArrowForward />
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 3: Preview ══════ */}
        {step === 3 && (
          <div className="ps-form-card">
            <h2 className="ps-form-title">Preview Your Skill</h2>
            <p className="ps-form-subtitle">
              This is how your skill will appear on the marketplace.
            </p>

            {/* Preview Card */}
            <div className="ps-preview-card">
              <div className="ps-preview-header">
                <div className="ps-preview-avatar">
                  {overview.title ? overview.title.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <span className="ps-preview-category">{overview.category || "Category"}</span>
                </div>
              </div>

              <h3 className="ps-preview-title">
                {overview.title || "Your skill title will appear here"}
              </h3>

              <p className="ps-preview-desc">
                {overview.description || "Your description will appear here…"}
              </p>

              {overview.tags.length > 0 && (
                <div className="ps-preview-tags">
                  {overview.tags.map((tag) => (
                    <span key={tag} className="ps-preview-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Package Summary */}
              <div className="ps-preview-packages">
                {packages.map((pkg, i) => (
                  <div
                    key={pkg.name}
                    className={`ps-preview-pkg ${i === 1 ? "ps-preview-pkg--popular" : ""}`}
                  >
                    <div className="ps-preview-pkg-name">{pkg.name}</div>
                    <div className="ps-preview-pkg-pts">
                      <IoFlashOutline />
                      {pkg.pts || "—"} pts
                    </div>
                    <div className="ps-preview-pkg-delivery">
                      <IoTimeOutline /> {pkg.delivery}d
                    </div>
                    <ul className="ps-preview-pkg-features">
                      {pkg.features
                        .filter((f) => f.trim())
                        .map((f, fi) => (
                          <li key={fi}>
                            <IoCheckmarkCircle className="ps-preview-check" /> {f}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="ps-form-actions">
              <button className="ps-back-btn-secondary" onClick={() => setStep(2)}>
                <IoArrowBack /> Edit Packages
              </button>
              <button className="ps-submit-btn" onClick={handleSubmit}>
                <IoStorefrontOutline /> Post to Marketplace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSkill;
