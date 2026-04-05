import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import { messagesApi } from "../../utils/messagesApi";
import toast from "react-hot-toast";
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
  IoClose,
} from "react-icons/io5";
import "./SkillDetail.css";

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
  const hash = (name || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Transform API data to component format
const transformSkillData = (apiData) => {
  const sellerName = apiData.seller?.name || "Unknown";
  const initials = sellerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: apiData._id,
    category: apiData.category,
    title: apiData.title,
    provider: sellerName,
    sellerId: apiData.seller?.id || null,
    providerEmail: apiData.seller?.email,
    providerPhoto: apiData.seller?.photoURL,
    initials: initials,
    avatarColor: generateAvatarColor(sellerName),
    memberSince: new Date(apiData.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    location: "Online",
    rating: apiData.rating || 4.5,
    reviews: apiData.reviews || 0,
    rewardPts: apiData.packages?.[0]?.price || 0,
    deliveryDays: apiData.packages?.[0]?.deliveryDays || 7,
    tags: apiData.tags || [],
    badge: apiData.status === "active" ? null : null,
    verified: apiData.status === "active",
    helpfulness: "95%",
    tasksCompleted: apiData.tasksCompleted || 0,
    description: apiData.description,
    packages: (apiData.packages || []).map((pkg) => ({
      name: pkg.name,
      pts: pkg.price,
      delivery: pkg.deliveryDays,
      revisions:
        pkg.revisions === "Unlimited" ? 999 : parseInt(pkg.revisions) || 1,
      features: pkg.features || [],
      popular: pkg.name === "Standard",
    })),
    faqs: apiData.faqs || [
      {
        q: "How do I get started?",
        a: "Simply select a package and click 'Request this Skill'. The provider will get back to you shortly.",
      },
      {
        q: "What if I'm not satisfied?",
        a: "We have a reward protection system in place. If the work doesn't meet the agreed requirements, you can request a refund.",
      },
    ],
    testimonials: apiData.testimonials || [],
  };
};

/* ─── Component ─────────────────────────────────────── */
const SkillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireMessage, setHireMessage] = useState("");
  const [hireSubmitting, setHireSubmitting] = useState(false);

  const handleHireClick = () => {
    if (!user) {
      toast.error("Please sign in to request hiring");
      return navigate("/signin");
    }
    if (skill?.sellerId === user.uid) {
      return toast.error("You cannot hire yourself");
    }
    setShowHireModal(true);
  };

  const handleHireSubmit = async () => {
    if (!hireMessage.trim()) {
      return toast.error("Please describe what you need");
    }
    setHireSubmitting(true);
    try {
      const pkg = skill.packages[selectedPackage] || skill.packages[0];
      const res = await fetch("http://localhost:3000/hire-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: skill.id,
          skillTitle: skill.title,
          package: pkg.name,
          rewardPoints: pkg.pts,
          deliveryDays: pkg.delivery,
          message: hireMessage.trim(),
          client: {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          },
          provider: {
            uid: skill.sellerId,
            name: skill.provider,
            email: skill.providerEmail,
            photoURL: skill.providerPhoto,
          },
          status: "pending",
          createdAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send request");
      toast.success("Hire request sent successfully!");
      setShowHireModal(false);
      setHireMessage("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setHireSubmitting(false);
    }
  };

  const handleMessageProvider = async () => {
    if (!user) {
      toast.error("Please sign in to message this provider");
      return navigate("/signin");
    }
    if (!skill) return;

    const sellerUid = skill.sellerId;
    if (!sellerUid) {
      return toast.error("Cannot message this provider");
    }
    if (sellerUid === user.uid) {
      return toast.error("This is your own skill");
    }

    setMessagingLoading(true);
    try {
      const { conversationId } = await messagesApi.findOrCreateConversation({
        myUid: user.uid,
        myName: user.displayName,
        myPhoto: user.photoURL,
        myEmail: user.email,
        otherUid: sellerUid,
        otherName: skill.provider,
        otherPhoto: skill.providerPhoto,
        otherEmail: skill.providerEmail,
      });
      navigate(`/dashboard/messages?c=${encodeURIComponent(conversationId)}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversation");
    } finally {
      setMessagingLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/skills/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Skill not found");
        return response.json();
      })
      .then((data) => {
        setSkill(transformSkillData(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="skill-detail-page">
        <div className="sd-container sd-loading">
          <div className="sd-spinner"></div>
          <p>Loading skill details...</p>
        </div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="skill-detail-page">
        <div className="sd-container sd-error">
          <h2>Skill Not Found</h2>
          <p>{error || "The skill you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/skill-marketplace")}
            className="sd-cta-btn"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const pkg = skill.packages[selectedPackage] || skill.packages[0];

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) =>
      i < Math.floor(rating) ? (
        <IoStarSharp key={i} className="sd-star-filled" />
      ) : (
        <IoStar key={i} className="sd-star-empty" />
      ),
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
                    <span className="sd-meta-muted">
                      ({skill.reviews} reviews)
                    </span>
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
                <button className="sd-cta-btn" onClick={handleHireClick}>
                  <IoFlashOutline /> Request to hire
                </button>
                <button
                  className="sd-contact-btn"
                  onClick={handleMessageProvider}
                  disabled={messagingLoading}
                >
                  <IoChatbubbleOutline />{" "}
                  {messagingLoading ? "Opening..." : "Message Provider"}
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
                  {p.popular && (
                    <span className="sd-popular-badge">Popular</span>
                  )}
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
                <IoTimeOutline /> Delivered in {pkg.delivery} days ·{" "}
                {pkg.revisions === 999 ? "Unlimited" : pkg.revisions} revision
                {pkg.revisions !== 1 ? "s" : ""}
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
              <button
                className="sd-cta-btn sd-cta-btn--full"
                onClick={handleHireClick}
              >
                <IoFlashOutline /> Request to hire
              </button>
              <button
                className="sd-contact-btn sd-contact-btn--full"
                onClick={handleMessageProvider}
                disabled={messagingLoading}
              >
                <IoChatbubbleOutline />{" "}
                {messagingLoading ? "Opening..." : "Message Provider"}
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
                  <span className="sd-provider-mini-name">
                    {skill.provider}
                  </span>
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
                  <span className="sd-mini-stat-val">
                    {skill.tasksCompleted}
                  </span>
                  <span className="sd-mini-stat-label">Completed</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════ Hire Request Modal ══════ */}
      {showHireModal && (
        <div
          className="sd-modal-overlay"
          onClick={() => setShowHireModal(false)}
        >
          <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="sd-modal-close"
              onClick={() => setShowHireModal(false)}
            >
              <IoClose />
            </button>

            <h2 className="sd-modal-title">Request to Hire</h2>
            <p className="sd-modal-subtitle">
              Send a hire request to <strong>{skill.provider}</strong>
            </p>

            {/* Selected Package Summary */}
            <div className="sd-modal-pkg-summary">
              <div className="sd-modal-pkg-row">
                <span className="sd-modal-pkg-label">Skill</span>
                <span className="sd-modal-pkg-value">{skill.title}</span>
              </div>
              <div className="sd-modal-pkg-row">
                <span className="sd-modal-pkg-label">Package</span>
                <span className="sd-modal-pkg-value">{pkg.name}</span>
              </div>
              <div className="sd-modal-pkg-row">
                <span className="sd-modal-pkg-label">Reward Points</span>
                <span className="sd-modal-pkg-value sd-modal-pkg-pts">
                  <IoFlashOutline /> {pkg.pts} pts
                </span>
              </div>
              <div className="sd-modal-pkg-row">
                <span className="sd-modal-pkg-label">Delivery</span>
                <span className="sd-modal-pkg-value">{pkg.delivery} days</span>
              </div>
            </div>

            {/* Message */}
            <div className="sd-modal-field">
              <label htmlFor="sd-hire-msg">Describe what you need</label>
              <textarea
                id="sd-hire-msg"
                className="sd-modal-textarea"
                rows={4}
                placeholder="Tell the provider what you need help with, any specific requirements, deadlines, etc."
                value={hireMessage}
                onChange={(e) => setHireMessage(e.target.value)}
              />
            </div>

            <div className="sd-modal-actions">
              <button
                className="sd-contact-btn"
                onClick={() => setShowHireModal(false)}
              >
                Cancel
              </button>
              <button
                className="sd-cta-btn"
                onClick={handleHireSubmit}
                disabled={hireSubmitting}
              >
                {hireSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <IoFlashOutline /> Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillDetail;
