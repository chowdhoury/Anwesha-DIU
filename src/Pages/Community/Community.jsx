import React, { useState } from "react";
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
} from "react-icons/io5";
import "./Community.css";

/* ─── Static Data ──────────── */
const TOPICS = ["All", "Announcements", "Tips & Tricks", "Success Stories", "Help Needed", "Introductions"];

const POSTS = [
  {
    id: 1,
    topic: "Success Stories",
    author: "Arjun Patel",
    initials: "AP",
    avatarColor: "#14a800",
    badge: "Champion",
    time: "2h ago",
    title: "How I went from Newcomer to Expert in 3 months 🚀",
    body: "When I joined Anwesha, I had no idea how valuable my full-stack dev skills were to other community members. In 3 months, I've completed 14 tasks, earned 840+ points, and made real friends along the way. Here's my journey...",
    likes: 142,
    comments: 38,
    tags: ["journey", "dev", "motivation"],
    pinned: true,
  },
  {
    id: 2,
    topic: "Tips & Tricks",
    author: "Mei Lin",
    initials: "ML",
    avatarColor: "#db2777",
    badge: "Champion",
    time: "5h ago",
    title: "5 tips to write a winning skill listing that gets booked fast",
    body: "After posting 12 skills on the marketplace, I've figured out what makes buyers click 'Book Now'. Your title, your first sentence, and your price all matter more than you think. Let me break it down...",
    likes: 89,
    comments: 21,
    tags: ["listing", "tips", "marketplace"],
    pinned: false,
  },
  {
    id: 3,
    topic: "Announcements",
    author: "Anwesha Team",
    initials: "AT",
    avatarColor: "#0891b2",
    badge: "Team",
    time: "1d ago",
    title: "🎉 We just hit 1,200 active members! Here's what's next...",
    body: "This community milestone happened faster than we expected. Thank you all for building something truly special together. As a celebration, we're launching a 2× points week starting Monday — every task you complete earns double!",
    likes: 231,
    comments: 67,
    tags: ["milestone", "news", "2x-points"],
    pinned: false,
  },
  {
    id: 4,
    topic: "Help Needed",
    author: "Carlos Ruiz",
    initials: "CR",
    avatarColor: "#0369a1",
    badge: "Expert",
    time: "3h ago",
    title: "Looking for someone who knows Figma Auto Layout deeply",
    body: "I'm working on a complex design system and keep running into issues with nested auto layout frames. If anyone has deep Figma expertise, I'd love to exchange a skill — I can offer Python/data analysis in return.",
    likes: 14,
    comments: 9,
    tags: ["figma", "design", "skill-swap"],
    pinned: false,
  },
  {
    id: 5,
    topic: "Introductions",
    author: "Aisha Williams",
    initials: "AW",
    avatarColor: "#d97706",
    badge: "Helper",
    time: "6h ago",
    title: "New here! Frontend dev & aspiring UX designer 👋",
    body: "Hi everyone! I'm Aisha, a frontend dev from Lagos. I've been lurking for a while and finally decided to join. I specialize in React and Tailwind but I'm learning UX. Looking forward to helping and learning from this amazing community!",
    likes: 56,
    comments: 24,
    tags: ["intro", "frontend", "Lagos"],
    pinned: false,
  },
  {
    id: 6,
    topic: "Tips & Tricks",
    author: "Ravi Shankar",
    initials: "RS",
    avatarColor: "#059669",
    badge: "Helper",
    time: "2d ago",
    title: "How to give excellent feedback that providers actually love",
    body: "Getting a 5-star service is only half the value. The other half is giving a thoughtful review that helps the community. A great review mentions specifics, notes what exceeded expectations, and takes 3 minutes to write.",
    likes: 73,
    comments: 15,
    tags: ["feedback", "ratings", "community"],
    pinned: false,
  },
];

const BADGE_COLORS = {
  Champion: "#ca8a04",
  Expert: "#7c3aed",
  Helper: "#0891b2",
  Team: "#14a800",
};

/* ─── Component ─────────────── */
const Community = () => {
  const [activeTopic, setActiveTopic] = useState("All");
  const [liked, setLiked] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);

  const toggleLike = (id) =>
    setLiked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const toggleBookmark = (id) =>
    setBookmarked((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const filtered = POSTS.filter(
    (p) => activeTopic === "All" || p.topic === activeTopic
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
            Learn Together.<br />
            <span className="cm-hero-gradient">Grow Together.</span>
          </h1>
          <p>
            Connect with skilled community members, share your experiences, get
            advice, and celebrate milestones together.
          </p>
          <div className="cm-hero-actions">
            <Link to="/post-skill" className="cm-cta-primary">
              <IoCreateOutline /> Start a Post
            </Link>
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
              {filtered.map((post) => (
                <div key={post.id} className={`cm-post-card ${post.pinned ? "cm-post-card--pinned" : ""}`}>
                  {post.pinned && (
                    <div className="cm-pin-badge">📌 Pinned Post</div>
                  )}

                  {/* Author */}
                  <div className="cm-post-author">
                    <div
                      className="cm-post-avatar"
                      style={{ background: post.avatarColor }}
                    >
                      {post.initials}
                    </div>
                    <div>
                      <div className="cm-post-author-meta">
                        <span className="cm-post-author-name">{post.author}</span>
                        <span
                          className="cm-post-badge"
                          style={{ background: BADGE_COLORS[post.badge] + "20", color: BADGE_COLORS[post.badge] }}
                        >
                          {post.badge}
                        </span>
                      </div>
                      <div className="cm-post-meta-line">
                        <span className="cm-post-time">{post.time}</span>
                        <span className="cm-post-topic-tag">{post.topic}</span>
                      </div>
                    </div>
                    <button
                      className={`cm-bookmark-btn ${bookmarked.includes(post.id) ? "cm-bookmark-btn--saved" : ""}`}
                      onClick={() => toggleBookmark(post.id)}
                    >
                      <IoBookmarkOutline />
                    </button>
                  </div>

                  {/* Content */}
                  <h3 className="cm-post-title">{post.title}</h3>
                  <p className="cm-post-body">{post.body}</p>

                  {/* Tags */}
                  <div className="cm-post-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="cm-post-tag">#{tag}</span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="cm-post-actions">
                    <button
                      className={`cm-action-btn ${liked.includes(post.id) ? "cm-action-btn--liked" : ""}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <IoThumbsUpOutline />
                      {post.likes + (liked.includes(post.id) ? 1 : 0)}
                    </button>
                    <button className="cm-action-btn">
                      <IoChatbubbleOutline />
                      {post.comments}
                    </button>
                    <button className="cm-action-btn">
                      <IoShareSocialOutline />
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="cm-sidebar">
            {/* Trending Topics */}
            <div className="cm-sidebar-card">
              <h4 className="cm-sidebar-title">🔥 Trending Topics</h4>
              <div className="cm-trending-list">
                {["#react", "#figma", "#skill-swap", "#motivation", "#python", "#2x-points"].map((t) => (
                  <button key={t} className="cm-trending-tag">{t}</button>
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
                  { name: "Arjun Patel", pts: 2840, initials: "AP", color: "#14a800" },
                  { name: "Mei Lin", pts: 2310, initials: "ML", color: "#db2777" },
                  { name: "Sneha Kapoor", pts: 1920, initials: "SK", color: "#7c3aed" },
                ].map((u, i) => (
                  <div key={u.name} className="cm-top-row">
                    <span className="cm-top-rank">{["🥇","🥈","🥉"][i]}</span>
                    <div className="cm-top-avatar" style={{ background: u.color }}>{u.initials}</div>
                    <span className="cm-top-name">{u.name}</span>
                    <span className="cm-top-pts"><IoFlashOutline /> {u.pts.toLocaleString()}</span>
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
              <Link to="/skill-marketplace" className="cm-cta-primary cm-cta-primary--full">
                Browse Marketplace
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Community;
