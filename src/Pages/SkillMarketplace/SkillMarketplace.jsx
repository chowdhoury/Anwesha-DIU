import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  IoSearch,
  IoFilterOutline,
  IoStarSharp,
  IoTimeOutline,
  IoPersonOutline,
  IoTrophyOutline,
  IoStorefrontOutline,
  IoArrowForward,
  IoCheckmarkCircle,
  IoClose,
  IoChevronDown,
  IoFlashOutline,
  IoGridOutline,
  IoListOutline,
} from "react-icons/io5";
import {
  FaCode,
  FaPaintBrush,
  FaPenFancy,
  FaBullhorn,
  FaChartLine,
  FaHeadset,
  FaMobileAlt,
  FaRobot,
} from "react-icons/fa";
import "./SkillMarketplace.css";

/* ─── Static Data ─────────────────────────────────── */
const categories = [
  { key: "all", label: "All Skills", icon: <IoGridOutline /> },
  { key: "dev", label: "Development", icon: <FaCode /> },
  { key: "design", label: "Design", icon: <FaPaintBrush /> },
  { key: "writing", label: "Writing", icon: <FaPenFancy /> },
  { key: "marketing", label: "Marketing", icon: <FaBullhorn /> },
  { key: "finance", label: "Finance", icon: <FaChartLine /> },
  { key: "support", label: "Support", icon: <FaHeadset /> },
  { key: "mobile", label: "Mobile", icon: <FaMobileAlt /> },
  { key: "ai", label: "AI / ML", icon: <FaRobot /> },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "low", label: "Lowest Reward" },
  { value: "high", label: "Highest Reward" },
];

const skills = [
  {
    id: "1",
    category: "dev",
    title: "Full-Stack Web Development",
    provider: "Arjun Patel",
    initials: "AP",
    avatarColor: "#14a800",
    rating: 4.9,
    reviews: 312,
    rewardPts: 120,
    deliveryDays: 3,
    tags: ["React", "Node.js", "MongoDB"],
    badge: "Top Rated",
    verified: true,
    description:
      "I'll build your complete web app with React frontend and Node.js/Express backend. API integration, auth, and deployment included.",
  },
  {
    id: "2",
    category: "design",
    title: "UI/UX Design & Figma Prototyping",
    provider: "Sneha Kapoor",
    initials: "SK",
    avatarColor: "#7c3aed",
    rating: 4.95,
    reviews: 218,
    rewardPts: 90,
    deliveryDays: 2,
    tags: ["Figma", "Wireframing", "Prototyping"],
    badge: "Rising Talent",
    verified: true,
    description:
      "Get stunning, user-centered UI/UX designs with full Figma files, style guides, and interactive prototypes.",
  },
  {
    id: "3",
    category: "writing",
    title: "Technical Blog Writing & SEO",
    provider: "Lena Schmidt",
    initials: "LS",
    avatarColor: "#0891b2",
    rating: 4.8,
    reviews: 145,
    rewardPts: 50,
    deliveryDays: 2,
    tags: ["SEO", "Blog Posts", "Technical Writing"],
    badge: null,
    verified: true,
    description:
      "Well-researched, SEO-optimized technical articles and blog posts. Niche topics welcome.",
  },
  {
    id: "4",
    category: "marketing",
    title: "Social Media Strategy & Growth",
    provider: "Omar Hassan",
    initials: "OH",
    avatarColor: "#ea580c",
    rating: 4.7,
    reviews: 99,
    rewardPts: 70,
    deliveryDays: 4,
    tags: ["Instagram", "TikTok", "Content Calendar"],
    badge: null,
    verified: false,
    description:
      "Full social media audit, content strategy, and a 30-day growth plan tailored to your brand.",
  },
  {
    id: "5",
    category: "ai",
    title: "Python ML Model Training & Deployment",
    provider: "Mei Lin",
    initials: "ML",
    avatarColor: "#db2777",
    rating: 4.92,
    reviews: 67,
    rewardPts: 200,
    deliveryDays: 7,
    tags: ["Python", "TensorFlow", "FastAPI"],
    badge: "Expert",
    verified: true,
    description:
      "I'll train, evaluate, and deploy your custom ML model with a REST API. Includes documentation.",
  },
  {
    id: "6",
    category: "dev",
    title: "WordPress Site Development",
    provider: "Carlos Ruiz",
    initials: "CR",
    avatarColor: "#0369a1",
    rating: 4.75,
    reviews: 423,
    rewardPts: 60,
    deliveryDays: 3,
    tags: ["WordPress", "Elementor", "WooCommerce"],
    badge: "Top Rated",
    verified: true,
    description:
      "Custom WordPress websites with responsive design, plugin setup, and speed optimization.",
  },
  {
    id: "7",
    category: "design",
    title: "Logo & Brand Identity Design",
    provider: "Fatima Al-Rashid",
    initials: "FA",
    avatarColor: "#d97706",
    rating: 4.88,
    reviews: 188,
    rewardPts: 80,
    deliveryDays: 2,
    tags: ["Logo", "Branding", "Adobe Illustrator"],
    badge: "Rising Talent",
    verified: true,
    description:
      "Modern logo design with brand guidelines: color palette, typography, and usage rules.",
  },
  {
    id: "8",
    category: "mobile",
    title: "Flutter Cross-Platform App Dev",
    provider: "Ravi Shankar",
    initials: "RS",
    avatarColor: "#059669",
    rating: 4.85,
    reviews: 134,
    rewardPts: 150,
    deliveryDays: 5,
    tags: ["Flutter", "Firebase", "iOS & Android"],
    badge: "Expert",
    verified: true,
    description:
      "Build a beautiful, performant Flutter app for both iOS and Android from a single codebase.",
  },
  {
    id: "9",
    category: "finance",
    title: "Financial Modeling & Excel Dashboards",
    provider: "Ingrid Björk",
    initials: "IB",
    avatarColor: "#7c3aed",
    rating: 4.82,
    reviews: 76,
    rewardPts: 110,
    deliveryDays: 3,
    tags: ["Excel", "DCF", "Financial Modeling"],
    badge: null,
    verified: true,
    description:
      "Professional financial models, DCF analysis, and interactive Excel dashboards for startups and SMEs.",
  },
  {
    id: "10",
    category: "support",
    title: "Customer Support Automation Setup",
    provider: "Kwame Asante",
    initials: "KA",
    avatarColor: "#ca8a04",
    rating: 4.6,
    reviews: 52,
    rewardPts: 45,
    deliveryDays: 2,
    tags: ["Intercom", "Zendesk", "Chatbots"],
    badge: null,
    verified: false,
    description:
      "Set up helpdesk workflows, chatbots, and automated responses to streamline your support team.",
  },
  {
    id: "11",
    category: "writing",
    title: "Resume & LinkedIn Profile Makeover",
    provider: "Aisha Williams",
    initials: "AW",
    avatarColor: "#0891b2",
    rating: 4.93,
    reviews: 291,
    rewardPts: 35,
    deliveryDays: 1,
    tags: ["Resume", "LinkedIn", "Career Coaching"],
    badge: "Top Rated",
    verified: true,
    description:
      "ATS-friendly resume writing and LinkedIn optimization to help you land more interviews.",
  },
  {
    id: "12",
    category: "ai",
    title: "ChatGPT / OpenAI API Integration",
    provider: "Dmitri Volkov",
    initials: "DV",
    avatarColor: "#be185d",
    rating: 4.78,
    reviews: 89,
    rewardPts: 100,
    deliveryDays: 3,
    tags: ["OpenAI", "LangChain", "API"],
    badge: "Rising Talent",
    verified: true,
    description:
      "Integrate ChatGPT or custom LLM workflows into your app using the OpenAI API and LangChain.",
  },
];

/* ─── Component ────────────────────────────────────── */
const SkillMarketplace = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [rewardRange, setRewardRange] = useState([0, 250]);
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...skills];

    if (activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (verifiedOnly) {
      list = list.filter((s) => s.verified);
    }
    list = list.filter(
      (s) => s.rewardPts >= rewardRange[0] && s.rewardPts <= rewardRange[1]
    );

    switch (sortBy) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "low":
        list.sort((a, b) => a.rewardPts - b.rewardPts);
        break;
      case "high":
        list.sort((a, b) => b.rewardPts - a.rewardPts);
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [activeCategory, searchQuery, sortBy, rewardRange, verifiedOnly]);

  return (
    <div className="marketplace-page">
      {/* ══════ HERO BANNER ══════ */}
      <section className="mp-hero">
        <div className="mp-hero-inner">
          <div className="mp-hero-text">
            <span className="mp-hero-eyebrow">
              <IoStorefrontOutline /> Skill Marketplace
            </span>
            <h1>Find the Perfect Skill,<br />Pay with Rewards</h1>
            <p>
              Browse hundreds of skills offered by talented community members.
              No money — just digital reward points.
            </p>
          </div>
          <div className="mp-hero-stats">
            <div className="mp-hero-stat">
              <span className="mp-hero-stat-num">5,000+</span>
              <span className="mp-hero-stat-label">Active Skills</span>
            </div>
            <div className="mp-hero-stat-divider" />
            <div className="mp-hero-stat">
              <span className="mp-hero-stat-num">4.9★</span>
              <span className="mp-hero-stat-label">Avg Rating</span>
            </div>
            <div className="mp-hero-stat-divider" />
            <div className="mp-hero-stat">
              <span className="mp-hero-stat-num">100%</span>
              <span className="mp-hero-stat-label">Reward-Based</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SEARCH BAR ══════ */}
      <div className="mp-search-bar-wrap">
        <div className="mp-search-bar">
          <IoSearch className="mp-search-icon" />
          <input
            type="text"
            className="mp-search-input"
            placeholder='Search skills, e.g. "React developer" or "Logo design" …'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mp-search-clear" onClick={() => setSearchQuery("")}>
              <IoClose />
            </button>
          )}
          <button className="mp-search-btn">Search</button>
        </div>
      </div>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="mp-body">
        {/* ── Sidebar ── */}
        <aside className={`mp-sidebar ${showFilters ? "mp-sidebar--open" : ""}`}>
          <div className="mp-sidebar-header">
            <span>Filters</span>
            <button className="mp-sidebar-close" onClick={() => setShowFilters(false)}>
              <IoClose />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mp-filter-group">
            <h4 className="mp-filter-title">Category</h4>
            <div className="mp-filter-cats">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`mp-filter-cat ${activeCategory === cat.key ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span className="mp-filter-cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reward Range */}
          <div className="mp-filter-group">
            <h4 className="mp-filter-title">Reward Points Range</h4>
            <div className="mp-reward-range">
              <div className="mp-reward-labels">
                <span>{rewardRange[0]} pts</span>
                <span>{rewardRange[1]} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={250}
                step={5}
                value={rewardRange[1]}
                className="mp-range-slider"
                onChange={(e) =>
                  setRewardRange([rewardRange[0], parseInt(e.target.value)])
                }
              />
            </div>
          </div>

          {/* Verified Toggle */}
          <div className="mp-filter-group">
            <h4 className="mp-filter-title">Provider</h4>
            <label className="mp-toggle-label">
              <div
                className={`mp-toggle ${verifiedOnly ? "mp-toggle--on" : ""}`}
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                <span className="mp-toggle-knob" />
              </div>
              Verified only
            </label>
          </div>

          <Link to="/post-skill" className="mp-post-skill-cta">
            <IoFlashOutline />
            Offer Your Skill
          </Link>
        </aside>

        {/* ── Main Listings ── */}
        <main className="mp-listings">
          {/* Toolbar */}
          <div className="mp-toolbar">
            <div className="mp-toolbar-left">
              <button
                className="mp-filter-toggle-btn"
                onClick={() => setShowFilters(true)}
              >
                <IoFilterOutline /> Filters
              </button>
              <span className="mp-result-count">
                <strong>{filtered.length}</strong> skills found
              </span>
            </div>
            <div className="mp-toolbar-right">
              <div className="mp-sort-wrap">
                <label>Sort by:</label>
                <div className="mp-sort-select-wrap">
                  <select
                    className="mp-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <IoChevronDown className="mp-sort-chevron" />
                </div>
              </div>
              <div className="mp-view-toggle">
                <button
                  className={`mp-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <IoGridOutline />
                </button>
                <button
                  className={`mp-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <IoListOutline />
                </button>
              </div>
            </div>
          </div>

          {/* Category Tabs (chips) */}
          <div className="mp-category-chips">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`mp-cat-chip ${activeCategory === cat.key ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid/List */}
          {filtered.length === 0 ? (
            <div className="mp-empty">
              <IoStorefrontOutline className="mp-empty-icon" />
              <h3>No skills found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button
                className="mp-empty-reset"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setVerifiedOnly(false);
                  setRewardRange([0, 250]);
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`mp-cards ${viewMode === "list" ? "mp-cards--list" : ""}`}>
              {filtered.map((skill) => (
                <SkillCard key={skill.id} skill={skill} listMode={viewMode === "list"} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ─── Skill Card ───────────────────────────────────── */
const SkillCard = ({ skill, listMode }) => (
  <Link
    to={`/skill/${skill.id}`}
    className={`mp-card ${listMode ? "mp-card--list" : ""}`}
  >
    {skill.badge && (
      <span
        className={`mp-card-badge ${
          skill.badge === "Top Rated"
            ? "mp-card-badge--gold"
            : skill.badge === "Expert"
            ? "mp-card-badge--blue"
            : "mp-card-badge--green"
        }`}
      >
        {skill.badge === "Top Rated" && <IoTrophyOutline />}
        {skill.badge}
      </span>
    )}

    <div className="mp-card-header">
      <div
        className="mp-card-avatar"
        style={{ background: skill.avatarColor }}
      >
        {skill.initials}
      </div>
      <div className="mp-card-provider-info">
        <span className="mp-card-provider">
          {skill.provider}
          {skill.verified && (
            <IoCheckmarkCircle className="mp-card-verified" />
          )}
        </span>
        <span className="mp-card-rating">
          <IoStarSharp className="mp-card-star" />
          {skill.rating.toFixed(1)}
          <span className="mp-card-reviews">({skill.reviews})</span>
        </span>
      </div>
    </div>

    <h3 className="mp-card-title">{skill.title}</h3>

    {listMode && <p className="mp-card-desc">{skill.description}</p>}

    <div className="mp-card-tags">
      {skill.tags.map((tag) => (
        <span key={tag} className="mp-card-tag">
          {tag}
        </span>
      ))}
    </div>

    <div className="mp-card-footer">
      <div className="mp-card-meta">
        <span className="mp-card-delivery">
          <IoTimeOutline /> {skill.deliveryDays}d delivery
        </span>
      </div>
      <div className="mp-card-reward">
        <IoFlashOutline className="mp-reward-icon" />
        <span className="mp-reward-num">{skill.rewardPts}</span>
        <span className="mp-reward-label">pts</span>
      </div>
    </div>

    <div className="mp-card-hover-cta">
      View Details <IoArrowForward />
    </div>
  </Link>
);

export default SkillMarketplace;
