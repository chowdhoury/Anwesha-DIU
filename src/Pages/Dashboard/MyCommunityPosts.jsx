import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoChatbubblesOutline,
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoTimeOutline,
  IoChevronForward,
  IoLayersOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoEyeOutline,
  IoTrendingUpOutline,
  IoAddOutline,
  IoCloseOutline,
} from "react-icons/io5";
import "./MyCommunityPosts.css";

const statusMap = {
  published: { label: "Published", color: "#10b981", bg: "#d1fae5" },
  draft: { label: "Draft", color: "#f59e0b", bg: "#fef3c7" },
  archived: { label: "Archived", color: "#6b7280", bg: "#f1f5f9" },
  hidden: { label: "Hidden", color: "#ef4444", bg: "#fef2f2" },
};

const BADGE_COLORS = {
  Champion: "#ca8a04",
  Expert: "#7c3aed",
  Helper: "#0891b2",
  Team: "#14a800",
};

const TOPICS = [
  "Announcements",
  "Tips & Tricks",
  "Success Stories",
  "Help Needed",
  "Introductions",
  "Others",
];

const MyCommunityPosts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editForm, setEditForm] = useState({ title: "", body: "", topic: "", tags: "" });

  useEffect(() => {
    if (!user) return;
    fetchMyPosts();
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3000/community?author=${user?.email}`,
      );
      const data = await res.json();
      setPosts(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14a800",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:3000/community/${id}`, {
        method: "DELETE",
      });
      await Swal.fire({
        title: "Deleted!",
        text: "Your post has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#14a800",
      });
      fetchMyPosts();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Failed to delete post",
        icon: "error",
        confirmButtonColor: "#14a800",
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "published" ? "archived" : "published";
    try {
      await fetch(`http://localhost:3000/community/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: { status: newStatus } }),
      });
      toast.success(
        `Post ${newStatus === "published" ? "published" : "archived"}`,
      );
      fetchMyPosts();
    } catch (err) {
      toast.error(err.message || "Failed to update post");
    }
  };

  const handleEditClick = (post) => {
    setEditForm({
      title: post.title || "",
      body: post.body || "",
      topic: post.topic || "",
      tags: post.tags?.join(", ") || "",
    });
    setEditModal({ open: true, post });
  };

  const handleEditSubmit = async () => {
    if (!editForm.title.trim() || !editForm.body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    try {
      await fetch(`http://localhost:3000/community/${editModal.post._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          body: editForm.body.trim(),
          topic: editForm.topic.trim(),
          tags: editForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      await Swal.fire({
        title: "Updated!",
        text: "Your post has been updated successfully.",
        icon: "success",
        confirmButtonColor: "#14a800",
      });
      setEditModal({ open: false, post: null });
      fetchMyPosts();
    } catch (err) {
      toast.error(err.message || "Failed to update post");
    }
  };

  const filtered =
    filter === "all"
      ? posts
      : posts.filter((p) => p.metadata?.status === filter);

  const stats = {
    published: posts.filter(
      (p) => p.metadata?.status === "published" || !p.metadata?.status,
    ).length,
    totalLikes: posts.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0),
    totalComments: posts.reduce(
      (sum, p) => sum + (p.engagement?.comments || 0),
      0,
    ),
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
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
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="myposts-loading">
        <div className="myposts-spinner" />
        <p>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div className="myposts">
      <div className="myposts-header">
        <div className="myposts-header-left">
          <h1 className="myposts-title">My Community Posts</h1>
          <p className="myposts-subtitle">
            Manage your contributions to the community
          </p>
        </div>
        <Link to="/community" className="myposts-add-btn">
          <IoAddOutline /> Create New Post
        </Link>
      </div>

      <div className="myposts-stats">
        <div className="myposts-stat">
          <div className="cpstat-icon cpstat-icon--published">
            <IoChatbubblesOutline />
          </div>
          <div className="cpstat-info">
            <span className="cpstat-value">{stats.published}</span>
            <span className="cpstat-label">Published</span>
          </div>
        </div>
        <div className="myposts-stat">
          <div className="cpstat-icon cpstat-icon--likes">
            <IoHeartOutline />
          </div>
          <div className="cpstat-info">
            <span className="cpstat-value">{stats.totalLikes}</span>
            <span className="cpstat-label">Total Likes</span>
          </div>
        </div>
        <div className="myposts-stat">
          <div className="cpstat-icon cpstat-icon--comments">
            <IoChatbubbleOutline />
          </div>
          <div className="cpstat-info">
            <span className="cpstat-value">{stats.totalComments}</span>
            <span className="cpstat-label">Total Comments</span>
          </div>
        </div>
      </div>

      <div className="myposts-filters">
        {["all", "published", "draft", "archived"].map((f) => (
          <button
            key={f}
            className={`cpfilt-btn ${filter === f ? "cpfilt-btn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : statusMap[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="myposts-empty">
          <IoChatbubblesOutline className="empty-icon" />
          <h3>No posts found</h3>
          <p>
            Share your thoughts, tips, or success stories with the community.
          </p>
          <Link to="/community" className="empty-link">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="myposts-list">
          {filtered.map((post) => {
            const s = statusMap[post.metadata?.status] || statusMap.published;
            const badgeColor = BADGE_COLORS[post.author?.badge] || "#6366f1";

            return (
              <div key={post._id} className="cpost-card">
                <div className="cpost-card-top">
                  <div className="cpost-card-top-left">
                    <span
                      className="cpost-status"
                      style={{ color: s.color, background: s.bg }}
                    >
                      {s.label}
                    </span>
                    {post.topic && (
                      <span className="cpost-topic">{post.topic}</span>
                    )}
                  </div>
                  <span className="cpost-date">
                    <IoTimeOutline />
                    {getTimeAgo(post.metadata?.createdAt)}
                  </span>
                </div>

                <h3 className="cpost-title">{post.title}</h3>

                <p className="cpost-body">{post.body}</p>

                <div className="cpost-card-meta">
                  <span className="cpost-meta-chip cpost-meta-chip--likes">
                    <IoHeartOutline /> {post.engagement?.likes || 0} likes
                  </span>
                  <span className="cpost-meta-chip cpost-meta-chip--comments">
                    <IoChatbubbleOutline /> {post.engagement?.comments || 0}{" "}
                    comments
                  </span>
                  {post.metadata?.pinned && (
                    <span className="cpost-meta-chip cpost-meta-chip--pinned">
                      📌 Pinned
                    </span>
                  )}
                </div>

                {post.tags?.length > 0 && (
                  <div className="cpost-tags">
                    {post.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="cpost-tag">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 5 && (
                      <span className="cpost-tag cpost-tag--more">
                        +{post.tags.length - 5}
                      </span>
                    )}
                  </div>
                )}

                <div className="cpost-card-actions">
                  <div className="cpost-actions-left">
                    {(post.metadata?.status === "published" ||
                      !post.metadata?.status) && (
                      <button
                        className="cpost-action-btn cpost-action-btn--archive"
                        onClick={() =>
                          handleToggleStatus(post._id, "published")
                        }
                        title="Archive post"
                      >
                        <IoLayersOutline /> Archive
                      </button>
                    )}
                    {post.metadata?.status === "archived" && (
                      <button
                        className="cpost-action-btn cpost-action-btn--publish"
                        onClick={() => handleToggleStatus(post._id, "archived")}
                        title="Publish post"
                      >
                        <IoTrendingUpOutline /> Publish
                      </button>
                    )}
                    <button
                      className="cpost-action-btn cpost-action-btn--delete"
                      onClick={() => handleDelete(post._id)}
                      title="Delete post"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                  <div className="cpost-actions-right">
                    <button
                      className="cpost-edit-btn"
                      onClick={() => handleEditClick(post)}
                    >
                      <IoCreateOutline /> Edit
                    </button>
                    {/* <Link
                      to={`/community/post/${post._id}`}
                      className="cpost-view-btn"
                    >
                      View Post <IoChevronForward />
                    </Link> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <div className="edit-modal-overlay" onClick={() => setEditModal({ open: false, post: null })}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Post</h2>
              <button
                className="edit-modal-close"
                onClick={() => setEditModal({ open: false, post: null })}
              >
                <IoCloseOutline />
              </button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Post title"
                />
              </div>
              <div className="edit-form-group">
                <label>Topic</label>
                <select
                  value={editForm.topic}
                  onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })}
                >
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-form-group">
                <label>Body</label>
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  placeholder="Write your post content..."
                  rows={5}
                />
              </div>
              <div className="edit-form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="e.g., motivation, success, growth"
                />
              </div>
            </div>
            <div className="edit-modal-footer">
              <button
                className="edit-modal-cancel"
                onClick={() => setEditModal({ open: false, post: null })}
              >
                Cancel
              </button>
              <button className="edit-modal-save" onClick={handleEditSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCommunityPosts;
