import React, { useState, useEffect } from "react";
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
const CATEGORIES = [
  "All",
  "Development & IT",
  "Design & Creative",
  "Writing & Translation",
  "Education",
  "Music",
  "Business",
  "Lifestyle",
];

const SORT_OPTIONS = ["Newest", "Most Points", "Urgent First", "Top Rated"];

/* ─── Helper Functions ──────────────────── */
const getTimeAgo = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name) => {
  const colors = [
    "#7c3aed",
    "#ea580c",
    "#0369a1",
    "#db2777",
    "#d97706",
    "#059669",
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

/* ─── Component ─────────────────────── */
const FindRequests = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [viewMode, setViewMode] = useState("grid");
  const [bookmarked, setBookmarked] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://anwesha-backend.vercel.app/posts",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        // Transform API data to match component structure
        const transformedData = data.map((post) => ({
          id: post._id,
          title: post.title,
          category: post.category,
          poster: post.author?.displayName || "Anonymous",
          photoURL: post.author?.photoURL,
          initials: getInitials(post.author?.displayName),
          avatarColor: getAvatarColor(post.author?.displayName),
          location: post.location || "Remote",
          postedAgo: getTimeAgo(post.createdAt),
          deadline: post.deadline,
          points: post.rewardPoints,
          rating: 4.5,
          desc: post.description,
          tags: post.tags || [],
          urgency: post.urgency?.toLowerCase() || "medium",
        }));
        setRequests(transformedData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  };

  const filtered = requests.filter((r) => {
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
            Find Someone to Help.
            <br />
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
            <span>
              {filtered.length} open request{filtered.length !== 1 ? "s" : ""}
            </span>
            {activeCategory !== "All" && (
              <span className="fr-results-cat">
                {" "}
                in <strong>{activeCategory}</strong>
              </span>
            )}
          </div>

          {/* Cards Grid / List */}
          {loading ? (
            <div className="fr-empty">
              <span className="fr-empty-icon">⏳</span>
              <h3>Loading requests...</h3>
              <p>Please wait while we fetch the latest requests.</p>
            </div>
          ) : error ? (
            <div className="fr-empty">
              <span className="fr-empty-icon">⚠️</span>
              <h3>Error loading requests</h3>
              <p>{error}</p>
            </div>
          ) : filtered.length > 0 ? (
            <div
              className={`fr-cards ${viewMode === "list" ? "fr-cards--list" : ""}`}
            >
              {filtered.map((req) => (
                <div
                  key={req.id}
                  className={`fr-card ${viewMode === "list" ? "fr-card--list" : ""}`}
                  style={{ position: "relative" }}
                >
                  {/* Urgency indicator */}
                  {req.urgency === "high" && (
                    <div
                      className="fr-urgency-badge"
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        zIndex: 10,
                      }}
                    >
                      🔥 Urgent
                    </div>
                  )}

                  {/* Card Header */}
                  <div className="fr-card-header">
                    <div className="fr-poster">
                      {req.photoURL ? (
                        <img
                          src={req.photoURL}
                          alt={req.poster}
                          referrerPolicy="no-referrer"
                          className="fr-poster-avatar"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="fr-poster-avatar"
                          style={{ background: req.avatarColor }}
                        >
                          {req.initials}
                        </div>
                      )}
                      <div>
                        <span className="fr-poster-name">{req.poster}</span>
                        <span className="fr-poster-rating">
                          <IoStarOutline /> {req.rating}
                        </span>
                      </div>
                    </div>
                    {/* <button
                      className={`fr-bookmark-btn ${bookmarked.includes(req.id) ? "fr-bookmark-btn--saved" : ""}`}
                      onClick={() => toggleBookmark(req.id)}
                      aria-label="Bookmark request"
                    >
                      <IoBookmarkOutline />
                    </button> */}
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
                    <Link to={`/request/${req.id}`} className="fr-apply-btn">
                      View Details <IoArrowForward />
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
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link to="/post-request" className="fr-cta-btn">
              Post a Request <IoArrowForward />
            </Link>
            <Link
              to="/post-skill"
              className="fr-cta-btn"
              style={{
                background: "rgba(255,255,255,0.08)",
                boxShadow: "none",
              }}
            >
              Offer a Skill <IoArrowForward />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FindRequests;
