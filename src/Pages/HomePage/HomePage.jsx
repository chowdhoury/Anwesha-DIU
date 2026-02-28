import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  IoSearch,
  IoArrowForward,
  IoCheckmarkCircle,
  IoShieldCheckmark,
  IoStarSharp,
  IoStar, 
  IoGift,
} from "react-icons/io5";
import {
  FaCode,
  FaPaintBrush,
  FaPenFancy,
  FaBullhorn,
  FaChartLine,
  FaHeadset,
  FaFileAlt,
  FaMobileAlt,
  FaQuoteLeft,
  FaUserCheck,
  FaHandshake,
  FaRocket,
  FaCoins,
  FaExchangeAlt,
} from "react-icons/fa";
import "./HomePage.css";

/* ─── Data ──────────────────────────────────────────── */
const heroHeadlines = [
  { highlight: "developers", text: "to help with your project" },
  { highlight: "designers", text: "to bring ideas to life" },
  { highlight: "mentors", text: "to guide your growth" },
  { highlight: "creators", text: "to collaborate with" },
];

const trustedLogos = ["Microsoft", "Airbnb", "Bissell", "Glassdoor", "GoDaddy"];

const categories = [
  {
    icon: <FaCode />,
    title: "Development & IT",
    jobs: "1,853 skills",
    rating: "4.85/5",
  },
  {
    icon: <FaPaintBrush />,
    title: "Design & Creative",
    jobs: "968 skills",
    rating: "4.91/5",
  },
  {
    icon: <FaPenFancy />,
    title: "Writing & Translation",
    jobs: "505 skills",
    rating: "4.92/5",
  },
  {
    icon: <FaBullhorn />,
    title: "Sales & Marketing",
    jobs: "392 skills",
    rating: "4.77/5",
  },
  {
    icon: <FaChartLine />,
    title: "Finance & Accounting",
    jobs: "214 skills",
    rating: "4.79/5",
  },
  {
    icon: <FaHeadset />,
    title: "Admin & Customer Support",
    jobs: "508 skills",
    rating: "4.77/5",
  },
  {
    icon: <FaFileAlt />,
    title: "Engineering & Architecture",
    jobs: "650 skills",
    rating: "4.83/5",
  },
  {
    icon: <FaMobileAlt />,
    title: "AI & Machine Learning",
    jobs: "732 skills",
    rating: "4.88/5",
  },
];

const features = [
  {
    icon: <FaCoins />,
    title: "Earn Digital Rewards",
    desc: "Help others and earn digital reward points. Use your rewards to get help from the community in return.",
  },
  {
    icon: <FaExchangeAlt />,
    title: "Give & Get Help",
    desc: "A reciprocal ecosystem — share your skills to earn rewards, then spend them when you need assistance.",
  },
  {
    icon: <IoShieldCheckmark />,
    title: "No Money Involved",
    desc: "Forget wallets and invoices. Everything runs on digital rewards — fair, transparent, and community-driven.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Post a Request",
    desc: "Describe what you need help with. Set the reward points you're offering and get responses within hours.",
  },
  {
    step: "02",
    title: "Find the Right Match",
    desc: "Browse helpers, review profiles & ratings, and pick the perfect person to collaborate with.",
  },
  {
    step: "03",
    title: "Reward & Get Rewarded",
    desc: "Once the task is done, reward the helper with digital points. Help others to earn your own rewards!",
  },
];

const testimonials = [
  {
    quote:
      "I helped someone debug their app and earned enough rewards to get a full logo redesign. No money exchanged — just skills!",
    author: "Priya Sharma",
    role: "Full Stack Developer",
    rating: 5,
  },
  {
    quote:
      "The reward system is genius. I designed a website for someone and used my points to get marketing help. True collaboration!",
    author: "Alex Turner",
    role: "UI/UX Designer",
    rating: 5,
  },
  {
    quote:
      "As a student, I can't afford freelancers. On Anwesha, I just help others and earn rewards to get the help I need.",
    author: "Rohan Mehta",
    role: "Computer Science Student",
    rating: 5,
  },
];

const popularSkills = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "UI/UX Design",
  "WordPress",
  "Data Entry",
  "Graphic Design",
  "SEO",
  "Content Writing",
  "Mobile App Dev",
  "Figma",
  "Video Editing",
];

/* ─── Component ─────────────────────────────────────── */
const HomePage = () => {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % heroHeadlines.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const { highlight, text } = heroHeadlines[headlineIndex];

  return (
    <div className="home">
      {/* ══════ HERO ══════ */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Help others. <br />
              Earn rewards.
            </h1>
            <p className="hero-subtitle">
              No money needed. Share your skills, earn digital rewards, and use
              them to get help in return. Find&nbsp;
              <span className="hero-highlight" key={headlineIndex}>
                {highlight}
              </span>{" "}
              {text}.
            </p>

            {/* Search Bar */}
            <div className="hero-search">
              <IoSearch className="search-icon" />
              <input
                type="text"
                placeholder='Try "React developer" or "Logo design"'
                className="search-input"
              />
              <button className="search-btn">Search</button>
            </div>

            {/* Popular Skills */}
            <div className="hero-popular">
              <span className="popular-label">Popular:</span>
              <div className="popular-tags">
                {popularSkills.slice(0, 5).map((skill) => (
                  <Link to="/skill-marketplace" className="popular-tag" key={skill}>
                    {skill}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image / Stats Card */}
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-avatar">
                <div className="avatar-placeholder">JS</div>
                <div className="online-dot"></div>
              </div>
              <div className="hero-card-info">
                <h4>John Smith</h4>
                <p>Full Stack Developer</p>
                <div className="hero-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <IoStarSharp key={i} className="star-icon" />
                  ))}
                  <span>4.9 (2,847 reviews)</span>
                </div>
              </div>
              <div className="hero-card-stats">
                <div className="stat">
                  <span className="stat-val">850</span>
                  <span className="stat-label">Reward Pts</span>
                </div>
                <div className="stat">
                  <span className="stat-val">97%</span>
                  <span className="stat-label">Helpfulness</span>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="floating-badge badge-1">
              <IoCheckmarkCircle className="badge-icon green" />
              <span>Top Rated Plus</span>
            </div>
            <div className="floating-badge badge-2">
              <FaRocket className="badge-icon blue" />
              <span>Available Now</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TRUSTED BY ══════ */}
      <section className="trusted">
        <div className="section-container">
          <p className="trusted-label">
            Trusted by leading brands and startups
          </p>
          <div className="trusted-logos">
            {trustedLogos.map((name) => (
              <span className="trusted-logo" key={name}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CATEGORIES ══════ */}
      <section className="categories">
        <div className="section-container">
          <h2 className="section-title">Browse talent by category</h2>
          <p className="section-subtitle">
            Looking for work?{" "}
            <Link to="/skill-marketplace" className="link-green">
              Browse the marketplace
            </Link>
          </p>

          <div className="category-grid">
            {categories.map((cat) => (
              <Link to="/skill-marketplace" className="category-card" key={cat.title}>
                <div className="category-icon">{cat.icon}</div>
                <h3 className="category-title">{cat.title}</h3>
                <div className="category-meta">
                  <span className="category-rating">
                    <IoStarSharp className="star-small" /> {cat.rating}
                  </span>
                  <span className="category-jobs">{cat.jobs}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY CHOOSE US ══════ */}
      <section className="why-section">
        <div className="section-container">
          <div className="why-header">
            <h2 className="section-title">Why people love Anwesha</h2>
          </div>

          <div className="why-grid">
            {features.map((f) => (
              <div className="why-card" key={f.title}>
                <div className="why-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-block">
              <h3>4.9/5</h3>
              <p>Average community satisfaction rating</p>
            </div>
            <div className="stat-block">
              <h3>100% Free</h3>
              <p>No payments — just digital rewards</p>
            </div>
            <div className="stat-block">
              <h3>50K+</h3>
              <p>Reward-powered tasks completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="how-section">
        <div className="section-container">
          <h2 className="section-title center">How it works</h2>
          <p className="section-subtitle center">
            Get started in just a few simple steps
          </p>

          <div className="how-grid">
            {howItWorks.map((item) => (
              <div className="how-card" key={item.step}>
                <span className="how-step">{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ POPULAR SKILLS ══════ */}
      <section className="skills-section">
        <div className="section-container">
          <h2 className="section-title">Browse top skills</h2>
          <div className="skills-grid">
            {popularSkills.map((skill) => (
              <Link to="/skill-marketplace" className="skill-chip" key={skill}>
                {skill}
                <IoArrowForward className="chip-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section className="testimonials">
        <div className="section-container">
          <h2 className="section-title center">What our community says</h2>

          <div className="testimonial-grid">
            {testimonials.map((t, idx) => (
              <div className="testimonial-card" key={idx}>
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{t.quote}</p>
                <div className="testimonial-rating">
                  {[...Array(t.rating)].map((_, i) => (
                    <IoStar key={i} className="star-icon" />
                  ))}
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {t.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <strong>{t.author}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="cta-banner">
        <div className="section-container cta-inner">
          <div className="cta-text">
            <h2>Share your skills. Earn rewards. Get help when you need it.</h2>
            <p>
              Join a community where talent is the currency and everyone wins.
            </p>
          </div>
          <Link to="/signup" className="cta-button">
            Join for Free <IoArrowForward />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
