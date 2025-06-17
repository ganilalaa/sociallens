import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import NewChatModal from "./NewChatModal";
import { MessageOutlined } from "@ant-design/icons";

const Chat = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { socket, isConnected, fetchUnreadCount } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [messageError, setMessageError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      console.log("Session user ID:", session.user.id);
      console.log("Session user data:", session.user);
      fetchConversations();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.user._id);
    }
  }, [selectedConversation]);

  // Clear error when switching conversations
  useEffect(() => {
    setMessageError(null);
  }, [selectedConversation]);

  // Handle starting conversation with specific user from URL
  useEffect(() => {
    if (router.query.user && conversations.length > 0) {
      const targetUser = conversations.find(
        (conv) => conv.user._id === router.query.user
      );

      if (targetUser) {
        setSelectedConversation(targetUser);
      } else {
        // If no existing conversation, create a new one
        createNewConversation(router.query.user);
      }
    }
  }, [router.query.user, conversations]);

  const createNewConversation = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        const newConversation = {
          user: {
            _id: userData._id,
            name: userData.name,
            username: userData.username,
            profilePicture: userData.profilePicture,
          },
          lastMessage: {
            content: "Start a new conversation",
            createdAt: new Date(),
          },
          unreadCount: 0,
        };
        setSelectedConversation(newConversation);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const handleUserSelect = (user) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      (conv) => conv.user._id === user._id
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
    } else {
      // Create new conversation
      const newConversation = {
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          profilePicture: user.profilePicture,
        },
        lastMessage: {
          content: "Start a new conversation",
          createdAt: new Date(),
        },
        unreadCount: 0,
      };
      setSelectedConversation(newConversation);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new messages only if WebSocket is connected
      const handleReceiveMessage = (message) => {
        if (
          selectedConversation &&
          message.sender === selectedConversation.user._id
        ) {
          setMessages((prev) => [...prev, message]);
        }
        // Update conversation list
        fetchConversations();
      };

      const handleMessageSent = (message) => {
        if (
          selectedConversation &&
          message.receiver === selectedConversation.user._id
        ) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on("receive_message", handleReceiveMessage);
      socket.on("message_sent", handleMessageSent);

      return () => {
        socket.off("receive_message", handleReceiveMessage);
        socket.off("message_sent", handleMessageSent);
      };
    }
  }, [socket, isConnected, selectedConversation?.user?._id]);

  const fetchConversations = async () => {
    try {
      console.log("Fetching conversations...");
      const response = await fetch("/api/messages");
      console.log("Conversations API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched conversations:", data);
        setConversations(data);
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to fetch conversations:",
          response.status,
          response.statusText,
          errorData
        );
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      setMessageError(null);
      console.log("Fetching messages for user:", userId);
      const response = await fetch(`/api/messages?conversationWith=${userId}`);
      console.log("Messages API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);

        // Mark messages as read
        try {
          console.log("Marking messages as read for sender:", userId);
          const readResponse = await fetch("/api/messages/read", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ senderId: userId }),
          });
          console.log("Read API response status:", readResponse.status);

          if (!readResponse.ok) {
            const errorData = await readResponse.json();
            console.error("Read API error:", errorData);
          }
        } catch (readError) {
          console.error("Error marking messages as read:", readError);
        }

        // Refresh unread count in sidebar
        fetchUnreadCount();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to fetch messages:",
          response.status,
          response.statusText,
          errorData
        );
        setMessageError(
          `Failed to load messages: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessageError("Error loading messages. Please check your connection.");
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: selectedConversation.user._id,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        fetchConversations(); // Update conversation list

        // If WebSocket is not available, refresh messages after a short delay
        if (!isConnected) {
          setTimeout(() => {
            fetchMessages(selectedConversation.user._id);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleDeleteConversation = async (userId) => {
    try {
      console.log("Deleting conversation with user:", userId);
      const response = await fetch(
        `/api/messages/delete?conversationWith=${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Conversation deleted:", result);

        // If the deleted conversation was selected, clear the selection
        if (selectedConversation?.user._id === userId) {
          setSelectedConversation(null);
          setMessages([]);
        }

        // Refresh conversations list
        fetchConversations();

        // Refresh unread count
        fetchUnreadCount();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to delete conversation:",
          response.status,
          response.statusText,
          errorData
        );
        throw new Error(errorData.message || "Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error; // Re-throw to show error in UI
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MessageOutlined className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Please log in to access messages
          </h2>
          <p className="text-gray-500">
            You need to be authenticated to view and send messages.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Connection Status */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-yellow-800 text-sm">
              Real-time messaging is not available. Messages will be sent
              normally but may not appear instantly.
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversation List */}
          <div className="w-1/3 border-r">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
              isConnected={isConnected}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
            />
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                messages={messages}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
                onRefreshMessages={fetchMessages}
                error={messageError}
                onDeleteConversation={handleDeleteConversation}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageOutlined className="text-6xl text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Choose a conversation from the list or start a new chat
                  </p>
                  <button
                    onClick={handleNewChat}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onSelectUser={handleUserSelect}
      />
    </div>
  );
};

export default Chat;
