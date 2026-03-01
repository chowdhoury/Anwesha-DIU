import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  IoArrowBack,
  IoStarSharp,
  IoStar,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoFlashOutline,
  IoTrophyOutline,
  IoPeopleOutline,
  IoHeartOutline,
  IoShareSocialOutline,
  IoShieldCheckmark,
  IoChevronDown,
  IoChevronUp,
  IoCheckmark,
  IoChatbubbleOutline,
} from "react-icons/io5";
import "./SkillDetail.css";

/* ─── Mock Data (mirrors SkillMarketplace data) ─────── */
const skillsData = {
  "1": {
    id: "1",
    category: "Development & IT",
    title: "Full-Stack Web Development",
    provider: "Arjun Patel",
    initials: "AP",
    avatarColor: "#14a800",
    memberSince: "Jan 2023",
    location: "Mumbai, India",
    rating: 4.9,
    reviews: 312,
    rewardPts: 120,
    deliveryDays: 3,
    tags: ["React", "Node.js", "MongoDB"],
    badge: "Top Rated",
    verified: true,
    helpfulness: "98%",
    tasksCompleted: 87,
    description:
      "I'll build your complete web app with React frontend and Node.js/Express backend. API integration, auth, and deployment included. Whether you need a simple portfolio, e-commerce platform, or complex SaaS dashboard — I've got you covered.",
    packages: [
      {
        name: "Starter",
        pts: 60,
        delivery: 5,
        revisions: 1,
        features: [
          "Landing page (1 page)",
          "Responsive design",
          "Contact form",
          "1 revision",
        ],
      },
      {
        name: "Standard",
        pts: 120,
        delivery: 3,
        revisions: 3,
        features: [
          "Multi-page site (up to 5 pages)",
          "React + Node.js",
          "Database integration",
          "Auth system",
          "3 revisions",
        ],
        popular: true,
      },
      {
        name: "Premium",
        pts: 220,
        delivery: 7,
        revisions: 999,
        features: [
          "Full SaaS MVP",
          "Admin dashboard",
          "Payment integration",
          "CI/CD pipeline",
          "Unlimited revisions",
          "30-day support",
        ],
      },
    ],
    faqs: [
      {
        q: "What technologies do you use?",
        a: "Primarily React, TypeScript, Node.js, Express, and MongoDB or PostgreSQL depending on your needs.",
      },
      {
        q: "Can you work with existing codebases?",
        a: "Absolutely! I can extend, refactor, or debug existing projects. Just share the repo details.",
      },
      {
        q: "Do you offer post-delivery support?",
        a: "The Premium package includes 30 days of support. For other packages, you can negotiate additional support.",
      },
    ],
    testimonials: [
      {
        author: "Priya Sharma",
        initials: "PS",
        color: "#7c3aed",
        rating: 5,
        text: "Arjun delivered an outstanding dashboard. Clean code, on time, and great communication throughout.",
        date: "2 weeks ago",
      },
      {
        author: "Tom Erikson",
        initials: "TE",
        color: "#0891b2",
        rating: 5,
        text: "Best experience on this platform! He went above and beyond — even added features I hadn't asked for.",
        date: "1 month ago",
      },
      {
        author: "Riya Mehta",
        initials: "RM",
        color: "#ea580c",
        rating: 4,
        text: "Very professional and skilled. Minor delay on delivery but the quality made up for it.",
        date: "1 month ago",
      },
    ],
  },
  "2": {
    id: "2",
    category: "Design & Creative",
    title: "UI/UX Design & Figma Prototyping",
    provider: "Sneha Kapoor",
    initials: "SK",
    avatarColor: "#7c3aed",
    memberSince: "Mar 2022",
    location: "Bangalore, India",
    rating: 4.95,
    reviews: 218,
    rewardPts: 90,
    deliveryDays: 2,
    tags: ["Figma", "Wireframing", "Prototyping"],
    badge: "Rising Talent",
    verified: true,
    helpfulness: "99%",
    tasksCompleted: 63,
    description:
      "Get stunning, user-centered UI/UX designs with full Figma files, style guides, and interactive prototypes. I follow design thinking principles and can help from ideation all the way to developer handoff.",
    packages: [
      {
        name: "Basic",
        pts: 45,
        delivery: 2,
        revisions: 1,
        features: ["3 screen designs", "Basic style guide", "1 revision"],
      },
      {
        name: "Standard",
        pts: 90,
        delivery: 3,
        revisions: 3,
        features: [
          "10 screen designs",
          "Full style guide",
          "Interactive prototype",
          "3 revisions",
        ],
        popular: true,
      },
      {
        name: "Pro",
        pts: 180,
        delivery: 7,
        revisions: 999,
        features: [
          "Full app design (30+ screens)",
          "Comprehensive design system",
          "Developer handoff kit",
          "Usability review",
          "Unlimited revisions",
        ],
      },
    ],
    faqs: [
      {
        q: "What file formats do you deliver?",
        a: "You'll receive Figma source files, exported assets (PNG/SVG), and a PDF style guide.",
      },
      {
        q: "Do you do user research?",
        a: "The Pro package includes a quick usability review. Full user research can be added for extra points.",
      },
    ],
    testimonials: [
      {
        author: "Lakshmi Nair",
        initials: "LN",
        color: "#14a800",
        rating: 5,
        text: "Sneha's designs are absolutely gorgeous and she really understood our brand. Highly recommend!",
        date: "3 days ago",
      },
      {
        author: "James Carter",
        initials: "JC",
        color: "#ea580c",
        rating: 5,
        text: "Delivered a pixel-perfect Figma prototype on time. Our dev team loved the handoff files.",
        date: "2 weeks ago",
      },
    ],
  },
};

// Fallback skill for IDs not in our mock
const defaultSkill = skillsData["1"];

/* ─── Component ─────────────────────────────────────── */
const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const skill = skillsData[id] || { ...defaultSkill, id };

  const [selectedPackage, setSelectedPackage] = useState(1); // index
  const [openFaq, setOpenFaq] = useState(null);
  const [wishlist, setWishlist] = useState(false);

  const pkg = skill.packages[selectedPackage];

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <IoStarSharp key={i} className="sd-star-filled" />
      ) : (
        <IoStar key={i} className="sd-star-empty" />
      )
    );

  return (
    <div className="skill-detail-page">
      <div className="sd-container">
        {/* ── Breadcrumb ── */}
        <div className="sd-breadcrumb">
          <button className="sd-back-btn" onClick={() => navigate(-1)}>
            <IoArrowBack /> Back to Marketplace
          </button>
          <nav className="sd-nav-crumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/skill-marketplace">Marketplace</Link>
            <span>/</span>
            <span>{skill.category}</span>
          </nav>
        </div>

        <div className="sd-body">
          {/* ══════ LEFT: Main Content ══════ */}
          <div className="sd-main">
            {/* Provider Info */}
            <div className="sd-provider-strip">
              <div
                className="sd-provider-avatar"
                style={{ background: skill.avatarColor }}
              >
                {skill.initials}
              </div>
              <div className="sd-provider-details">
                <span className="sd-provider-name">
                  {skill.provider}
                  {skill.verified && (
                    <IoCheckmarkCircle className="sd-verified-icon" />
                  )}
                </span>
                <div className="sd-provider-meta">
                  <span>
                    <IoStarSharp className="sd-meta-star" />
                    <strong>{skill.rating}</strong>
                    <span className="sd-meta-muted">({skill.reviews} reviews)</span>
                  </span>
                  <span className="sd-dot">·</span>
                  <span>{skill.tasksCompleted} tasks completed</span>
                  <span className="sd-dot">·</span>
                  <span>{skill.location}</span>
                </div>
              </div>
              <div className="sd-provider-actions">
                <button
                  className={`sd-action-btn ${wishlist ? "sd-action-btn--active" : ""}`}
                  onClick={() => setWishlist(!wishlist)}
                  title="Save"
                >
                  <IoHeartOutline />
                </button>
                <button className="sd-action-btn" title="Share">
                  <IoShareSocialOutline />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="sd-title">{skill.title}</h1>

            {/* Quick Stats */}
            <div className="sd-quick-stats">
              {skill.badge && (
                <span
                  className={`sd-badge ${
                    skill.badge === "Top Rated"
                      ? "sd-badge--gold"
                      : skill.badge === "Expert"
                      ? "sd-badge--blue"
                      : "sd-badge--green"
                  }`}
                >
                  {skill.badge === "Top Rated" && <IoTrophyOutline />}
                  {skill.badge}
                </span>
              )}
              <span className="sd-stat-pill">
                <IoTimeOutline /> {skill.deliveryDays}-day delivery
              </span>
              <span className="sd-stat-pill">
                <IoPeopleOutline /> {skill.helpfulness} helpfulness
              </span>
              <span className="sd-stat-pill sd-stat-pill--green">
                <IoShieldCheckmark /> Verified member
              </span>
            </div>

            {/* Tags */}
            <div className="sd-tags">
              {skill.tags.map((tag) => (
                <span key={tag} className="sd-tag">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <section className="sd-section">
              <h2 className="sd-section-title">About this skill</h2>
              <p className="sd-description">{skill.description}</p>
            </section>

            {/* Package Tabs (mobile) */}
            <div className="sd-packages-mobile">
              <h2 className="sd-section-title">Choose a Package</h2>
              <div className="sd-pkg-tabs">
                {skill.packages.map((p, i) => (
                  <button
                    key={p.name}
                    className={`sd-pkg-tab ${selectedPackage === i ? "active" : ""}`}
                    onClick={() => setSelectedPackage(i)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <div className="sd-pkg-detail">
                <div className="sd-pkg-price">
                  <IoFlashOutline className="sd-pkg-flash" />
                  <span className="sd-pkg-pts">{pkg.pts}</span>
                  <span className="sd-pkg-pts-label">reward pts</span>
                </div>
                <p className="sd-pkg-delivery">
                  <IoTimeOutline /> Delivered in {pkg.delivery} days
                </p>
                <ul className="sd-pkg-features">
                  {pkg.features.map((f) => (
                    <li key={f}>
                      <IoCheckmark className="sd-check" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="sd-cta-btn">
                  <IoFlashOutline /> Request this Skill
                </button>
                <button className="sd-contact-btn">
                  <IoChatbubbleOutline /> Message Provider
                </button>
              </div>
            </div>

            {/* FAQ */}
            <section className="sd-section">
              <h2 className="sd-section-title">Frequently Asked Questions</h2>
              <div className="sd-faq-list">
                {skill.faqs.map((item, i) => (
                  <div
                    key={i}
                    className={`sd-faq-item ${openFaq === i ? "open" : ""}`}
                  >
                    <button
                      className="sd-faq-q"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      {item.q}
                      {openFaq === i ? <IoChevronUp /> : <IoChevronDown />}
                    </button>
                    <p className="sd-faq-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="sd-section">
              <h2 className="sd-section-title">
                Reviews
                <span className="sd-reviews-count">
                  <IoStarSharp className="sd-star-filled" />
                  {skill.rating} · {skill.reviews} reviews
                </span>
              </h2>

              <div className="sd-reviews-grid">
                {skill.testimonials.map((t, i) => (
                  <div key={i} className="sd-review-card">
                    <div className="sd-review-header">
                      <div
                        className="sd-review-avatar"
                        style={{ background: t.color }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <span className="sd-review-author">{t.author}</span>
                        <div className="sd-review-stars">
                          {renderStars(t.rating)}
                          <span className="sd-review-date">{t.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="sd-review-text">{t.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ══════ RIGHT: Sticky Order Panel ══════ */}
          <aside className="sd-order-panel">
            {/* Package Selector */}
            <div className="sd-order-tabs">
              {skill.packages.map((p, i) => (
                <button
                  key={p.name}
                  className={`sd-order-tab ${selectedPackage === i ? "active" : ""}`}
                  onClick={() => setSelectedPackage(i)}
                >
                  {p.name}
                  {p.popular && <span className="sd-popular-badge">Popular</span>}
                </button>
              ))}
            </div>

            <div className="sd-order-body">
              {/* Price */}
              <div className="sd-order-price">
                <IoFlashOutline className="sd-order-flash" />
                <span className="sd-order-pts">{pkg.pts}</span>
                <span className="sd-order-pts-label">reward points</span>
              </div>
              <p className="sd-order-delivery">
                <IoTimeOutline /> Delivered in {pkg.delivery} days · {pkg.revisions === 999 ? "Unlimited" : pkg.revisions} revision{pkg.revisions !== 1 ? "s" : ""}
              </p>

              {/* Features */}
              <ul className="sd-order-features">
                {pkg.features.map((f) => (
                  <li key={f}>
                    <IoCheckmark className="sd-order-check" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <button className="sd-cta-btn sd-cta-btn--full">
                <IoFlashOutline /> Request this Skill
              </button>
              <button className="sd-contact-btn sd-contact-btn--full">
                <IoChatbubbleOutline /> Message Provider
              </button>

              {/* Trust Badges */}
              <div className="sd-trust-badges">
                <div className="sd-trust-item">
                  <IoShieldCheckmark className="sd-trust-icon" />
                  <span>Community-backed safety</span>
                </div>
                <div className="sd-trust-item">
                  <IoCheckmarkCircle className="sd-trust-icon" />
                  <span>Reward protected exchange</span>
                </div>
              </div>
            </div>

            {/* Provider Card */}
            <div className="sd-provider-mini-card">
              <div className="sd-provider-mini-header">
                <div
                  className="sd-provider-mini-avatar"
                  style={{ background: skill.avatarColor }}
                >
                  {skill.initials}
                </div>
                <div>
                  <span className="sd-provider-mini-name">{skill.provider}</span>
                  <span className="sd-provider-mini-since">
                    Member since {skill.memberSince}
                  </span>
                </div>
              </div>
              <div className="sd-provider-mini-stats">
                <div className="sd-mini-stat">
                  <span className="sd-mini-stat-val">{skill.rating}</span>
                  <span className="sd-mini-stat-label">Rating</span>
                </div>
                <div className="sd-mini-stat">
                  <span className="sd-mini-stat-val">{skill.helpfulness}</span>
                  <span className="sd-mini-stat-label">Helpfulness</span>
                </div>
                <div className="sd-mini-stat">
                  <span className="sd-mini-stat-val">{skill.tasksCompleted}</span>
                  <span className="sd-mini-stat-label">Completed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
