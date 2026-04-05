import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
// import { notificationsApi } from "../../utils/api";
import { useSocket } from "../../hooks/useSocket";
import toast from "react-hot-toast";
import {
  IoNotificationsOutline,
  IoCheckmarkDoneOutline,
  IoTimeOutline,
  IoRocketOutline,
  IoCheckmarkCircleOutline,
  IoSendOutline,
  IoAlertCircleOutline,
  IoStarOutline,
  IoChatbubbleOutline,
  IoTrophyOutline,
  IoShieldCheckmarkOutline,
  IoWalletOutline,
} from "react-icons/io5";
import "./Notifications.css";

const typeIcons = {
  offer_received: <IoSendOutline />,
  offer_accepted: <IoCheckmarkCircleOutline />,
  offer_rejected: <IoAlertCircleOutline />,
  delivery_submitted: <IoRocketOutline />,
  delivery_accepted: <IoCheckmarkCircleOutline />,
  revision_requested: <IoAlertCircleOutline />,
  points_received: <IoWalletOutline />,
  points_locked: <IoWalletOutline />,
  points_refunded: <IoWalletOutline />,
  new_review: <IoStarOutline />,
  new_message: <IoChatbubbleOutline />,
  dispute_opened: <IoShieldCheckmarkOutline />,
  dispute_resolved: <IoShieldCheckmarkOutline />,
  badge_earned: <IoTrophyOutline />,
  auto_released: <IoWalletOutline />,
};

const typeColors = {
  offer_received: "#3b82f6",
  offer_accepted: "#10b981",
  delivery_submitted: "#8b5cf6",
  delivery_accepted: "#10b981",
  revision_requested: "#ef4444",
  points_received: "#10b981",
  new_review: "#f59e0b",
  new_message: "#6366f1",
  badge_earned: "#f59e0b",
  auto_released: "#f59e0b",
};

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { on } = useSocket();

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page]);

  // Real-time
  useEffect(() => {
    const unsub = on("notification:new", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });
    return () => unsub?.();
  }, [on]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.list({ page, limit: 20 });
      setNotifications(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "Yesterday";
    return d.toLocaleDateString();
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notif-loading">
        <div className="notif-spinner" />
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notif-header">
        <div>
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={handleMarkAllRead}>
            <IoCheckmarkDoneOutline /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notif-empty">
          <IoNotificationsOutline className="notif-empty-icon" />
          <h3>No notifications yet</h3>
          <p>
            When you receive offers, messages, or updates, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((notif) => {
            const icon = typeIcons[notif.type] || <IoNotificationsOutline />;
            const color = typeColors[notif.type] || "#6366f1";

            return (
              <div
                key={notif._id}
                className={`notif-item ${!notif.read ? "notif-item--unread" : ""}`}
                onClick={() => !notif.read && handleMarkRead(notif._id)}
              >
                <div
                  className="notif-icon"
                  style={{ color, background: `${color}15` }}
                >
                  {icon}
                </div>
                <div className="notif-body">
                  <h4 className="notif-item-title">{notif.title}</h4>
                  <p className="notif-message">{notif.message}</p>
                  <span className="notif-time">
                    <IoTimeOutline /> {formatTime(notif.createdAt)}
                  </span>
                </div>
                {notif.link && (
                  <Link
                    to={notif.link}
                    className="notif-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                )}
                {!notif.read && <span className="notif-dot" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="notif-pagination">
          <button
            className="notpag-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="notpag-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="notpag-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
