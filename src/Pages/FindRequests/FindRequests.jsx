import React, { useState } from "react";
import { Link } from "react-router";
import {
  IoSearchOutline,
  IoFilterOutline,
  IoFlashOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoStarOutline,
  IoArrowForward,
  IoBookmarkOutline,
  IoPersonOutline,
  IoCashOutline,
  IoGridOutline,
  IoListOutline,
} from "react-icons/io5";
import "./FindRequests.css";

/* ─── Static Data ──────────────────── */
const CATEGORIES = ["All", "Tech", "Design", "Writing", "Education", "Music", "Business", "Lifestyle"];

const REQUESTS = [
  {
    id: 1,
    title: "Need a React Developer to Fix Auth Flow",
    category: "Tech",
    poster: "Sneha K.",
    initials: "SK",
    avatarColor: "#7c3aed",
    location: "Remote",
    postedAgo: "2h ago",
    deadline: "3 days",
    points: 120,
    rating: 4.8,
    desc: "Looking for someone to fix a Firebase authentication bug in my React app. The sign-up flow breaks on mobile.",
    tags: ["React", "Firebase", "Auth"],
    urgency: "high",
  },
  {
    id: 2,
    title: "Logo & Brand Identity Design",
    category: "Design",
    poster: "Omar H.",
    initials: "OH",
    avatarColor: "#ea580c",
    location: "Remote",
    postedAgo: "5h ago",
    deadline: "1 week",
    points: 90,
    rating: 4.6,
    desc: "I need a modern logo for my startup. Looking for a clean, minimal aesthetic with a green color palette.",
    tags: ["Figma", "Branding", "Logo"],
    urgency: "medium",
  },
  {
    id: 3,
    title: "Proofreading & Editing for Research Paper",
    category: "Writing",
    poster: "Carlos R.",
    initials: "CR",
    avatarColor: "#0369a1",
    location: "Remote",
    postedAgo: "1d ago",
    deadline: "5 days",
    points: 60,
    rating: 4.9,
    desc: "Need someone with academic writing experience to proofread my 15-page research paper on machine learning ethics.",
    tags: ["Academic", "Proofreading", "ML"],
    urgency: "low",
  },
  {
    id: 4,
    title: "Guitar Lessons for Beginner (Online)",
    category: "Music",
    poster: "Mei L.",
    initials: "ML",
    avatarColor: "#db2777",
    location: "Online",
    postedAgo: "3h ago",
    deadline: "Flexible",
    points: 50,
    rating: 4.7,
    desc: "Looking for a patient guitar teacher for weekly online lessons. I'm a complete beginner and want to learn pop songs.",
    tags: ["Guitar", "Beginner", "Weekly"],
    urgency: "low",
  },
  {
    id: 5,
    title: "Python Data Analysis – CSV Dashboard",
    category: "Tech",
    poster: "Fatima A.",
    initials: "FA",
    avatarColor: "#d97706",
    location: "Remote",
    postedAgo: "6h ago",
    deadline: "2 days",
    points: 200,
    rating: 4.5,
    desc: "Need a Python script or Jupyter notebook to analyze sales data from CSV files and generate charts using Pandas and Matplotlib.",
    tags: ["Python", "Pandas", "Data"],
    urgency: "high",
  },
  {
    id: 6,
    title: "Business Plan Review & Feedback",
    category: "Business",
    poster: "Ravi S.",
    initials: "RS",
    avatarColor: "#059669",
    location: "Remote",
    postedAgo: "2d ago",
    deadline: "1 week",
    points: 80,
    rating: 4.4,
    desc: "I've written a business plan for a SaaS product and need an experienced entrepreneur or business analyst to review it.",
    tags: ["Business", "SaaS", "Strategy"],
    urgency: "medium",
  },
];

const SORT_OPTIONS = ["Newest", "Most Points", "Urgent First", "Top Rated"];

/* ─── Component ─────────────────────── */
const FindRequests = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [bookmarked, setBookmarked] = useState([]);

  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const filtered = REQUESTS.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "All" || r.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="fr-page">
      {/* ══════ HERO ══════ */}
      <section className="fr-hero">
        <div className="fr-hero-bg-orbs">
          <span className="fr-orb fr-orb--1" />
          <span className="fr-orb fr-orb--2" />
        </div>
        <div className="fr-hero-inner">
          <span className="fr-hero-eyebrow">
            <IoFlashOutline /> Open Requests
          </span>
          <h1>
            Find Someone to Help.<br />
            <span className="fr-hero-gradient">Earn Rewards.</span>
          </h1>
          <p>
            Browse real requests from community members. Pick a task, deliver
            quality help, and earn reward points instantly.
          </p>
          {/* Search */}
          <div className="fr-search-bar">
            <IoSearchOutline className="fr-search-icon" />
            <input
              type="text"
              placeholder="Search by skill, topic, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="fr-search-input"
            />
          </div>
        </div>
      </section>

      {/* ══════ CONTENT ══════ */}
      <section className="fr-content">
        <div className="fr-content-inner">
          {/* Toolbar */}
          <div className="fr-toolbar">
            <div className="fr-categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`fr-cat-btn ${activeCategory === cat ? "fr-cat-btn--active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="fr-toolbar-right">
              <select
                className="fr-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <div className="fr-view-toggle">
                <button
                  className={`fr-view-btn ${viewMode === "grid" ? "fr-view-btn--active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <IoGridOutline />
                </button>
                <button
                  className={`fr-view-btn ${viewMode === "list" ? "fr-view-btn--active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <IoListOutline />
                </button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="fr-results-count">
            <span>{filtered.length} open request{filtered.length !== 1 ? "s" : ""}</span>
            {activeCategory !== "All" && (
              <span className="fr-results-cat"> in <strong>{activeCategory}</strong></span>
            )}
          </div>

          {/* Cards Grid / List */}
          {filtered.length > 0 ? (
            <div className={`fr-cards ${viewMode === "list" ? "fr-cards--list" : ""}`}>
              {filtered.map((req) => (
                <div key={req.id} className={`fr-card ${viewMode === "list" ? "fr-card--list" : ""}`}>
                  {/* Urgency indicator */}
                  {req.urgency === "high" && (
                    <div className="fr-urgency-badge">🔥 Urgent</div>
                  )}

                  {/* Card Header */}
                  <div className="fr-card-header">
                    <div className="fr-poster">
                      <div
                        className="fr-poster-avatar"
                        style={{ background: req.avatarColor }}
                      >
                        {req.initials}
                      </div>
                      <div>
                        <span className="fr-poster-name">{req.poster}</span>
                        <span className="fr-poster-rating">
                          <IoStarOutline /> {req.rating}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`fr-bookmark-btn ${bookmarked.includes(req.id) ? "fr-bookmark-btn--saved" : ""}`}
                      onClick={() => toggleBookmark(req.id)}
                      aria-label="Bookmark request"
                    >
                      <IoBookmarkOutline />
                    </button>
                  </div>

                  {/* Category pill */}
                  <span className="fr-category-pill">{req.category}</span>

                  {/* Title & Desc */}
                  <h3 className="fr-card-title">{req.title}</h3>
                  <p className="fr-card-desc">{req.desc}</p>

                  {/* Tags */}
                  <div className="fr-tags">
                    {req.tags.map((tag) => (
                      <span key={tag} className="fr-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="fr-card-meta">
                    <span className="fr-meta-item">
                      <IoLocationOutline /> {req.location}
                    </span>
                    <span className="fr-meta-item">
                      <IoTimeOutline /> {req.postedAgo}
                    </span>
                    <span className="fr-meta-item">
                      <IoTimeOutline /> Due: {req.deadline}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="fr-card-footer">
                    <div className="fr-pts-badge">
                      <IoFlashOutline /> {req.points} pts
                    </div>
                    <Link to={`/skill-marketplace`} className="fr-apply-btn">
                      Apply to Help <IoArrowForward />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="fr-empty">
              <span className="fr-empty-icon">🔍</span>
              <h3>No requests found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="fr-cta-banner">
        <div className="fr-cta-inner">
          <IoCashOutline className="fr-cta-icon" />
          <h2>Need help with something?</h2>
          <p>Post a request and let skilled community members come to you.</p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/post-request" className="fr-cta-btn">
              Post a Request <IoArrowForward />
            </Link>
            <Link to="/post-skill" className="fr-cta-btn" style={{ background: "rgba(255,255,255,0.08)", boxShadow: "none" }}>
              Offer a Skill <IoArrowForward />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindRequests;
