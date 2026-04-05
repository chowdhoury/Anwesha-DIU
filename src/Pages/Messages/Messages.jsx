import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "react-router";
import { AuthContext } from "../../Authentication/AuthContext";
import { messagesApi } from "../../utils/messagesApi";
import toast from "react-hot-toast";
import {
  IoChatbubbleOutline,
  IoSendOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoSearchOutline,
  IoChevronBack,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";
import "./Messages.css";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showMobileConv, setShowMobileConv] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const convPollRef = useRef(null);
  const hasAutoSelected = useRef(false);

  // Fetch conversations on mount + poll every 6s for new conversations
  useEffect(() => {
    if (!user) return;
    fetchConversations();
    convPollRef.current = setInterval(() => {
      fetchConversations();
    }, 6000);
    return () => clearInterval(convPollRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-select from URL param (runs only once per ?c= value)
  useEffect(() => {
    const c = searchParams.get("c");
    if (!c || conversations.length === 0) return;
    if (hasAutoSelected.current === c) return;

    const conv = conversations.find((cv) => cv.conversationId === c);
    if (conv) {
      hasAutoSelected.current = c;
      selectConversation(conv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, conversations]);

  // Poll for new messages when a conversation is active
  useEffect(() => {
    if (!activeConv) return;
    pollRef.current = setInterval(async () => {
      try {
        const msgs = await messagesApi.getMessages(activeConv.conversationId, {
          limit: 50,
        });
        setMessages(msgs);
      } catch {
        // silent
      }
    }, 4000);
    return () => clearInterval(pollRef.current);
  }, [activeConv]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const data = await messagesApi.getConversations(user.uid);
      const directOnly = (data || []).filter(
        (c) => !c.conversationId.startsWith("project:"),
      );
      setConversations(directOnly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conv) => {
    setActiveConv(conv);
    setShowMobileConv(false);

    try {
      setMessagesLoading(true);
      const msgs = await messagesApi.getMessages(conv.conversationId, {
        limit: 50,
      });
      setMessages(msgs || []);
      scrollToBottom();
      // Mark as read
      if (user) {
        await messagesApi.markRead(conv.conversationId, user.uid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMessagesLoading(false);
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
    if (!newMessage.trim() || !activeConv || !user) return;

    const content = newMessage.trim();
    setNewMessage("");

    // Optimistic: add immediately
    const tempMsg = {
      _id: Date.now(),
      conversationId: activeConv.conversationId,
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
        conversationId: activeConv.conversationId,
        senderUid: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        content,
      });
      // Refresh conversations to update lastMessage
      fetchConversations();
    } catch {
      toast.error("Failed to send message");
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatConvTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return formatTime(date);
    if (diff < 172800000) return "Yesterday";
    return d.toLocaleDateString();
  };

  const getConvLabel = (conv) => {
    if (conv.conversationId.startsWith("project:")) return "Project Chat";
    return "Direct Message";
  };

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="messages-spinner" />
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="messages-page">
      {/* Conversation List */}
      <div
        className={`messages-sidebar ${!showMobileConv ? "messages-sidebar--hidden-mobile" : ""}`}
      >
        <div className="messages-sidebar-header">
          <h2>Messages</h2>
          <span className="conv-count">{conversations.length}</span>
        </div>

        {conversations.length === 0 ? (
          <div className="conv-empty">
            <IoChatbubbleOutline />
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="conv-list">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                className={`conv-item ${activeConv?.conversationId === conv.conversationId ? "conv-item--active" : ""}`}
                onClick={() => selectConversation(conv)}
              >
                <div className="conv-avatar">
                  {conv.otherParty?.photoURL ? (
                    <img
                      src={conv.otherParty.photoURL}
                      alt=""
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <IoPersonOutline />
                  )}
                </div>
                <div className="conv-info">
                  <div className="conv-info-top">
                    <span className="conv-name">
                      {conv.otherParty?.displayName || "User"}
                    </span>
                    <span className="conv-time">
                      {formatConvTime(conv.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <div className="conv-info-bottom">
                    <span className="conv-preview">
                      {conv.lastMessage?.content?.slice(0, 45) ||
                        getConvLabel(conv)}
                      {conv.lastMessage?.content?.length > 45 ? "..." : ""}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="conv-unread">{conv.unreadCount}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div
        className={`messages-chat ${showMobileConv ? "messages-chat--hidden-mobile" : ""}`}
      >
        {!activeConv ? (
          <div className="chat-empty">
            <IoChatbubbleOutline className="chat-empty-icon" />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the sidebar to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="chat-header">
              <button
                className="chat-back-btn"
                onClick={() => setShowMobileConv(true)}
              >
                <IoChevronBack />
              </button>
              <div className="chat-header-avatar">
                {activeConv.otherParty?.photoURL ? (
                  <img
                    src={activeConv.otherParty.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <IoPersonOutline />
                )}
              </div>
              <div className="chat-header-info">
                <span className="chat-header-name">
                  {activeConv.otherParty?.displayName || "User"}
                </span>
                <span className="chat-header-type">
                  {getConvLabel(activeConv)}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messagesLoading ? (
                <div className="chat-loading">
                  <div className="messages-spinner" />
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-no-messages">
                  <p>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender?.uid === user?.uid;
                  return (
                    <div
                      key={msg._id}
                      className={`chat-msg ${isMine ? "chat-msg--mine" : "chat-msg--theirs"}`}
                    >
                      {!isMine && (
                        <div className="msg-avatar">
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
                      <div className="msg-bubble">
                        <p className="msg-content">{msg.content}</p>
                        <span className="msg-time">
                          {formatTime(msg.createdAt)}
                          {isMine && (
                            <IoCheckmarkDoneOutline className="msg-read-icon" />
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!newMessage.trim()}
              >
                <IoSendOutline />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
