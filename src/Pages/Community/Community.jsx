import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import {
  IoPeopleOutline,
  IoFlashOutline,
  IoArrowForward,
  IoHeartOutline,
  IoChatbubbleOutline,
  IoShareSocialOutline,
  IoCreateOutline,
  IoTrophyOutline,
  IoRocketOutline,
  IoBookmarkOutline,
  IoThumbsUpOutline,
  IoCloseOutline,
  IoImageOutline,
} from "react-icons/io5";
import { AuthContext } from "../../Authentication/AuthContext";
import "./Community.css";

/* ─── Static Data ──────────── */
const TOPICS = [
  "All",
  "Announcements",
  "Tips & Tricks",
  "Success Stories",
  "Help Needed",
  "Introductions",
  "Others",
];

const BADGE_COLORS = {
  Champion: "#ca8a04",
  Expert: "#7c3aed",
  Helper: "#0891b2",
  Team: "#14a800",
};

// Helper function to format time ago
const getTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
};

/* ─── Component ─────────────── */
const Community = () => {
  const { user } = useContext(AuthContext);
  const [activeTopic, setActiveTopic] = useState("All");
  const [liked, setLiked] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    topic: "",
    tags: "",
  });

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/community");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = (id) =>
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const toggleBookmark = (id) =>
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get author info from authenticated user
    const authorName = user?.displayName || "Anonymous User";
    const initials = authorName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Parse tags from comma-separated string
    const tagsArray = newPost.tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    // Generate random avatar color if no photo
    const avatarColors = [
      "#14a800",
      "#db2777",
      "#0891b2",
      "#7c3aed",
      "#d97706",
      "#0369a1",
      "#059669",
    ];
    const randomColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const postData = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      topic: newPost.topic,
      title: newPost.title,
      body: newPost.body,
      tags: tagsArray,
      author: {
        name: authorName,
        initials: initials,
        avatarColor: randomColor,
        photoURL: user?.photoURL || null,
        badge: "Helper",
        email: user?.email || null,
        userId: user?.uid || `guest_${Math.random().toString(36).substr(2, 9)}`,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        pinned: false,
      },
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
      },
    };

    try {
      const response = await fetch("http://localhost:3000/community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Post created successfully:", result);

      // Re-fetch to ensure we render the exact backend response shape.
      await fetchPosts();
      setNewPost({ title: "", body: "", topic: "", tags: "" });
      setIsPostModalOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = posts.filter(
    (p) => activeTopic === "All" || p.topic === activeTopic,
  );

  return (
    <div className="cm-page">
      {/* ══════ HERO ══════ */}
      <section className="cm-hero">
        <div className="cm-hero-orbs">
          <span className="cm-orb cm-orb--1" />
          <span className="cm-orb cm-orb--2" />
        </div>
        <div className="cm-hero-inner">
          <span className="cm-hero-eyebrow">
            <IoPeopleOutline /> The Anwesha Community
          </span>
          <h1>
            Learn Together.
            <br />
            <span className="cm-hero-gradient">Grow Together.</span>
          </h1>
          <p>
            Connect with skilled community members, share your experiences, get
            advice, and celebrate milestones together.
          </p>
          <div className="cm-hero-actions">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="cm-cta-primary"
            >
              <IoCreateOutline /> Start a Post
            </button>
            <Link to="/skill-marketplace" className="cm-cta-secondary">
              Explore Skills <IoArrowForward />
            </Link>
          </div>
          <div className="cm-hero-stats">
            <div className="cm-stat">
              <span className="cm-stat-num">1,200+</span>
              <span className="cm-stat-label">Members</span>
            </div>
            <div className="cm-stat-divider" />
            <div className="cm-stat">
              <span className="cm-stat-num">3,800+</span>
              <span className="cm-stat-label">Tasks Done</span>
            </div>
            <div className="cm-stat-divider" />
            <div className="cm-stat">
              <span className="cm-stat-num">480+</span>
              <span className="cm-stat-label">Posts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FEED ══════ */}
      <section className="cm-feed-section">
        <div className="cm-feed-wrapper">
          {/* Left: Feed */}
          <div className="cm-feed-main">
            {/* Topic filter */}
            <div className="cm-topics">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className={`cm-topic-btn ${activeTopic === t ? "cm-topic-btn--active" : ""}`}
                  onClick={() => setActiveTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="cm-posts">
              {isLoading ? (
                <div className="cm-loading">Loading posts...</div>
              ) : filtered.length === 0 ? (
                <div className="cm-empty">
                  No posts yet. Be the first to share!
                </div>
              ) : (
                filtered.map((post) => {
                  // Handle both API format (nested author) and static format (flat)
                  const authorName = post.author?.name || post.author;
                  const initials = post.author?.initials || post.initials;
                  const avatarColor =
                    post.author?.avatarColor || post.avatarColor;
                  const badge = post.author?.badge || post.badge;
                  const photoURL = post.author?.photoURL;
                  const isPinned = post.metadata?.pinned || post.pinned;
                  const likes = post.engagement?.likes ?? post.likes ?? 0;
                  const comments =
                    post.engagement?.comments ?? post.comments ?? 0;
                  const createdAt = post.metadata?.createdAt;
                  const timeAgo = createdAt ? getTimeAgo(createdAt) : post.time;

                  return (
                    <div
                      key={post.id}
                      className={`cm-post-card ${isPinned ? "cm-post-card--pinned" : ""}`}
                    >
                      {isPinned && (
                        <div className="cm-pin-badge">📌 Pinned Post</div>
                      )}

                      {/* Author */}
                      <div className="cm-post-author">
                        {photoURL ? (
                          <img
                            src={photoURL}
                            alt={authorName}
                            className="cm-post-avatar-img"
                          />
                        ) : (
                          <div
                            className="cm-post-avatar"
                            style={{ background: avatarColor }}
                          >
                            {initials}
                          </div>
                        )}
                        <div>
                          <div className="cm-post-author-meta">
                            <span className="cm-post-author-name">
                              {authorName}
                            </span>
                            <span
                              className="cm-post-badge"
                              style={{
                                background: BADGE_COLORS[badge] + "20",
                                color: BADGE_COLORS[badge],
                              }}
                            >
                              {badge}
                            </span>
                          </div>
                          <div className="cm-post-meta-line">
                            <span className="cm-post-time">{timeAgo}</span>
                            <span className="cm-post-topic-tag">
                              {post.topic}
                            </span>
                          </div>
                        </div>
                        {/* <button
                          className={`cm-bookmark-btn ${bookmarked.includes(post.id) ? "cm-bookmark-btn--saved" : ""}`}
                          onClick={() => toggleBookmark(post.id)}
                        >
                          <IoBookmarkOutline />
                        </button> */}
                      </div>

                      {/* Content */}
                      <h3 className="cm-post-title">{post.title}</h3>
                      <p className="cm-post-body">{post.body}</p>

                      {/* Tags */}
                      <div className="cm-post-tags">
                        {post.tags?.map((tag) => (
                          <span key={tag} className="cm-post-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="cm-post-actions">
                        <button
                          className={`cm-action-btn ${liked.includes(post.id) ? "cm-action-btn--liked" : ""}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <IoThumbsUpOutline />
                          {likes + (liked.includes(post.id) ? 1 : 0)}
                        </button>
                        <button className="cm-action-btn">
                          <IoChatbubbleOutline />
                          {comments}
                        </button>
                        <button className="cm-action-btn">
                          <IoShareSocialOutline />
                          Share
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="cm-sidebar">
            {/* Trending Topics */}
            <div className="cm-sidebar-card">
              <h4 className="cm-sidebar-title">🔥 Trending Topics</h4>
              <div className="cm-trending-list">
                {[
                  "#react",
                  "#figma",
                  "#skill-swap",
                  "#motivation",
                  "#python",
                  "#2x-points",
                ].map((t) => (
                  <button key={t} className="cm-trending-tag">
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="cm-sidebar-card">
              <h4 className="cm-sidebar-title">
                <IoTrophyOutline /> Top This Month
              </h4>
              <div className="cm-top-list">
                {[
                  {
                    name: "Tanvir Ahmed",
                    pts: 2840,
                    initials: "TA",
                    color: "#14a800",
                  },
                  {
                    name: "Nusrat Jahan",
                    pts: 2310,
                    initials: "NJ",
                    color: "#db2777",
                  },
                  {
                    name: "Rafiqul Islam",
                    pts: 1920,
                    initials: "RI",
                    color: "#7c3aed",
                  },
                ].map((u, i) => (
                  <div key={u.name} className="cm-top-row">
                    <span className="cm-top-rank">{["🥇", "🥈", "🥉"][i]}</span>
                    <div
                      className="cm-top-avatar"
                      style={{ background: u.color }}
                    >
                      {u.initials}
                    </div>
                    <span className="cm-top-name">{u.name}</span>
                    <span className="cm-top-pts">
                      <IoFlashOutline /> {u.pts.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/rewards" className="cm-sidebar-link">
                See full leaderboard <IoArrowForward />
              </Link>
            </div>

            {/* CTA */}
            <div className="cm-sidebar-cta">
              <IoRocketOutline className="cm-sidebar-cta-icon" />
              <h4>Earn as you help</h4>
              <p>Every completed task earns you reward points. Start today!</p>
              <Link
                to="/skill-marketplace"
                className="cm-cta-primary cm-cta-primary--full"
              >
                Browse Marketplace
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ══════ POST MODAL ══════ */}
      {isPostModalOpen && (
        <div
          className="cm-modal-overlay"
          onClick={() => setIsPostModalOpen(false)}
        >
          <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm-modal-header">
              <h2>Create a Post</h2>
              <button
                className="cm-modal-close"
                onClick={() => setIsPostModalOpen(false)}
              >
                <IoCloseOutline />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="cm-modal-form">
              <div className="cm-form-group">
                <label htmlFor="post-topic">Topic</label>
                <select
                  id="post-topic"
                  value={newPost.topic}
                  onChange={(e) =>
                    setNewPost({ ...newPost, topic: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {TOPICS.filter((t) => t !== "All").map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              <div className="cm-form-group">
                <label htmlFor="post-title">Title</label>
                <input
                  id="post-title"
                  type="text"
                  placeholder="Give your post a catchy title..."
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="cm-form-group">
                <label htmlFor="post-body">Content</label>
                <textarea
                  id="post-body"
                  placeholder="Share your thoughts, experiences, or questions..."
                  rows={5}
                  value={newPost.body}
                  onChange={(e) =>
                    setNewPost({ ...newPost, body: e.target.value })
                  }
                  required
                />
              </div>
              <div className="cm-form-group">
                <label htmlFor="post-tags">Tags (comma separated)</label>
                <input
                  id="post-tags"
                  type="text"
                  placeholder="e.g., react, tips, motivation"
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tags: e.target.value })
                  }
                />
              </div>
              <div className="cm-modal-actions">
                <button
                  type="button"
                  className="cm-cta-secondary"
                  onClick={() => setIsPostModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cm-cta-primary"
                  disabled={isSubmitting}
                >
                  <IoCreateOutline />{" "}
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
