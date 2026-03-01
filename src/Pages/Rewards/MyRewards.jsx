import React, { useState } from "react";
import { Link } from "react-router";
import {
  IoFlashOutline,
  IoTrophyOutline,
  IoArrowForward,
  IoArrowUp,
  IoArrowDown,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoStorefrontOutline,
  IoFilterOutline,
  IoPersonOutline,
  IoStarSharp,
  IoGridOutline,
  IoDocumentTextOutline,
  IoGiftOutline,
  IoChevronForward,
} from "react-icons/io5";
import "./MyRewards.css";

/* ─── Mock Data ─────────────────────────────────── */
const USER_STATS = {
  name: "Arjun Patel",
  initials: "AP",
  avatarColor: "#14a800",
  totalPoints: 840,
  pointsEarned: 1020,
  pointsSpent: 180,
  tier: "Expert",
  tierColor: "#7c3aed",
  tierBg: "#f5f3ff",
  nextTier: "Champion",
  nextTierPts: 1500,
  rank: 3,
  tasksCompleted: 14,
  avgRating: 4.9,
  memberSince: "Jan 2025",
};

const TIER_PROGRESS = {
  current: 840,
  currentName: "Expert",
  nextName: "Champion",
  nextMin: 1500,
  prevMin: 600,
};

const TRANSACTIONS = [
  {
    id: 1,
    type: "earned",
    title: "Full-Stack Web Development",
    desc: "Completed for Sneha K.",
    pts: 120,
    date: "Feb 24, 2026",
    status: "completed",
    icon: <IoCheckmarkCircle />,
  },
  {
    id: 2,
    type: "spent",
    title: "UI/UX Design & Figma Prototyping",
    desc: "Requested from Fatima A.",
    pts: 90,
    date: "Feb 20, 2026",
    status: "completed",
    icon: <IoStorefrontOutline />,
  },
  {
    id: 3,
    type: "earned",
    title: "Python ML Model Review",
    desc: "Completed for Carlos R.",
    pts: 200,
    date: "Feb 14, 2026",
    status: "completed",
    icon: <IoCheckmarkCircle />,
  },
  {
    id: 4,
    type: "earned",
    title: "React Component Library",
    desc: "Completed for Omar H.",
    pts: 150,
    date: "Feb 08, 2026",
    status: "completed",
    icon: <IoCheckmarkCircle />,
  },
  {
    id: 5,
    type: "spent",
    title: "Technical Blog Writing",
    desc: "Requested from Lena S.",
    pts: 50,
    date: "Feb 01, 2026",
    status: "completed",
    icon: <IoStorefrontOutline />,
  },
  {
    id: 6,
    type: "earned",
    title: "WordPress Site Development",
    desc: "Completed for Aisha W.",
    pts: 60,
    date: "Jan 27, 2026",
    status: "completed",
    icon: <IoCheckmarkCircle />,
  },
  {
    id: 7,
    type: "spent",
    title: "Social Media Strategy",
    desc: "Requested from Ravi S.",
    pts: 40,
    date: "Jan 20, 2026",
    status: "completed",
    icon: <IoStorefrontOutline />,
  },
  {
    id: 8,
    type: "earned",
    title: "API Integration Setup",
    desc: "Completed for Mei L.",
    pts: 80,
    date: "Jan 15, 2026",
    status: "completed",
    icon: <IoCheckmarkCircle />,
  },
];

const LEADERBOARD_SNIPPET = [
  { rank: 1, name: "Arjun Patel", pts: 2840, initials: "AP", color: "#14a800", isMe: false },
  { rank: 2, name: "Mei Lin", pts: 2310, initials: "ML", color: "#db2777", isMe: false },
  { rank: 3, name: "You", pts: 840, initials: "AP", color: "#14a800", isMe: true },
  { rank: 4, name: "Carlos Ruiz", pts: 780, initials: "CR", color: "#0369a1", isMe: false },
];

const BADGES = [
  { id: 1, icon: "⚡", name: "First Earn", desc: "Earned your first reward points", unlocked: true },
  { id: 2, icon: "🤝", name: "Team Player", desc: "Helped 5 community members", unlocked: true },
  { id: 3, icon: "🏅", name: "Rising Star", desc: "Reached Helper tier", unlocked: true },
  { id: 4, icon: "💎", name: "Consistent", desc: "Helped someone 4 weeks in a row", unlocked: true },
  { id: 5, icon: "🚀", name: "Speedster", desc: "Delivered a task 1 day early", unlocked: true },
  { id: 6, icon: "🌟", name: "Top Rated", desc: "Achieved 5-star rating on 3 tasks", unlocked: false },
  { id: 7, icon: "👑", name: "Champion", desc: "Reach Champion tier", unlocked: false },
  { id: 8, icon: "🌍", name: "Global Helper", desc: "Help someone from 5 different countries", unlocked: false },
];

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

/* ─── Component ────────────────────────────────────── */
const MyRewards = () => {
  const [txFilter, setTxFilter] = useState("all");

  const filteredTx = TRANSACTIONS.filter((tx) => {
    if (txFilter === "earned") return tx.type === "earned";
    if (txFilter === "spent") return tx.type === "spent";
    return true;
  });

  const progressPct = Math.min(
    100,
    ((TIER_PROGRESS.current - TIER_PROGRESS.prevMin) /
      (TIER_PROGRESS.nextMin - TIER_PROGRESS.prevMin)) *
      100
  );

  return (
    <div className="my-rewards-page">

      {/* ══════ HERO / WALLET HEADER ══════ */}
      <section className="mr-hero">
        <div className="mr-hero-bg-orbs">
          <span className="mr-orb mr-orb--1" />
          <span className="mr-orb mr-orb--2" />
        </div>
        <div className="mr-hero-inner">
          {/* User Identity */}
          <div className="mr-hero-left">
            <div className="mr-hero-avatar" style={{ background: USER_STATS.avatarColor }}>
              {USER_STATS.initials}
            </div>
            <div className="mr-hero-identity">
              <span className="mr-hero-label">My Rewards Wallet</span>
              <h1>{USER_STATS.name}</h1>
              <div className="mr-hero-meta">
                <span
                  className="mr-tier-badge"
                  style={{ background: USER_STATS.tierColor }}
                >
                  <IoTrophyOutline /> {USER_STATS.tier}
                </span>
                <span className="mr-hero-since">Member since {USER_STATS.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Point Balance */}
          <div className="mr-balance-card">
            <div className="mr-balance-label">
              <IoFlashOutline /> Total Balance
            </div>
            <div className="mr-balance-pts">{USER_STATS.totalPoints.toLocaleString()}</div>
            <div className="mr-balance-unit">reward points</div>
            <div className="mr-balance-breakdown">
              <span className="mr-balance-earned">
                <IoArrowDown /> +{USER_STATS.pointsEarned} earned
              </span>
              <span className="mr-balance-spent">
                <IoArrowUp /> -{USER_STATS.pointsSpent} spent
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mr-quick-stats">
            <div className="mr-quick-stat">
              <span className="mr-qs-num">#{USER_STATS.rank}</span>
              <span className="mr-qs-label">Community Rank</span>
            </div>
            <div className="mr-quick-stat-divider" />
            <div className="mr-quick-stat">
              <span className="mr-qs-num">{USER_STATS.tasksCompleted}</span>
              <span className="mr-qs-label">Tasks Done</span>
            </div>
            <div className="mr-quick-stat-divider" />
            <div className="mr-quick-stat">
              <span className="mr-qs-num">
                {USER_STATS.avgRating} <IoStarSharp className="mr-qs-star" />
              </span>
              <span className="mr-qs-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ MAIN CONTENT ══════ */}
      <div className="mr-content">

        {/* ── Left Column ── */}
        <div className="mr-col-main">

          {/* Tier Progress */}
          <div className="mr-card mr-tier-progress-card">
            <div className="mr-card-header">
              <h3><IoTrophyOutline /> Tier Progress</h3>
              <Link to="/rewards" className="mr-card-link">
                View all tiers <IoChevronForward />
              </Link>
            </div>
            <div className="mr-tier-info">
              <div
                className="mr-tier-current"
                style={{ color: USER_STATS.tierColor }}
              >
                <span className="mr-tier-icon">🏆</span>
                {USER_STATS.tier}
              </div>
              <div className="mr-tier-arrow">→</div>
              <div className="mr-tier-next">
                <span className="mr-tier-icon">👑</span>
                {USER_STATS.nextTier}
              </div>
            </div>
            <div className="mr-progress-bar-wrap">
              <div className="mr-progress-bar">
                <div
                  className="mr-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mr-progress-labels">
                <span>{TIER_PROGRESS.current} pts</span>
                <span className="mr-progress-needed">
                  {TIER_PROGRESS.nextMin - TIER_PROGRESS.current} pts to {USER_STATS.nextTier}
                </span>
              </div>
            </div>
            <div className="mr-tier-perks-preview">
              <span className="mr-tier-perks-label">Champion unlocks:</span>
              <span className="mr-tier-perk-chip">👑 Champion crown</span>
              <span className="mr-tier-perk-chip">📊 Monthly report</span>
              <span className="mr-tier-perk-chip">📣 Community shout-out</span>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mr-card">
            <div className="mr-card-header">
              <h3><IoDocumentTextOutline /> Transaction History</h3>
              <div className="mr-tx-filters">
                {["all", "earned", "spent"].map((f) => (
                  <button
                    key={f}
                    className={`mr-tx-filter-btn ${txFilter === f ? "active" : ""}`}
                    onClick={() => setTxFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mr-tx-list">
              {filteredTx.map((tx) => (
                <div key={tx.id} className="mr-tx-row">
                  <div
                    className={`mr-tx-icon ${tx.type === "earned" ? "mr-tx-icon--earned" : "mr-tx-icon--spent"}`}
                  >
                    {tx.icon}
                  </div>
                  <div className="mr-tx-info">
                    <span className="mr-tx-title">{tx.title}</span>
                    <span className="mr-tx-desc">{tx.desc}</span>
                  </div>
                  <div className="mr-tx-date">{tx.date}</div>
                  <div className={`mr-tx-pts ${tx.type === "earned" ? "mr-tx-pts--earned" : "mr-tx-pts--spent"}`}>
                    {tx.type === "earned" ? "+" : "-"}{tx.pts} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Sidebar ── */}
        <aside className="mr-col-side">

          {/* Leaderboard Snippet */}
          <div className="mr-card mr-lb-card">
            <div className="mr-card-header">
              <h3><IoTrophyOutline /> My Position</h3>
              <Link to="/rewards" className="mr-card-link">
                Full board <IoChevronForward />
              </Link>
            </div>
            <div className="mr-lb-list">
              {LEADERBOARD_SNIPPET.map((m) => (
                <div key={m.rank} className={`mr-lb-row ${m.isMe ? "mr-lb-row--me" : ""}`}>
                  <span className="mr-lb-rank">
                    {RANK_MEDAL[m.rank] || `#${m.rank}`}
                  </span>
                  <div className="mr-lb-avatar" style={{ background: m.color }}>
                    {m.initials}
                  </div>
                  <span className={`mr-lb-name ${m.isMe ? "mr-lb-name--me" : ""}`}>
                    {m.name} {m.isMe && <span className="mr-lb-you-tag">You</span>}
                  </span>
                  <span className="mr-lb-pts">
                    <IoFlashOutline /> {m.pts.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="mr-card">
            <div className="mr-card-header">
              <h3><IoGiftOutline /> Badges</h3>
              <span className="mr-badges-count">{BADGES.filter(b => b.unlocked).length}/{BADGES.length}</span>
            </div>
            <div className="mr-badges-grid">
              {BADGES.map((badge) => (
                <div
                  key={badge.id}
                  className={`mr-badge-chip ${badge.unlocked ? "" : "mr-badge-chip--locked"}`}
                  title={badge.desc}
                >
                  <span className="mr-badge-icon">{badge.icon}</span>
                  <span className="mr-badge-name">{badge.name}</span>
                  {!badge.unlocked && <span className="mr-badge-lock">🔒</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mr-card mr-actions-card">
            <h3 className="mr-actions-title">Quick Actions</h3>
            <Link to="/skill-marketplace" className="mr-action-btn mr-action-btn--primary">
              <IoStorefrontOutline /> Browse Marketplace
            </Link>
            <Link to="/post-skill" className="mr-action-btn mr-action-btn--outline">
              <IoDocumentTextOutline /> Offer a Skill
            </Link>
            <Link to="/my-profile" className="mr-action-btn mr-action-btn--ghost">
              <IoPersonOutline /> My Profile
            </Link>
          </div>

        </aside>
      </div>

    </div>
  );
};

export default MyRewards;
