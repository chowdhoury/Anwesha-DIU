const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const messagesApi = {
  // Find or create a conversation between two users
  findOrCreateConversation: async ({
    myUid,
    myName,
    myPhoto,
    myEmail,
    otherUid,
    otherName,
    otherPhoto,
    otherEmail,
  }) => {
    const res = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        myUid,
        myName,
        myPhoto,
        myEmail,
        otherUid,
        otherName,
        otherPhoto,
        otherEmail,
      }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    return res.json();
  },

  // Get all conversations for a user
  getConversations: async (uid) => {
    const res = await fetch(
      `${API_URL}/conversations?uid=${encodeURIComponent(uid)}`,
    );
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return res.json();
  },

  // Get messages for a conversation
  getMessages: async (conversationId, { limit = 50 } = {}) => {
    const res = await fetch(
      `${API_URL}/conversations/${encodeURIComponent(conversationId)}/messages?limit=${limit}`,
    );
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  },

  // Send a message
  send: async ({
    conversationId,
    senderUid,
    senderName,
    senderPhoto,
    content,
  }) => {
    const res = await fetch(
      `${API_URL}/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderUid, senderName, senderPhoto, content }),
      },
    );
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  // Mark messages as read
  markRead: async (conversationId, uid) => {
    const res = await fetch(
      `${API_URL}/conversations/${encodeURIComponent(conversationId)}/read`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      },
    );
    if (!res.ok) throw new Error("Failed to mark as read");
    return res.json();
  },

  // Find or create a project conversation
  findOrCreateProjectConversation: async ({ projectId, participants }) => {
    const res = await fetch(`${API_URL}/conversations/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, participants }),
    });
    if (!res.ok) throw new Error("Failed to create project conversation");
    return res.json();
  },

  // Send a project action (cancel, delivered, revision, etc.)
  sendProjectAction: async ({
    projectId,
    actionType,
    senderUid,
    senderName,
    senderPhoto,
    message,
  }) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        actionType,
        senderUid,
        senderName,
        senderPhoto,
        message,
      }),
    });
    if (!res.ok) throw new Error("Failed to process action");
    return res.json();
  },

  // Upload a file to project chat
  uploadProjectFile: async ({
    projectId,
    fileName,
    fileData,
    fileSize,
    senderUid,
    senderName,
    senderPhoto,
  }) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        fileData,
        fileSize,
        senderUid,
        senderName,
        senderPhoto,
      }),
    });
    if (!res.ok) throw new Error("Failed to upload file");
    return res.json();
  },
};
