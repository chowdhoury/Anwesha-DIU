import React, { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import {
  IoSearch,
  IoFilterOutline,
  IoStarSharp,
  IoTimeOutline,
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
  FaFileAlt,
  FaMobileAlt,
  FaRobot,
} from "react-icons/fa";
import "./SkillMarketplace.css";

/* ─── Static Data ─────────────────────────────────── */
const categories = [
  { key: "all", label: "All Skills", icon: <IoGridOutline /> },
  { key: "dev", label: "Development & IT", icon: <FaCode /> },
  { key: "design", label: "Design & Creative", icon: <FaPaintBrush /> },
  { key: "writing", label: "Writing & Translation", icon: <FaPenFancy /> },
  { key: "marketing", label: "Sales & Marketing", icon: <FaBullhorn /> },
  { key: "finance", label: "Finance & Accounting", icon: <FaChartLine /> },
  { key: "support", label: "Admin & Customer Support", icon: <FaHeadset /> },
  {
    key: "engineering",
    label: "Engineering & Architecture",
    icon: <FaFileAlt />,
  },
  { key: "mobile", label: "Mobile", icon: <FaMobileAlt /> },
  { key: "ai", label: "AI & Machine Learning", icon: <FaRobot /> },
];

const categoryQueryMap = categories.reduce((accumulator, category) => {
  accumulator[category.label.toLowerCase()] = category.key;
  return accumulator;
}, {});

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
  { value: "low", label: "Lowest Reward" },
  { value: "high", label: "Highest Reward" },
];

// Map API category to component category key
const mapCategory = (apiCategory) => {
  const categoryMap = {
    "Development & IT": "dev",
    Design: "design",
    "Design & Creative": "design",
    Writing: "writing",
    "Writing & Translation": "writing",
    Marketing: "marketing",
    "Sales & Marketing": "marketing",
    Finance: "finance",
    "Finance & Accounting": "finance",
    Support: "support",
    "Admin & Customer Support": "support",
    "Engineering & Architecture": "engineering",
    Mobile: "mobile",
    "AI / ML": "ai",
    "AI & Machine Learning": "ai",
  };
  return categoryMap[apiCategory] || "all";
};

// Generate consistent avatar color from name
const generateAvatarColor = (name) => {
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
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

/* ─── Component ────────────────────────────────────── */
const SkillMarketplace = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory =
    categoryQueryMap[searchParams.get("category")?.toLowerCase()] || "all";

  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    fetch("http://localhost:3000/skills")
      .then((response) => response.json())
      .then((data) => {
        // Transform API data to match component expected format
        const transformedSkills = data.map((skill) => {
          const starterPackage =
            skill.packages?.find((p) => p.name === "Starter") ||
            skill.packages?.[0];
          const sellerName = skill.seller?.name || "Unknown";
          const initials = sellerName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return {
            id: skill._id,
            title: skill.title,
            category: mapCategory(skill.category),
            description: skill.description,
            tags: skill.tags || [],
            provider: sellerName,
            verified: skill.status === "active",
            rating: skill.rating || 4.5,
            reviews: skill.reviews || 0,
            rewardPts: starterPackage?.price || 0,
            deliveryDays: starterPackage?.deliveryDays || 7,
            avatarColor: generateAvatarColor(sellerName),
            initials: initials,
            badge: null,
          };
        });
        setSkills(transformedSkills);
      })
      .catch((error) => console.error("Failed to fetch skills:", error));
  }, []);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
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
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (verifiedOnly) {
      list = list.filter((s) => s.verified);
    }
    list = list.filter(
      (s) => s.rewardPts >= rewardRange[0] && s.rewardPts <= rewardRange[1],
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
  }, [skills, activeCategory, searchQuery, sortBy, rewardRange, verifiedOnly]);

  return (
    <div className="marketplace-page">
      {/* ══════ HERO BANNER ══════ */}
      <section className="mp-hero">
        <div className="mp-hero-inner">
          <div className="mp-hero-text">
            <span className="mp-hero-eyebrow">
              <IoStorefrontOutline /> Skill Marketplace
            </span>
            <h1>
              Find the Perfect Skill,
              <br />
              Pay with Rewards
            </h1>
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
            <button
              className="mp-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <IoClose />
            </button>
          )}
          <button className="mp-search-btn">Search</button>
        </div>
      </div>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="mp-body">
        {/* ── Sidebar ── */}
        <aside
          className={`mp-sidebar ${showFilters ? "mp-sidebar--open" : ""}`}
        >
          <div className="mp-sidebar-header">
            <span>Filters</span>
            <button
              className="mp-sidebar-close"
              onClick={() => setShowFilters(false)}
            >
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
            <div
              className={`mp-cards ${viewMode === "list" ? "mp-cards--list" : ""}`}
            >
              {filtered.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  listMode={viewMode === "list"}
                />
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
      <div className="mp-card-avatar" style={{ background: skill.avatarColor }}>
        {skill.initials}
      </div>
      <div className="mp-card-provider-info">
        <span className="mp-card-provider">
          {skill.provider}
          {skill.verified && <IoCheckmarkCircle className="mp-card-verified" />}
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
