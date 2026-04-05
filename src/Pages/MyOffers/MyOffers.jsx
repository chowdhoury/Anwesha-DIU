import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import toast from "react-hot-toast";
import {
  IoRocketOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoTrophyOutline,
  IoChevronForward,
  IoSendOutline,
  IoTrashOutline,
  IoStarOutline,
} from "react-icons/io5";
import "./MyOffers.css";

const statusMap = {
  pending: { label: "Pending", color: "#f59e0b", bg: "#fef3c7" },
  accepted: { label: "Accepted", color: "#10b981", bg: "#d1fae5" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#fef2f2" },
  withdrawn: { label: "Withdrawn", color: "#6b7280", bg: "#f1f5f9" },
};

const MyOffers = () => {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [withdrawId, setWithdrawId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://anwesha-backend.vercel.app/applications/user/${encodeURIComponent(user.email)}`,
      );
      if (!res.ok) throw new Error("Failed to fetch offers");
      const data = await res.json();
      setOffers(data || []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawId) return;
    try {
      const res = await fetch(
        `https://anwesha-backend.vercel.app/applications/${withdrawId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "withdrawn" }),
        },
      );
      if (!res.ok) throw new Error("Failed to withdraw offer");
      toast.success("Offer withdrawn");
      fetchOffers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWithdrawId(null);
    }
  };

  const filtered =
    filter === "all" ? offers : offers.filter((o) => o.status === filter);

  const stats = {
    pending: offers.filter((o) => o.status === "pending").length,
    accepted: offers.filter((o) => o.status === "accepted").length,
    total: offers.length,
  };

  if (loading) {
    return (
      <div className="myoffers-loading">
        <div className="myoffers-spinner" />
        <p>Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="myoffers">
      <div className="myoffers-header">
        <h1 className="myoffers-title">My Offers</h1>
        <p className="myoffers-subtitle">
          Track offers you've submitted to help requests
        </p>
      </div>

      <div className="myoffers-stats">
        <div className="myoffers-stat">
          <div className="ofstat-icon ofstat-icon--pending">
            <IoTimeOutline />
          </div>
          <div className="ofstat-info">
            <span className="ofstat-value">{stats.pending}</span>
            <span className="ofstat-label">Pending</span>
          </div>
        </div>
        <div className="myoffers-stat">
          <div className="ofstat-icon ofstat-icon--accepted">
            <IoCheckmarkCircleOutline />
          </div>
          <div className="ofstat-info">
            <span className="ofstat-value">{stats.accepted}</span>
            <span className="ofstat-label">Accepted</span>
          </div>
        </div>
        <div className="myoffers-stat">
          <div className="ofstat-icon ofstat-icon--total">
            <IoSendOutline />
          </div>
          <div className="ofstat-info">
            <span className="ofstat-value">{stats.total}</span>
            <span className="ofstat-label">Total Sent</span>
          </div>
        </div>
      </div>

      <div className="myoffers-filters">
        {["all", "pending", "accepted", "rejected", "withdrawn"].map((f) => (
          <button
            key={f}
            className={`offilt-btn ${filter === f ? "offilt-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : statusMap[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="myoffers-empty">
          <IoSendOutline className="empty-icon" />
          <h3>No offers found</h3>
          <p>Start helping others by submitting offers to help requests.</p>
          <Link to="/find-requests" className="empty-link">
            Browse Requests
          </Link>
        </div>
      ) : (
        <div className="myoffers-list">
          {filtered.map((offer) => {
            const s = statusMap[offer.status] || statusMap.pending;
            return (
              <div key={offer._id} className="offer-card">
                <div className="offer-card-top">
                  <span
                    className="offer-status"
                    style={{ color: s.color, background: s.bg }}
                  >
                    {s.label}
                  </span>
                  <span className="offer-date">
                    <IoTimeOutline />
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="offer-request-title">
                  {offer.post?.title || "Request"}
                </h3>

                {offer.coverMessage && (
                  <p className="offer-cover">{offer.coverMessage}</p>
                )}

                <div className="offer-card-meta">
                  <span className="offer-meta-chip">
                    <IoTrophyOutline /> {offer.expectedReward} pts
                  </span>
                  <span className="offer-meta-chip">
                    <IoRocketOutline /> {offer.proposedDeadline}
                  </span>
                  {offer.post?.category && (
                    <span className="offer-meta-chip">
                      {offer.post.category}
                    </span>
                  )}
                  {offer.skills?.map((skill) => (
                    <span key={skill} className="offer-meta-chip">
                      <IoStarOutline /> {skill}
                    </span>
                  ))}
                </div>

                <div className="offer-card-actions">
                  {offer.status === "pending" && (
                    <button
                      className="offer-withdraw-btn"
                      onClick={() => setWithdrawId(offer._id)}
                    >
                      <IoTrashOutline /> Withdraw
                    </button>
                  )}
                  <Link
                    to={`/request/${offer.postId}`}
                    className="offer-view-btn"
                  >
                    View Request <IoChevronForward />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {withdrawId && (
        <div className="withdraw-overlay" onClick={() => setWithdrawId(null)}>
          <div className="withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="withdraw-modal-icon">
              <IoTrashOutline />
            </div>
            <h3 className="withdraw-modal-title">Withdraw Offer?</h3>
            <p className="withdraw-modal-desc">
              Are you sure you want to withdraw this offer? This action cannot
              be undone.
            </p>
            <div className="withdraw-modal-actions">
              <button
                className="withdraw-cancel-btn"
                onClick={() => setWithdrawId(null)}
              >
                Cancel
              </button>
              <button className="withdraw-confirm-btn" onClick={handleWithdraw}>
                Yes, Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOffers;
