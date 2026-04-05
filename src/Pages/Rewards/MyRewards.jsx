import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../Authentication/AuthContext";
import "./MyRewards.css";

const AVATAR_COLORS = [
  "#14a800",
  "#db2777",
  "#7c3aed",
  "#0369a1",
  "#d97706",
  "#ea580c",
  "#059669",
  "#0891b2",
  "#6d28d9",
  "#be185d",
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

/* ─── Tier Definitions ─────────────────────────────── */
const TIERS = [
  { name: "Newcomer", min: 0, color: "#6b7280", icon: "🌱" },
  { name: "Helper", min: 100, color: "#0891b2", icon: "🤝" },
  { name: "Contributor", min: 300, color: "#0369a1", icon: "⭐" },
  { name: "Expert", min: 600, color: "#7c3aed", icon: "🏆" },
  { name: "Champion", min: 1500, color: "#d97706", icon: "👑" },
  { name: "Legend", min: 3000, color: "#dc2626", icon: "🌟" },
];

const getTierInfo = (points) => {
  let current = TIERS[0];
  let next = TIERS[1];
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].min) {
      current = TIERS[i];
      next = TIERS[i + 1] || null;
      break;
    }
  }
  return {
    current,
    next,
    prevMin: current.min,
    nextMin: next ? next.min : current.min,
  };
};

const BADGES = [
  {
    id: 1,
    icon: "⚡",
    name: "First Earn",
    desc: "Earned your first reward points",
    unlocked: true,
  },
  {
    id: 2,
    icon: "🤝",
    name: "Team Player",
    desc: "Helped 5 community members",
    unlocked: true,
  },
  {
    id: 3,
    icon: "🏅",
    name: "Rising Star",
    desc: "Reached Helper tier",
    unlocked: true,
  },
  {
    id: 4,
    icon: "💎",
    name: "Consistent",
    desc: "Helped someone 4 weeks in a row",
    unlocked: true,
  },
  {
    id: 5,
    icon: "🚀",
    name: "Speedster",
    desc: "Delivered a task 1 day early",
    unlocked: true,
  },
  {
    id: 6,
    icon: "🌟",
    name: "Top Rated",
    desc: "Achieved 5-star rating on 3 tasks",
    unlocked: false,
  },
  {
    id: 7,
    icon: "👑",
    name: "Champion",
    desc: "Reach Champion tier",
    unlocked: false,
  },
  {
    id: 8,
    icon: "🌍",
    name: "Global Helper",
    desc: "Help someone from 5 different countries",
    unlocked: false,
  },
];

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

/* ─── Component ────────────────────────────────────── */
const MyRewards = () => {
  const { user } = useContext(AuthContext);
  const [txFilter, setTxFilter] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [leaderboardSnippet, setLeaderboardSnippet] = useState([]);
  const [lbLoading, setLbLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:3000/users");
        const users = await res.json();

        const sorted = [...users]
          .filter((u) => (u.rewardPoints || 0) > 0)
          .sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0));

        const myEmail = user?.email;
        const myIndex = sorted.findIndex((u) => u.email === myEmail);

        // Build a snippet: top 3 + current user's neighborhood
        const snippetSet = new Set();
        // Always include top 3
        for (let i = 0; i < Math.min(3, sorted.length); i++) snippetSet.add(i);
        // Include user and neighbors
        if (myIndex >= 0) {
          if (myIndex > 0) snippetSet.add(myIndex - 1);
          snippetSet.add(myIndex);
          if (myIndex < sorted.length - 1) snippetSet.add(myIndex + 1);
        }

        const indices = [...snippetSet].sort((a, b) => a - b);
        const snippet = indices.map((idx) => {
          const u = sorted[idx];
          const name = u.name || u.email?.split("@")[0] || "User";
          return {
            rank: idx + 1,
            name,
            pts: u.rewardPoints || 0,
            initials: getInitials(name),
            color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
            isMe: u.email === myEmail,
            profilePicture: u.profilePicture || null,
          };
        });

        setLeaderboardSnippet(snippet);
        if (myIndex >= 0) setMyRank(myIndex + 1);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLbLoading(false);
      }
    };
    if (user?.email) fetchLeaderboard();
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/${encodeURIComponent(user.email)}`,
        );
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    if (user?.email) fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/contracts?email=${encodeURIComponent(user.email)}`,
        );
        const contracts = await res.json();

        const mapped = contracts.map((c) => {
          const isHelper = c.helper?.email === user.email;
          return {
            id: c._id,
            type: isHelper ? "earned" : "spent",
            title: c.title || "Untitled",
            desc: isHelper
              ? `Completed for ${c.author?.displayName || "User"}`
              : `Requested from ${c.helper?.displayName || "User"}`,
            pts: c.rewardPoints || 0,
            date: new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            status: c.status,
            rewardStatus: c.rewardStatus,
            category: c.category,
          };
        });

        setTransactions(mapped);
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
      } finally {
        setTxLoading(false);
      }
    };
    if (user?.email) fetchContracts();
  }, [user]);

  const filteredTx = transactions.filter((tx) => {
    if (txFilter === "earned") return tx.type === "earned";
    if (txFilter === "spent") return tx.type === "spent";
    return true;
  });

  const pointsEarned = transactions
    .filter((tx) => tx.type === "earned")
    .reduce((sum, tx) => sum + tx.pts, 0);
  const pointsSpent = transactions
    .filter((tx) => tx.type === "spent")
    .reduce((sum, tx) => sum + tx.pts, 0);
  const totalPoints = userProfile?.rewardPoints ?? pointsEarned - pointsSpent;
  const tasksCompleted = transactions.filter(
    (tx) => tx.type === "earned" && tx.status === "completed",
  ).length;

  const tierInfo = getTierInfo(totalPoints);

  const progressPct = tierInfo.next
    ? Math.min(
        100,
        ((totalPoints - tierInfo.prevMin) /
          (tierInfo.nextMin - tierInfo.prevMin)) *
          100,
      )
    : 100;

  const displayName =
    userProfile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";
  const initials = getInitials(displayName);
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "";

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
            <div
              className="mr-hero-avatar"
              style={{ background: tierInfo.current.color }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <div className="mr-hero-identity">
              <span className="mr-hero-label">My Rewards Wallet</span>
              <h1>{displayName}</h1>
              <div className="mr-hero-meta">
                <span
                  className="mr-tier-badge"
                  style={{ background: tierInfo.current.color }}
                >
                  <IoTrophyOutline /> {tierInfo.current.name}
                </span>
                {memberSince && (
                  <span className="mr-hero-since">
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Point Balance */}
          <div className="mr-balance-card">
            <div className="mr-balance-label">
              <IoFlashOutline /> Total Balance
            </div>
            <div className="mr-balance-pts">{totalPoints.toLocaleString()}</div>
            <div className="mr-balance-unit">reward points</div>
            <div className="mr-balance-breakdown">
              <span className="mr-balance-earned">
                <IoArrowDown /> +{pointsEarned.toLocaleString()} earned
              </span>
              <span className="mr-balance-spent">
                <IoArrowUp /> -{pointsSpent.toLocaleString()} spent
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mr-quick-stats">
            <div className="mr-quick-stat">
              <span className="mr-qs-num">#{myRank || "—"}</span>
              <span className="mr-qs-label">Community Rank</span>
            </div>
            <div className="mr-quick-stat-divider" />
            <div className="mr-quick-stat">
              <span className="mr-qs-num">{tasksCompleted}</span>
              <span className="mr-qs-label">Tasks Done</span>
            </div>
            <div className="mr-quick-stat-divider" />
            <div className="mr-quick-stat">
              <span className="mr-qs-num">{tierInfo.current.icon}</span>
              <span className="mr-qs-label">{tierInfo.current.name}</span>
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
              <h3>
                <IoTrophyOutline /> Tier Progress
              </h3>
              <Link to="/rewards" className="mr-card-link">
                View all tiers <IoChevronForward />
              </Link>
            </div>
            <div className="mr-tier-info">
              <div
                className="mr-tier-current"
                style={{ color: tierInfo.current.color }}
              >
                <span className="mr-tier-icon">{tierInfo.current.icon}</span>
                {tierInfo.current.name}
              </div>
              {tierInfo.next && (
                <>
                  <div className="mr-tier-arrow">→</div>
                  <div className="mr-tier-next">
                    <span className="mr-tier-icon">{tierInfo.next.icon}</span>
                    {tierInfo.next.name}
                  </div>
                </>
              )}
            </div>
            <div className="mr-progress-bar-wrap">
              <div className="mr-progress-bar">
                <div
                  className="mr-progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mr-progress-labels">
                <span>{totalPoints} pts</span>
                {tierInfo.next ? (
                  <span className="mr-progress-needed">
                    {tierInfo.nextMin - totalPoints} pts to {tierInfo.next.name}
                  </span>
                ) : (
                  <span className="mr-progress-needed">Max tier reached!</span>
                )}
              </div>
            </div>
            {tierInfo.next && (
              <div className="mr-tier-perks-preview">
                <span className="mr-tier-perks-label">
                  {tierInfo.next.name} unlocks:
                </span>
                <span className="mr-tier-perk-chip">
                  {tierInfo.next.icon} {tierInfo.next.name} badge
                </span>
                <span className="mr-tier-perk-chip">📊 Priority support</span>
                <span className="mr-tier-perk-chip">
                  📣 Community shout-out
                </span>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="mr-card">
            <div className="mr-card-header">
              <h3>
                <IoDocumentTextOutline /> Transaction History
              </h3>
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
              {txLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "#999",
                  }}
                >
                  Loading transactions...
                </div>
              ) : filteredTx.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "24px 0",
                    color: "#999",
                  }}
                >
                  No transactions found
                </div>
              ) : (
                filteredTx.map((tx) => (
                  <div key={tx.id} className="mr-tx-row">
                    <div
                      className={`mr-tx-icon ${tx.type === "earned" ? "mr-tx-icon--earned" : "mr-tx-icon--spent"}`}
                    >
                      {tx.type === "earned" ? (
                        <IoCheckmarkCircle />
                      ) : (
                        <IoStorefrontOutline />
                      )}
                    </div>
                    <div className="mr-tx-info">
                      <span className="mr-tx-title">{tx.title}</span>
                      <span className="mr-tx-desc">{tx.desc}</span>
                    </div>
                    <div className="mr-tx-date">{tx.date}</div>
                    <div
                      className={`mr-tx-pts ${tx.type === "earned" ? "mr-tx-pts--earned" : "mr-tx-pts--spent"}`}
                    >
                      {tx.type === "earned" ? "+" : "-"}
                      {tx.pts} pts
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <aside className="mr-col-side">
          {/* Leaderboard Snippet */}
          <div className="mr-card mr-lb-card">
            <div className="mr-card-header">
              <h3>
                <IoTrophyOutline /> My Position
              </h3>
              <Link to="/rewards" className="mr-card-link">
                Full board <IoChevronForward />
              </Link>
            </div>
            <div className="mr-lb-list">
              {lbLoading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: "#999",
                  }}
                >
                  Loading...
                </div>
              ) : leaderboardSnippet.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px 0",
                    color: "#999",
                  }}
                >
                  No data yet
                </div>
              ) : (
                leaderboardSnippet.map((m) => (
                  <div
                    key={m.rank}
                    className={`mr-lb-row ${m.isMe ? "mr-lb-row--me" : ""}`}
                  >
                    <span className="mr-lb-rank">
                      {RANK_MEDAL[m.rank] || `#${m.rank}`}
                    </span>
                    <div
                      className="mr-lb-avatar"
                      style={{ background: m.color }}
                    >
                      {m.profilePicture ? (
                        <img
                          src={m.profilePicture}
                          alt={m.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        m.initials
                      )}
                    </div>
                    <span
                      className={`mr-lb-name ${m.isMe ? "mr-lb-name--me" : ""}`}
                    >
                      {m.name}{" "}
                      {m.isMe && <span className="mr-lb-you-tag">You</span>}
                    </span>
                    <span className="mr-lb-pts">
                      <IoFlashOutline /> {m.pts.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="mr-card">
            <div className="mr-card-header">
              <h3>
                <IoGiftOutline /> Badges
              </h3>
              <span className="mr-badges-count">
                {BADGES.filter((b) => b.unlocked).length}/{BADGES.length}
              </span>
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
            <Link
              to="/skill-marketplace"
              className="mr-action-btn mr-action-btn--primary"
            >
              <IoStorefrontOutline /> Browse Marketplace
            </Link>
            <Link
              to="/post-skill"
              className="mr-action-btn mr-action-btn--outline"
            >
              <IoDocumentTextOutline /> Offer a Skill
            </Link>
            <Link
              to="/my-profile"
              className="mr-action-btn mr-action-btn--ghost"
            >
              <IoPersonOutline /> My Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MyRewards;
