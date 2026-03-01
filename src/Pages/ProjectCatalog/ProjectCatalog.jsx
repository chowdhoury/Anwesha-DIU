import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  IoSearch,
  IoClose,
  IoFlashOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoFilterOutline,
  IoArrowForward,
  IoGridOutline,
  IoListOutline,
  IoChevronDown,
  IoBookmarkOutline,
  IoBookmark,
  IoAlertCircleOutline,
  IoCheckmarkDoneCircleOutline,
  IoHourglassOutline,
  IoFolderOpenOutline,
} from "react-icons/io5";
import {
  FaCode,
  FaPaintBrush,
  FaChartLine,
  FaBullhorn,
  FaHeadset,
  FaMobileAlt,
  FaRobot,
  FaPenFancy,
} from "react-icons/fa";
import "./ProjectCatalog.css";

/* ─── Static Data ─────────────────────────────────── */
const categories = [
  { key: "all", label: "All Projects", icon: <IoFolderOpenOutline /> },
  { key: "dev", label: "Development", icon: <FaCode /> },
  { key: "design", label: "Design", icon: <FaPaintBrush /> },
  { key: "writing", label: "Writing", icon: <FaPenFancy /> },
  { key: "marketing", label: "Marketing", icon: <FaBullhorn /> },
  { key: "finance", label: "Finance", icon: <FaChartLine /> },
  { key: "support", label: "Support", icon: <FaHeadset /> },
  { key: "mobile", label: "Mobile", icon: <FaMobileAlt /> },
  { key: "ai", label: "AI / ML", icon: <FaRobot /> },
];

const STATUS = {
  open: { label: "Open", color: "#14a800", icon: <IoCheckmarkDoneCircleOutline /> },
  inprogress: { label: "In Progress", color: "#f59e0b", icon: <IoHourglassOutline /> },
  urgent: { label: "Urgent", color: "#ef4444", icon: <IoAlertCircleOutline /> },
};

const projects = [
  {
    id: "p1",
    category: "dev",
    title: "Build a React Dashboard for Analytics SaaS",
    description: "Looking for a skilled React dev to build a comprehensive analytics dashboard with charts, filters, and real-time data integration via REST API.",
    postedBy: "Arjun Patel",
    initials: "AP",
    avatarColor: "#14a800",
    rewardPts: 250,
    deadline: "5 days",
    applicants: 8,
    skills: ["React", "Chart.js", "REST API"],
    status: "open",
    saved: false,
  },
  {
    id: "p2",
    category: "design",
    title: "Redesign Mobile App UI — Fintech Startup",
    description: "Need a UX/UI designer to revamp our mobile banking app. Deliverables: Figma screens, design system, and interactive prototype.",
    postedBy: "Sneha Kapoor",
    initials: "SK",
    avatarColor: "#7c3aed",
    rewardPts: 180,
    deadline: "3 days",
    applicants: 14,
    skills: ["Figma", "Mobile UI", "Design System"],
    status: "urgent",
    saved: false,
  },
  {
    id: "p3",
    category: "writing",
    title: "Write 5 SEO-Optimized Tech Blog Posts",
    description: "Seeking an experienced content writer to produce in-depth, SEO-optimized blog articles (2,000+ words each) on cloud computing topics.",
    postedBy: "Lena Schmidt",
    initials: "LS",
    avatarColor: "#0891b2",
    rewardPts: 90,
    deadline: "7 days",
    applicants: 5,
    skills: ["SEO", "Technical Writing", "Cloud"],
    status: "open",
    saved: true,
  },
  {
    id: "p4",
    category: "ai",
    title: "Train Custom NLP Model for Sentiment Analysis",
    description: "Need an ML engineer to fine-tune a BERT model for domain-specific sentiment classification. Dataset provided. FastAPI endpoint required.",
    postedBy: "Mei Lin",
    initials: "ML",
    avatarColor: "#db2777",
    rewardPts: 400,
    deadline: "10 days",
    applicants: 3,
    skills: ["Python", "BERT", "FastAPI"],
    status: "open",
    saved: false,
  },
  {
    id: "p5",
    category: "mobile",
    title: "Flutter E-Commerce App — Phase 2 Features",
    description: "Continuing development on our Flutter shopping app. Phase 2 includes a wishlist, order tracking, and push notifications via Firebase.",
    postedBy: "Ravi Shankar",
    initials: "RS",
    avatarColor: "#059669",
    rewardPts: 320,
    deadline: "8 days",
    applicants: 6,
    skills: ["Flutter", "Firebase", "Push Notifications"],
    status: "inprogress",
    saved: false,
  },
  {
    id: "p6",
    category: "marketing",
    title: "30-Day Social Media Content Calendar",
    description: "Create a strategic content calendar for our brand across Instagram, LinkedIn, and TikTok. Includes captions, hashtag research, and post design briefs.",
    postedBy: "Omar Hassan",
    initials: "OH",
    avatarColor: "#ea580c",
    rewardPts: 110,
    deadline: "4 days",
    applicants: 11,
    skills: ["Content Strategy", "Instagram", "TikTok"],
    status: "urgent",
    saved: true,
  },
  {
    id: "p7",
    category: "finance",
    title: "Build a 5-Year Financial Model for Seed Round",
    description: "Seeking a finance professional to build a detailed financial model (P&L, cash flow, cap table) suitable for our upcoming seed fundraise.",
    postedBy: "Ingrid Björk",
    initials: "IB",
    avatarColor: "#7c3aed",
    rewardPts: 220,
    deadline: "6 days",
    applicants: 4,
    skills: ["Excel", "DCF", "Startup Finance"],
    status: "open",
    saved: false,
  },
  {
    id: "p8",
    category: "design",
    title: "Brand Identity Kit — Sustainable Fashion Brand",
    description: "Full brand identity design including logo, color palette, typography, packaging mockups, and a brand guidelines PDF.",
    postedBy: "Fatima Al-Rashid",
    initials: "FA",
    avatarColor: "#d97706",
    rewardPts: 160,
    deadline: "5 days",
    applicants: 9,
    skills: ["Logo Design", "Branding", "Illustrator"],
    status: "open",
    saved: false,
  },
];

/* ─── Component ────────────────────────────────────── */
const ProjectCatalog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [savedItems, setSavedItems] = useState(
    projects.filter((p) => p.saved).map((p) => p.id)
  );

  const toggleSave = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    let list = [...projects];
    if (activeCategory !== "all")
      list = list.filter((p) => p.category === activeCategory);
    if (statusFilter !== "all")
      list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "reward_high":
        list.sort((a, b) => b.rewardPts - a.rewardPts);
        break;
      case "reward_low":
        list.sort((a, b) => a.rewardPts - b.rewardPts);
        break;
      case "deadline":
        list.sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline));
        break;
      case "applicants":
        list.sort((a, b) => b.applicants - a.applicants);
        break;
      default:
        list.sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)));
    }
    return list;
  }, [search, activeCategory, sortBy, statusFilter]);

  return (
    <div className="pc-page">
      {/* ══════ HERO ══════ */}
      <section className="pc-hero">
        <div className="pc-hero-inner">
          <div className="pc-hero-text">
            <span className="pc-hero-eyebrow">
              <IoFolderOpenOutline /> Project Catalog
            </span>
            <h1>
              Browse Active Projects,<br />
              <em>Apply & Earn Rewards</em>
            </h1>
            <p>
              Discover real projects posted by your community. Apply your
              skills, complete the work, and earn reward points.
            </p>
          </div>
          <div className="pc-hero-stats">
            <div className="pc-stat">
              <span className="pc-stat-num">340+</span>
              <span className="pc-stat-label">Active Projects</span>
            </div>
            <div className="pc-stat-divider" />
            <div className="pc-stat">
              <span className="pc-stat-num">24h</span>
              <span className="pc-stat-label">Avg Response</span>
            </div>
            <div className="pc-stat-divider" />
            <div className="pc-stat">
              <span className="pc-stat-num">50K+</span>
              <span className="pc-stat-label">Pts Awarded</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SEARCH BAR ══════ */}
      <div className="pc-search-wrap">
        <div className="pc-search-bar">
          <IoSearch className="pc-search-icon" />
          <input
            type="text"
            className="pc-search-input"
            placeholder='Search projects by title, skill, or keyword…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="pc-search-clear" onClick={() => setSearch("")}>
              <IoClose />
            </button>
          )}
          <button className="pc-search-btn">Search</button>
        </div>
      </div>

      {/* ══════ BODY ══════ */}
      <div className="pc-body">
        {/* Sidebar */}
        <aside className={`pc-sidebar ${showFilters ? "pc-sidebar--open" : ""}`}>
          <div className="pc-sidebar-header">
            <span>Filters</span>
            <button className="pc-sidebar-close" onClick={() => setShowFilters(false)}>
              <IoClose />
            </button>
          </div>

          <div className="pc-filter-group">
            <h4 className="pc-filter-title">Category</h4>
            <div className="pc-filter-cats">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`pc-filter-cat ${activeCategory === cat.key ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat.key)}
                >
                  <span className="pc-filter-cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pc-filter-group">
            <h4 className="pc-filter-title">Status</h4>
            <div className="pc-status-btns">
              {["all", "open", "urgent", "inprogress"].map((s) => (
                <button
                  key={s}
                  className={`pc-status-btn ${statusFilter === s ? "active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === "all"
                    ? "All Statuses"
                    : STATUS[s].label}
                </button>
              ))}
            </div>
          </div>

          <Link to="/post-request" className="pc-post-project-cta">
            <IoFlashOutline />
            Post a Project
          </Link>
        </aside>

        {/* Main */}
        <main className="pc-listings">
          {/* Toolbar */}
          <div className="pc-toolbar">
            <div className="pc-toolbar-left">
              <button className="pc-filter-toggle-btn" onClick={() => setShowFilters(true)}>
                <IoFilterOutline /> Filters
              </button>
              <span className="pc-result-count">
                <strong>{filtered.length}</strong> projects found
              </span>
            </div>
            <div className="pc-toolbar-right">
              <div className="pc-sort-wrap">
                <label>Sort:</label>
                <div className="pc-sort-select-wrap">
                  <select
                    className="pc-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="reward_high">Highest Reward</option>
                    <option value="reward_low">Lowest Reward</option>
                    <option value="deadline">Soonest Deadline</option>
                    <option value="applicants">Most Applicants</option>
                  </select>
                  <IoChevronDown className="pc-sort-chevron" />
                </div>
              </div>
              <div className="pc-view-toggle">
                <button
                  className={`pc-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <IoGridOutline />
                </button>
                <button
                  className={`pc-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <IoListOutline />
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="pc-chips">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`pc-chip ${activeCategory === cat.key ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="pc-empty">
              <IoFolderOpenOutline className="pc-empty-icon" />
              <h3>No projects found</h3>
              <p>Try adjusting your filters or search.</p>
              <button
                className="pc-empty-reset"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`pc-cards ${viewMode === "list" ? "pc-cards--list" : ""}`}>
              {filtered.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  isSaved={savedItems.includes(p.id)}
                  onToggleSave={toggleSave}
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

/* ─── Project Card ─────────────────────────────────── */
const ProjectCard = ({ project, isSaved, onToggleSave, listMode }) => {
  const st = STATUS[project.status];
  return (
    <div className={`pc-card ${listMode ? "pc-card--list" : ""}`}>
      <div className="pc-card-top">
        <span
          className="pc-card-status-badge"
          style={{ background: `${st.color}22`, color: st.color, borderColor: `${st.color}44` }}
        >
          {st.icon} {st.label}
        </span>
        <button
          className={`pc-save-btn ${isSaved ? "pc-save-btn--saved" : ""}`}
          onClick={(e) => onToggleSave(project.id, e)}
          aria-label="Save project"
        >
          {isSaved ? <IoBookmark /> : <IoBookmarkOutline />}
        </button>
      </div>

      <h3 className="pc-card-title">{project.title}</h3>
      {listMode && <p className="pc-card-desc">{project.description}</p>}

      <div className="pc-card-skills">
        {project.skills.map((s) => (
          <span key={s} className="pc-card-skill">{s}</span>
        ))}
      </div>

      <div className="pc-card-poster">
        <div
          className="pc-card-avatar"
          style={{ background: project.avatarColor }}
        >
          {project.initials}
        </div>
        <span className="pc-card-poster-name">{project.postedBy}</span>
      </div>

      <div className="pc-card-footer">
        <div className="pc-card-meta">
          <span><IoTimeOutline /> {project.deadline} left</span>
          <span><IoPersonOutline /> {project.applicants} applicants</span>
        </div>
        <div className="pc-card-reward">
          <IoFlashOutline className="pc-reward-icon" />
          <span className="pc-reward-num">{project.rewardPts}</span>
          <span className="pc-reward-label">pts</span>
        </div>
      </div>

      <Link to="/post-request" className="pc-card-cta">
        Apply Now <IoArrowForward />
      </Link>
    </div>
  );
};

export default ProjectCatalog;
