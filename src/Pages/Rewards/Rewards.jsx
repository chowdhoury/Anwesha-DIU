import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  IoFlashOutline,
  IoTrophyOutline,
  IoStarOutline,
  IoRocketOutline,
  IoHandLeftOutline,
  IoCheckmarkCircle,
  IoArrowForward,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoGiftOutline,
  IoChevronDown,
  IoStorefrontOutline,
} from "react-icons/io5";
import "./Rewards.css";

/* ─── Static Data ─────────────────────────────────── */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: <IoHandLeftOutline />,
    title: "Help Someone",
    desc: "Offer your skill, complete a task, or assist a community member with their request.",
    color: "#14a800",
  },
  {
    step: "02",
    icon: <IoStarOutline />,
    title: "Get Rated",
    desc: "When the task is done, the recipient rates your help. Good ratings mean more points.",
    color: "#7c3aed",
  },
  {
    step: "03",
    icon: <IoFlashOutline />,
    title: "Earn Points",
    desc: "Reward points are automatically credited to your wallet after a successful exchange.",
    color: "#0891b2",
  },
  {
    step: "04",
    icon: <IoGiftOutline />,
    title: "Spend or Save",
    desc: "Use your points to get help back from others, or save up to climb the leaderboard.",
    color: "#ea580c",
  },
];

const TIERS = [
  {
    name: "Newcomer",
    icon: "🌱",
    range: "0 – 199 pts",
    perks: [
      "Access to the Skill Marketplace",
      "Post up to 2 requests/month",
      "Community forum access",
    ],
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
  {
    name: "Helper",
    icon: "⚡",
    range: "200 – 599 pts",
    perks: [
      "Everything in Newcomer",
      "Post unlimited requests",
      "Priority listing in search",
      "Helper badge on profile",
    ],
    color: "#0891b2",
    bg: "#eff6ff",
    border: "#bfdbfe",
    popular: false,
  },
  {
    name: "Expert",
    icon: "🏆",
    range: "600 – 1499 pts",
    perks: [
      "Everything in Helper",
      "Featured profile placement",
      "Early access to new features",
      "Expert badge & verified checkmark",
    ],
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    popular: true,
  },
  {
    name: "Champion",
    icon: "👑",
    range: "1500+ pts",
    perks: [
      "Everything in Expert",
      "Champion crown + gold profile frame",
      "Monthly rewards summary report",
      "Direct community shout-out",
    ],
    color: "#ca8a04",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

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

const getTierBadge = (pts) => {
  if (pts >= 1500) return "Champion";
  if (pts >= 600) return "Expert";
  if (pts >= 200) return "Helper";
  return "Newcomer";
};

const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const FAQ = [
  {
    q: "Do reward points expire?",
    a: "No — your points never expire. They stay in your wallet until you choose to use them on the marketplace.",
  },
  {
    q: "How many points do I earn per task?",
    a: "Points are set by the skill provider when they list their offering. Typically ranges from 35 to 200+ points per completed task.",
  },
  {
    q: "Can I withdraw points as cash?",
    a: "Reward points are community currency and cannot be converted to cash. They're used exclusively within the Anwesha ecosystem.",
  },
  {
    q: "What happens if I get a bad rating?",
    a: "A poor rating won't remove points already earned, but it may affect your tier standing and listing visibility.",
  },
  {
    q: "Is there a limit to how many points I can earn?",
    a: "There's no cap! The more you help, the more you earn. Top Champions have accumulated over 2,500 points.",
  },
];

const RANK_MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

/* ─── Component ────────────────────────────────────── */
const Rewards = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [communityStats, setCommunityStats] = useState({
    totalPoints: 0,
    completedTasks: 0,
    activeMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch("https://anwesha-backend.vercel.app/users"),
          fetch("https://anwesha-backend.vercel.app/projects/count"),
        ]);
        const users = await usersRes.json();

        let completedTasks = 0;
        try {
          const pData = await projectsRes.json();
          completedTasks = pData.completed || 0;
        } catch (e) {
          console.error("Failed to fetch project count:", e);
        }

        const sorted = [...users]
          .filter((u) => (u.rewardPoints || 0) > 0)
          .sort((a, b) => (b.rewardPoints || 0) - (a.rewardPoints || 0))
          .slice(0, 10);

        const board = sorted.map((u, i) => {
          const name = u.name || u.email?.split("@")[0] || "User";
          const pts = u.rewardPoints || 0;
          return {
            rank: i + 1,
            name,
            pts,
            initials: getInitials(name),
            color: AVATAR_COLORS[i % AVATAR_COLORS.length],
            badge: getTierBadge(pts),
            profilePicture: u.profilePicture || null,
          };
        });

        setLeaderboard(board);

        const totalPoints = users.reduce(
          (sum, u) => sum + (u.rewardPoints || 0),
          0,
        );
        setCommunityStats({
          totalPoints,
          completedTasks,
          activeMembers: users.length,
        });
      } catch (err) {
        console.error("Failed to fetch rewards data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="rewards-page">
      {/* ══════ HERO ══════ */}
      <section className="rw-hero">
        <div className="rw-hero-bg-orbs">
          <span className="rw-orb rw-orb--1" />
          <span className="rw-orb rw-orb--2" />
          <span className="rw-orb rw-orb--3" />
        </div>
        <div className="rw-hero-inner">
          <div className="rw-hero-text">
            <span className="rw-hero-eyebrow">
              <IoFlashOutline /> Rewards System
            </span>
            <h1>
              Help Others.
              <br />
              <span className="rw-hero-gradient-text">Earn Rewards.</span>
            </h1>
            <p>
              Anwesha runs on a community-powered reward system. Every time you
              share a skill or fulfill a request, you earn points — redeemable
              for help right back.
            </p>
            <div className="rw-hero-ctas">
              <Link to="/skill-marketplace" className="rw-cta-primary">
                <IoStorefrontOutline /> Browse Marketplace
              </Link>
              <Link to="/my-rewards" className="rw-cta-secondary">
                My Rewards <IoArrowForward />
              </Link>
            </div>
          </div>
          <div className="rw-hero-card">
            <div className="rw-hero-card-label">Community Stats</div>
            <div className="rw-hero-stats">
              <div className="rw-hero-stat">
                <span className="rw-hero-stat-num">
                  {communityStats.totalPoints.toLocaleString()}
                </span>
                <span className="rw-hero-stat-label">Points Distributed</span>
              </div>
              <div className="rw-hero-stat-divider" />
              <div className="rw-hero-stat">
                <span className="rw-hero-stat-num">
                  {communityStats.completedTasks.toLocaleString()}
                </span>
                <span className="rw-hero-stat-label">Tasks Completed</span>
              </div>
              <div className="rw-hero-stat-divider" />
              <div className="rw-hero-stat">
                <span className="rw-hero-stat-num">
                  {communityStats.activeMembers.toLocaleString()}
                </span>
                <span className="rw-hero-stat-label">Active Members</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="rw-how">
        <div className="rw-section-inner">
          <div className="rw-section-header">
            <span className="rw-section-eyebrow">Simple Process</span>
            <h2>How Rewards Work</h2>
            <p>
              Four simple steps from helping to earning — no money involved.
            </p>
          </div>
          <div className="rw-how-steps">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="rw-how-card">
                <div className="rw-how-step-num" style={{ color: step.color }}>
                  {step.step}
                </div>
                <div
                  className="rw-how-icon"
                  style={{ background: step.color + "18", color: step.color }}
                >
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TIERS ══════ */}
      <section className="rw-tiers">
        <div className="rw-section-inner">
          <div className="rw-section-header">
            <span className="rw-section-eyebrow">Membership Tiers</span>
            <h2>Climb the Ranks</h2>
            <p>
              The more you contribute, the higher your standing — and your
              perks.
            </p>
          </div>
          <div className="rw-tiers-grid">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rw-tier-card ${tier.popular ? "rw-tier-card--popular" : ""}`}
                style={{
                  "--tier-color": tier.color,
                  "--tier-bg": tier.bg,
                  "--tier-border": tier.border,
                }}
              >
                {tier.popular && (
                  <div className="rw-tier-popular-badge">Most Achieved</div>
                )}
                <div className="rw-tier-icon">{tier.icon}</div>
                <h3 className="rw-tier-name" style={{ color: tier.color }}>
                  {tier.name}
                </h3>
                <div className="rw-tier-range">{tier.range}</div>
                <ul className="rw-tier-perks">
                  {tier.perks.map((p, i) => (
                    <li key={i}>
                      <IoCheckmarkCircle
                        className="rw-tier-check"
                        style={{ color: tier.color }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LEADERBOARD ══════ */}
      <section className="rw-leaderboard">
        <div className="rw-section-inner">
          <div className="rw-section-header rw-section-header--light">
            <span className="rw-section-eyebrow rw-section-eyebrow--light">
              <IoTrophyOutline /> Hall of Fame
            </span>
            <h2>Top Contributors</h2>
            <p>Our most generous community members this month.</p>
          </div>
          <div className="rw-lb-table">
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Loading leaderboard...
              </div>
            ) : leaderboard.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                No contributors yet. Be the first!
              </div>
            ) : (
              leaderboard.map((member) => (
                <div
                  key={member.rank}
                  className={`rw-lb-row ${member.rank <= 3 ? "rw-lb-row--top" : ""}`}
                >
                  <div className="rw-lb-rank">
                    {RANK_MEDAL[member.rank] || `#${member.rank}`}
                  </div>
                  <div
                    className="rw-lb-avatar"
                    style={{ background: member.color }}
                  >
                    {member.profilePicture ? (
                      <img
                        src={member.profilePicture}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      member.initials
                    )}
                  </div>
                  <div className="rw-lb-name">{member.name}</div>
                  <div className="rw-lb-badge-wrap">
                    <span
                      className={`rw-lb-badge rw-lb-badge--${member.badge.toLowerCase()}`}
                    >
                      {member.badge}
                    </span>
                  </div>
                  <div className="rw-lb-pts">
                    <IoFlashOutline className="rw-lb-pts-icon" />
                    {member.pts.toLocaleString()} pts
                  </div>
                  <div className="rw-lb-bar-wrap">
                    <div
                      className="rw-lb-bar"
                      style={{
                        width: `${(member.pts / (leaderboard[0]?.pts || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="rw-lb-footer">
            <Link to="/my-rewards" className="rw-lb-see-mine">
              See My Position <IoArrowForward />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ WHY REWARDS ══════ */}
      <section className="rw-why">
        <div className="rw-section-inner rw-why-inner">
          <div className="rw-why-text">
            <span className="rw-section-eyebrow">Why It Works</span>
            <h2>
              A Fair Economy
              <br />
              Built on Trust
            </h2>
            <p>
              Unlike cash-based platforms, Anwesha's reward system keeps the
              community honest and collaborative. Everyone starts equal, and
              your standing is purely earned through contribution.
            </p>
            <ul className="rw-why-list">
              <li>
                <IoShieldCheckmarkOutline /> No pay-to-win — points can only be
                earned
              </li>
              <li>
                <IoPeopleOutline /> Community-moderated ratings
              </li>
              <li>
                <IoRocketOutline /> Incentivizes quality over quantity
              </li>
              <li>
                <IoFlashOutline /> Instant point credit on completion
              </li>
            </ul>
            {/* <Link to="/my-rewards" className="rw-cta-primary">
              View My Rewards <IoArrowForward />
            </Link> */}
          </div>
          <div className="rw-why-visual">
            <div className="rw-why-card rw-why-card--1">
              <IoFlashOutline />
              <span>+120 pts</span>
              <small>Full-Stack Web App</small>
            </div>
            <div className="rw-why-card rw-why-card--2">
              <IoStarOutline />
              <span>4.9 ★</span>
              <small>Average Rating</small>
            </div>
            <div className="rw-why-card rw-why-card--3">
              <IoTrophyOutline />
              <span>Expert</span>
              <small>Current Tier</small>
            </div>
            <div className="rw-why-card rw-why-card--4">
              <IoPeopleOutline />
              <span>{communityStats.activeMembers.toLocaleString()}</span>
              <small>Active Members</small>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FAQ ══════ */}
      <section className="rw-faq">
        <div className="rw-section-inner rw-faq-inner">
          <div className="rw-section-header">
            <span className="rw-section-eyebrow">Got Questions?</span>
            <h2>Frequently Asked</h2>
          </div>
          <div className="rw-faq-list">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`rw-faq-item ${openFaq === i ? "rw-faq-item--open" : ""}`}
              >
                <button
                  className="rw-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <IoChevronDown className="rw-faq-chevron" />
                </button>
                <div className="rw-faq-a">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="rw-cta-banner">
        <div className="rw-cta-banner-inner">
          <IoRocketOutline className="rw-cta-banner-icon" />
          <h2>Ready to Start Earning?</h2>
          <p>
            Join thousands of community members already trading skills for
            rewards.
          </p>
          <div className="rw-cta-banner-btns">
            <Link to="/skill-marketplace" className="rw-cta-primary">
              <IoStorefrontOutline /> Explore Marketplace
            </Link>
            <Link
              to="/post-skill"
              className="rw-cta-secondary rw-cta-secondary--dark"
            >
              Offer a Skill <IoArrowForward />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rewards;
