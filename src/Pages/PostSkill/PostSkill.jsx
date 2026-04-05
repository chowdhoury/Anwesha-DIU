import React, { useState, useContext } from "react";
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
import { AuthContext } from "../../Authentication/AuthContext";
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
    "Elementor",
    "WooCommerce",
    "Shopify",
    "Flutter",
    "Firebase",
    "iOS & Android",
    "React Native",
    "Swift UI",
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

const FEATURES_BY_CATEGORY = {
  "Development & IT": [
    "Source code delivery",
    "Responsive design",
    "Database setup",
    "API integration",
    "Bug fixes included",
    "Documentation",
    "Deployment assistance",
    "Unit testing",
    "Code review",
    "Performance optimization",
    "Security audit",
    "SSL setup",
    "Hosting setup",
    "Admin panel",
    "User authentication",
  ],
  "Design & Creative": [
    "Source file (PSD/AI/Figma)",
    "High resolution files",
    "Multiple revisions",
    "Color variations",
    "Print-ready files",
    "Social media kit",
    "Brand guidelines",
    "Vector files",
    "Transparent background",
    "3D mockups",
    "Animated version",
    "Font files included",
    "Commercial use license",
    "Rush delivery available",
  ],
  "Writing & Translation": [
    "SEO optimized",
    "Plagiarism check",
    "Proofreading included",
    "Native speaker quality",
    "Research included",
    "Topic suggestions",
    "Multiple formats (Word, PDF)",
    "Headline variations",
    "Meta descriptions",
    "Keywords included",
    "Unlimited revisions",
    "Same-day delivery available",
    "Confidentiality assured",
  ],
  "Sales & Marketing": [
    "Target audience research",
    "Competitor analysis",
    "Campaign strategy",
    "A/B testing",
    "Analytics report",
    "Social media calendar",
    "Email templates",
    "Lead generation",
    "Conversion optimization",
    "Ad copywriting",
    "ROI tracking",
    "Monthly reports",
    "24/7 support",
  ],
  "Finance & Accounting": [
    "Financial statements",
    "Tax filing assistance",
    "Bookkeeping",
    "Budget planning",
    "Cash flow analysis",
    "Compliance check",
    "Audit support",
    "Excel templates",
    "Financial projections",
    "Invoice templates",
    "Expense tracking",
    "Confidential handling",
  ],
  "Admin & Customer Support": [
    "24/7 availability",
    "Email management",
    "Calendar management",
    "Data entry",
    "CRM updates",
    "Report generation",
    "Travel arrangements",
    "Meeting scheduling",
    "Follow-up emails",
    "Customer database management",
    "Live chat support",
    "Multilingual support",
  ],
  "Engineering & Architecture": [
    "CAD drawings",
    "3D renderings",
    "Technical specifications",
    "Material list",
    "Construction documents",
    "Site analysis",
    "Structural calculations",
    "As-built drawings",
    "Code compliance review",
    "Revision rounds",
    "Multiple file formats",
    "Consultation included",
  ],
  "AI & Machine Learning": [
    "Model training",
    "Data preprocessing",
    "Model deployment",
    "API endpoint",
    "Documentation",
    "Performance metrics",
    "Custom dataset handling",
    "Hyperparameter tuning",
    "Code walkthrough",
    "Jupyter notebooks",
    "Model optimization",
    "Integration support",
    "Maintenance guide",
  ],
  Other: [
    "Consultation included",
    "Unlimited revisions",
    "Fast delivery",
    "24/7 support",
    "Money-back guarantee",
    "Progress updates",
    "Custom requirements",
    "Confidentiality assured",
    "Dedicated support",
    "Quality assurance",
  ],
};

const STEPS = [
  { id: 1, label: "Overview", icon: <IoDocumentTextOutline /> },
  { id: 2, label: "Packages", icon: <IoFlashOutline /> },
  { id: 3, label: "Preview", icon: <IoCheckmarkCircle /> },
];

const initialPackages = [
  { name: "Starter", pts: "", delivery: 15, revisions: "2", features: [""] },
  { name: "Standard", pts: "", delivery: 10, revisions: "5", features: [""] },
  {
    name: "Premium",
    pts: "",
    delivery: 3,
    revisions: "Unlimited",
    features: [""],
  },
];

const PostSkill = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /* Step 1: Overview */
  const [overview, setOverview] = useState({
    title: "",
    category: "",
    description: "",
    tags: [],
    tagInput: "",
  });
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  /* Step 2: Packages */
  const [packages, setPackages] = useState(initialPackages);
  const [showFeatureDropdown, setShowFeatureDropdown] = useState({});

  // Get available features based on selected category
  const availableFeatures = overview.category
    ? FEATURES_BY_CATEGORY[overview.category] || FEATURES_BY_CATEGORY["Other"]
    : [];

  const selectFeature = (pkgIdx, feature) => {
    const pkg = packages[pkgIdx];
    // Find first empty slot or add new feature
    const emptyIndex = pkg.features.findIndex((f) => f === "");
    if (emptyIndex !== -1) {
      updateFeature(pkgIdx, emptyIndex, feature);
    } else if (pkg.features.length < 8) {
      setPackages((prev) =>
        prev.map((p, i) =>
          i === pkgIdx ? { ...p, features: [...p.features, feature] } : p,
        ),
      );
    }
    setShowFeatureDropdown((prev) => ({ ...prev, [pkgIdx]: false }));
  };

  const handleOverviewChange = (field, value) => {
    setOverview((prev) => {
      // Clear tags when category changes (skills are category-specific)
      if (field === "category" && prev.category !== value) {
        return { ...prev, [field]: value, tags: [], tagInput: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const selectTag = (tag) => {
    if (tag && !overview.tags.includes(tag) && overview.tags.length < 8) {
      setOverview((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
      setShowSkillDropdown(false);
    }
  };

  // Get skills based on selected category
  const availableSkills = overview.category
    ? SKILLS_BY_CATEGORY[overview.category] || []
    : [];

  const filteredSkills = availableSkills.filter(
    (skill) =>
      !overview.tags.includes(skill) &&
      skill.toLowerCase().includes(overview.tagInput.toLowerCase()),
  );

  const removeTag = (tag) => {
    setOverview((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const updatePackage = (pkgIdx, field, value) => {
    setPackages((prev) =>
      prev.map((p, i) => (i === pkgIdx ? { ...p, [field]: value } : p)),
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
          : p,
      ),
    );
  };

  const addFeature = (pkgIdx) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx ? { ...p, features: [...p.features, ""] } : p,
      ),
    );
  };

  const removeFeature = (pkgIdx, featIdx) => {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? { ...p, features: p.features.filter((_, fi) => fi !== featIdx) }
          : p,
      ),
    );
  };

  const canProceedStep1 =
    overview.title.length >= 10 &&
    overview.category &&
    overview.description.length >= 50;

  const canProceedStep2 = packages.every(
    (p) => p.pts && parseInt(p.pts) > 0 && p.features.some((f) => f.trim()),
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Build professional JSON payload
    const skillData = {
      // Skill Overview
      title: overview.title.trim(),
      category: overview.category,
      description: overview.description.trim(),
      tags: overview.tags,

      // Pricing Packages
      packages: packages.map((pkg) => ({
        name: pkg.name,
        price: parseInt(pkg.pts),
        deliveryDays: pkg.delivery,
        revisions: pkg.revisions,
        features: pkg.features.filter((f) => f.trim()),
      })),

      // Seller Information
      seller: {
        id: user?.uid || null,
        name: user?.displayName || "Anonymous",
        email: user?.email || null,
        photoURL: user?.photoURL || null,
      },

      // Metadata
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3000/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      if (!response.ok) {
        throw new Error(`Failed to post skill: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Skill posted successfully:", result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error posting skill:", error);
      setSubmitError(
        error.message || "Failed to post skill. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <Link to="/" className="ps-success-btn ps-success-btn--outline">
              <IoArrowBack /> Back to Home
            </Link>
            <Link
              to="/skill-marketplace"
              className="ps-success-btn ps-success-btn--primary"
            >
              <IoStorefrontOutline /> My all Skills
            </Link>
            <button
              className="ps-success-btn ps-success-btn--outline"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setOverview({
                  title: "",
                  category: "",
                  description: "",
                  tags: [],
                  tagInput: "",
                });
                setPackages(initialPackages);
              }}
            >
              <IoAddOutline /> Offer Another Skill
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
            <p>
              Share your expertise and earn reward points from the community
            </p>
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
                placeholder='e.g. "Full-Stack Web Development"'
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
                  onChange={(e) =>
                    handleOverviewChange("category", e.target.value)
                  }
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
              <div className="ps-skill-select-wrapper">
                <input
                  type="text"
                  className="ps-input"
                  placeholder={
                    overview.category
                      ? "Search and select skills..."
                      : "Please select a category first"
                  }
                  value={overview.tagInput}
                  onChange={(e) => {
                    handleOverviewChange("tagInput", e.target.value);
                    setShowSkillDropdown(true);
                  }}
                  onFocus={() => setShowSkillDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSkillDropdown(false), 200)
                  }
                  disabled={!overview.category || overview.tags.length >= 8}
                />
                {showSkillDropdown && filteredSkills.length > 0 && (
                  <div className="ps-skill-dropdown">
                    {filteredSkills.slice(0, 10).map((skill) => (
                      <div
                        key={skill}
                        className="ps-skill-option"
                        onMouseDown={() => selectTag(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}
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
                        placeholder={
                          pkg.name === "Starter"
                            ? "e.g. 50"
                            : pkg.name === "Standard"
                              ? "e.g. 100"
                              : "e.g. 200"
                        }
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
                          updatePackage(
                            pkgIdx,
                            "delivery",
                            parseInt(e.target.value),
                          )
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
                            {r} revision
                            {r !== "1" && r !== "Unlimited" ? "s" : ""}
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
                    <div className="ps-feature-actions">
                      <button
                        type="button"
                        className="ps-add-feature-btn"
                        onClick={() => addFeature(pkgIdx)}
                        disabled={pkg.features.length >= 8}
                      >
                        <IoAddOutline /> Add Feature
                      </button>
                      {overview.category && (
                        <div className="ps-feature-suggestions">
                          <button
                            type="button"
                            className="ps-suggest-feature-btn"
                            onClick={() =>
                              setShowFeatureDropdown((prev) => ({
                                ...prev,
                                [pkgIdx]: !prev[pkgIdx],
                              }))
                            }
                            disabled={pkg.features.length >= 8}
                          >
                            <IoFlashOutline /> Suggest Features
                          </button>
                          {showFeatureDropdown[pkgIdx] && (
                            <div className="ps-feature-dropdown">
                              <div className="ps-feature-dropdown-header">
                                Suggested for {overview.category}
                              </div>
                              {availableFeatures
                                .filter((f) => !pkg.features.includes(f))
                                .map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className="ps-feature-dropdown-item"
                                    onClick={() =>
                                      selectFeature(pkgIdx, feature)
                                    }
                                  >
                                    {feature}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ps-tip">
              <IoInformationCircleOutline className="ps-tip-icon" />
              Tip: Your Standard package should offer the best value. Most
              community members will choose the middle tier.
            </div>

            <div className="ps-form-actions">
              <button
                className="ps-back-btn-secondary"
                onClick={() => setStep(1)}
              >
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
                  {overview.title
                    ? overview.title.charAt(0).toUpperCase()
                    : "S"}
                </div>
                <div>
                  <span className="ps-preview-category">
                    {overview.category || "Category"}
                  </span>
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
                            <IoCheckmarkCircle className="ps-preview-check" />{" "}
                            {f}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {submitError && (
              <div className="ps-error-message">{submitError}</div>
            )}

            <div className="ps-form-actions">
              <button
                className="ps-back-btn-secondary"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
              >
                <IoArrowBack /> Edit Packages
              </button>
              <button
                className="ps-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Posting..."
                ) : (
                  <>
                    <IoStorefrontOutline /> Post to Marketplace
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSkill;
