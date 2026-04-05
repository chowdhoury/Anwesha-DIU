import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { AuthContext } from "../../Authentication/AuthContext";
import { messagesApi } from "../../utils/messagesApi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  IoCloseOutline,
  IoSendOutline,
  IoAttachOutline,
  IoDocumentOutline,
  IoDownloadOutline,
  IoPersonOutline,
  IoCheckmarkDoneOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoRefreshOutline,
  IoBanOutline,
  IoRocketOutline,
  IoTimeOutline,
} from "react-icons/io5";
import "./ProjectChat.css";

const ACTION_CONFIG = {
  cancel_request: {
    label: "Cancellation Requested",
    icon: <IoBanOutline />,
    color: "#ef4444",
    bg: "#fef2f2",
  },
  accept_cancel: {
    label: "Cancellation Accepted",
    icon: <IoBanOutline />,
    color: "#dc2626",
    bg: "#fef2f2",
  },
  delivered: {
    label: "Marked as Delivered",
    icon: <IoCheckmarkCircleOutline />,
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  revision_request: {
    label: "Revision Requested",
    icon: <IoRefreshOutline />,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  accept_delivery: {
    label: "Delivery Accepted",
    icon: <IoCheckmarkCircleOutline />,
    color: "#10b981",
    bg: "#ecfdf5",
  },
  reject_cancel: {
    label: "Cancellation Rejected",
    icon: <IoAlertCircleOutline />,
    color: "#6366f1",
    bg: "#eef2ff",
  },
};

const ProjectChat = ({ project, onClose, onProjectUpdate }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

  const myRole =
    project.members?.find((m) => m.email === user?.email)?.role || "member";
  const isOwner = myRole === "owner";
  const projectStatus = project.status;

  // Initialize conversation and load messages
  useEffect(() => {
    if (!project || !user) return;
    initChat();
    return () => clearInterval(pollRef.current);
  }, [project?._id, user?.uid]);

  const initChat = async () => {
    try {
      setLoading(true);
      const { conversationId: convId } =
        await messagesApi.findOrCreateProjectConversation({
          projectId: project._id,
          participants: project.members || [],
        });
      setConversationId(convId);

      const msgs = await messagesApi.getMessages(convId, { limit: 100 });
      setMessages(msgs || []);
      scrollToBottom();

      if (user) {
        await messagesApi.markRead(convId, user.uid);
      }

      // Poll for new messages
      pollRef.current = setInterval(async () => {
        try {
          const newMsgs = await messagesApi.getMessages(convId, { limit: 100 });
          setMessages(newMsgs || []);
        } catch {
          // silent
        }
      }, 3000);
    } catch (err) {
      console.error("Failed to init chat:", err);
      toast.error("Failed to load chat");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId || !user || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic update
    const tempMsg = {
      _id: Date.now(),
      conversationId,
      sender: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      content,
      type: "text",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom();

    try {
      await messagesApi.send({
        conversationId,
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        content,
      });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const result = await messagesApi.uploadProjectFile({
            projectId: project._id,
            fileName: file.name,
            fileData: reader.result,
            fileSize: file.size,
            senderUid: user.uid,
            senderName: user.displayName,
            senderPhoto: user.photoURL,
          });

          // Add to messages optimistically
          if (result.chatMessage) {
            setMessages((prev) => [...prev, result.chatMessage]);
            scrollToBottom();
          }
          toast.success("File shared successfully");
        } catch {
          toast.error("Failed to upload file");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to read file");
      setUploading(false);
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAction = async (actionType) => {
    const actionLabels = {
      cancel_request: "request cancellation of this project",
      accept_cancel:
        "accept the cancellation and permanently cancel this project",
      delivered: "mark this project as delivered",
      revision_request: "request a revision",
      accept_delivery: "accept the delivery and complete this project",
      reject_cancel: "reject the cancellation and resume the project",
    };

    const result = await Swal.fire({
      title: "Confirm Action",
      text: `Are you sure you want to ${actionLabels[actionType]}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await messagesApi.sendProjectAction({
        projectId: project._id,
        actionType,
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
      });

      toast.success("Action processed successfully");

      // Refresh messages
      if (conversationId) {
        const msgs = await messagesApi.getMessages(conversationId, {
          limit: 100,
        });
        setMessages(msgs || []);
        scrollToBottom();
      }

      // Notify parent to refresh project data
      if (onProjectUpdate) {
        const extraFields = {};
        if (actionType === "cancel_request") {
          extraFields.cancelRequestedBy = user.uid;
        }
        if (actionType === "accept_cancel") {
          extraFields.cancelledAt = new Date().toISOString();
        }
        if (actionType === "reject_cancel") {
          extraFields.cancelRequestedBy = null;
          extraFields.statusBeforeCancel = null;
        }
        onProjectUpdate(project._id, res.newStatus, extraFields);
      }
    } catch {
      toast.error("Failed to process action");
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getOtherMember = () => {
    return project.members?.find((m) => m.email !== user?.email);
  };

  const renderMessage = (msg) => {
    const isMine = msg.sender?.uid === user?.uid;

    if (msg.type === "action") {
      const config = ACTION_CONFIG[msg.actionType] || {};
      return (
        <div key={msg._id} className="pchat-action-msg">
          <div
            className="pchat-action-bubble"
            style={{ background: config.bg, borderColor: config.color }}
          >
            <span className="pchat-action-icon" style={{ color: config.color }}>
              {config.icon}
            </span>
            <div className="pchat-action-info">
              <span
                className="pchat-action-label"
                style={{ color: config.color }}
              >
                {config.label}
              </span>
              <span className="pchat-action-by">
                by {msg.sender?.displayName || "User"} -{" "}
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === "file") {
      return (
        <div
          key={msg._id}
          className={`pchat-msg ${isMine ? "pchat-msg--mine" : "pchat-msg--theirs"}`}
        >
          {!isMine && (
            <div className="pchat-msg-avatar">
              {msg.sender?.photoURL ? (
                <img
                  src={msg.sender.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <IoPersonOutline />
              )}
            </div>
          )}
          <div className="pchat-msg-bubble pchat-msg-bubble--file">
            <div className="pchat-file-card">
              <IoDocumentOutline className="pchat-file-icon" />
              <div className="pchat-file-info">
                <span className="pchat-file-name">
                  {msg.fileName || "File"}
                </span>
                <span className="pchat-file-size">
                  {formatFileSize(msg.fileSize)}
                </span>
              </div>
              {msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  download={msg.fileName}
                  className="pchat-file-download"
                  title="Download"
                >
                  <IoDownloadOutline />
                </a>
              )}
            </div>
            <span className="pchat-msg-time">
              {formatTime(msg.createdAt)}
              {isMine && <IoCheckmarkDoneOutline className="pchat-read-icon" />}
            </span>
          </div>
        </div>
      );
    }

    // Text message
    return (
      <div
        key={msg._id}
        className={`pchat-msg ${isMine ? "pchat-msg--mine" : "pchat-msg--theirs"}`}
      >
        {!isMine && (
          <div className="pchat-msg-avatar">
            {msg.sender?.photoURL ? (
              <img
                src={msg.sender.photoURL}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              <IoPersonOutline />
            )}
          </div>
        )}
        <div className="pchat-msg-bubble">
          <p className="pchat-msg-content">{msg.content}</p>
          <span className="pchat-msg-time">
            {formatTime(msg.createdAt)}
            {isMine && <IoCheckmarkDoneOutline className="pchat-read-icon" />}
          </span>
        </div>
      </div>
    );
  };

  const iCancelledIt = project.cancelRequestedBy === user?.uid;

  const renderActionButtons = () => {
    const buttons = [];

    if (projectStatus === "in_progress") {
      if (isOwner) {
        buttons.push(
          <button
            key="cancel"
            className="pchat-act-btn pchat-act-btn--cancel"
            onClick={() => handleAction("cancel_request")}
          >
            <IoBanOutline /> Cancel Project
          </button>,
        );
      }
      if (!isOwner) {
        buttons.push(
          <button
            key="deliver"
            className="pchat-act-btn pchat-act-btn--deliver"
            onClick={() => handleAction("delivered")}
          >
            <IoCheckmarkCircleOutline /> Mark Delivered
          </button>,
        );
        buttons.push(
          <button
            key="cancel"
            className="pchat-act-btn pchat-act-btn--cancel"
            onClick={() => handleAction("cancel_request")}
          >
            <IoBanOutline /> Cancel
          </button>,
        );
      }
    }

    if (projectStatus === "cancel_pending") {
      if (iCancelledIt) {
        // The person who requested cancellation sees a waiting message
        buttons.push(
          <span
            key="waiting"
            className="pchat-act-info pchat-act-info--pending"
          >
            <IoTimeOutline /> Waiting for the other party to accept or reject
            your cancellation request...
          </span>,
        );
      } else {
        // The other party can accept or reject
        buttons.push(
          <button
            key="accept-cancel"
            className="pchat-act-btn pchat-act-btn--cancel"
            onClick={() => handleAction("accept_cancel")}
          >
            <IoBanOutline /> Accept Cancellation
          </button>,
        );
        buttons.push(
          <button
            key="reject-cancel"
            className="pchat-act-btn pchat-act-btn--reopen"
            onClick={() => handleAction("reject_cancel")}
          >
            <IoRocketOutline /> Reject Cancellation
          </button>,
        );
      }
    }

    if (projectStatus === "delivered") {
      if (isOwner) {
        buttons.push(
          <button
            key="accept"
            className="pchat-act-btn pchat-act-btn--accept"
            onClick={() => handleAction("accept_delivery")}
          >
            <IoCheckmarkCircleOutline /> Accept Delivery
          </button>,
        );
        buttons.push(
          <button
            key="revision"
            className="pchat-act-btn pchat-act-btn--revision"
            onClick={() => handleAction("revision_request")}
          >
            <IoRefreshOutline /> Request Revision
          </button>,
        );
      }
    }

    if (projectStatus === "revision_requested") {
      if (!isOwner) {
        buttons.push(
          <button
            key="deliver"
            className="pchat-act-btn pchat-act-btn--deliver"
            onClick={() => handleAction("delivered")}
          >
            <IoCheckmarkCircleOutline /> Re-deliver
          </button>,
        );
      }
    }

    // cancelled projects: NO reopen, permanently cancelled

    if (buttons.length === 0) return null;

    return <div className="pchat-actions-bar">{buttons}</div>;
  };

  const otherMember = getOtherMember();

  return (
    <div className="pchat-overlay" onClick={onClose}>
      <div className="pchat-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pchat-header">
          <div className="pchat-header-left">
            <div className="pchat-header-avatar">
              {otherMember?.photoURL ? (
                <img
                  src={otherMember.photoURL}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              ) : (
                <IoPersonOutline />
              )}
            </div>
            <div className="pchat-header-info">
              <span className="pchat-header-name">
                {project.title || "Project Chat"}
              </span>
              <span className="pchat-header-status">
                <IoTimeOutline />
                {projectStatus?.replace("_", " ") ||
                  "in progress"} &middot; {otherMember?.displayName || "Team"}
              </span>
            </div>
          </div>
          <button className="pchat-close-btn" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        {/* Action Buttons */}
        {renderActionButtons()}

        {/* Messages */}
        <div className="pchat-messages">
          {loading ? (
            <div className="pchat-loading">
              <div className="pchat-spinner" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="pchat-empty">
              <IoRocketOutline className="pchat-empty-icon" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {projectStatus !== "completed" && projectStatus !== "cancelled" && (
          <form className="pchat-input-area" onSubmit={handleSend}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <button
              type="button"
              className="pchat-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Attach file (max 5MB)"
            >
              {uploading ? (
                <div className="pchat-upload-spinner" />
              ) : (
                <IoAttachOutline />
              )}
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="pchat-input"
              disabled={sending}
            />
            <button
              type="submit"
              className="pchat-send-btn"
              disabled={!newMessage.trim() || sending}
            >
              <IoSendOutline />
            </button>
          </form>
        )}

        {projectStatus === "completed" && (
          <div className="pchat-completed-bar">
            <IoCheckmarkCircleOutline /> This project is completed. Chat is
            read-only.
          </div>
        )}

        {projectStatus === "cancelled" && (
          <div
            className="pchat-completed-bar"
            style={{ background: "#fef2f2", color: "#dc2626" }}
          >
            <IoBanOutline /> This project has been cancelled by mutual
            agreement. It cannot be reopened.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectChat;
