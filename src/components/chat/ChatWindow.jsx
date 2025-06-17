import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/contexts/SocketContext";
import ProfilePic from "../feed/profilePic";
import {
  SendOutlined,
  MoreOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const ChatWindow = ({
  conversation,
  messages,
  onSendMessage,
  isConnected,
  onRefreshMessages,
  error,
  onDeleteConversation,
}) => {
  const { data: session } = useSession();
  const { startTyping, stopTyping } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for typing indicators
    if (conversation) {
      const socket = window.socket; // Access socket from global scope
      if (socket) {
        socket.on("user_typing", (data) => {
          if (data.userId === conversation.user._id) {
            setOtherUserTyping(true);
          }
        });

        socket.on("user_stopped_typing", (data) => {
          if (data.userId === conversation.user._id) {
            setOtherUserTyping(false);
          }
        });

        return () => {
          socket.off("user_typing");
          socket.off("user_stopped_typing");
        };
      }
    }
  }, [conversation]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (conversation) {
      startTyping(conversation.user._id);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(conversation.user._id);
      }, 1000);
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");

      // Stop typing indicator
      if (conversation) {
        stopTyping(conversation.user._id);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isOwnMessage = (message) => {
    return (
      message.sender === session?.user?.id ||
      message.senderId === session?.user?.id
    );
  };

  const handleRefresh = async () => {
    if (conversation && onRefreshMessages) {
      setIsRefreshing(true);
      try {
        await onRefreshMessages(conversation.user._id);
      } catch (error) {
        console.error("Error refreshing messages:", error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversation || !onDeleteConversation) return;

    setIsDeleting(true);
    try {
      await onDeleteConversation(conversation.user._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProfilePic
              css="w-10 h-10"
              profilePic={
                conversation.user.profilePicture ||
                `https://i.pravatar.cc/150?u=${conversation.user.username}`
              }
            />
            <div>
              <h3 className="font-semibold text-gray-800">
                {conversation.user.name}
              </h3>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm text-gray-500">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-500 hover:text-gray-700">
              <MoreOutlined className="text-xl" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete conversation"
            >
              <DeleteOutlined className="text-lg" />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 p-1 disabled:opacity-50"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh messages"
            >
              <ReloadOutlined
                className={`text-lg ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{error}</span>
              <button
                onClick={handleRefresh}
                className="text-red-700 hover:text-red-900 text-sm underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`flex ${
              isOwnMessage(message) ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage(message)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  isOwnMessage(message) ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <ExclamationCircleOutlined className="text-red-500 text-xl" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Conversation
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your conversation with{" "}
              <span className="font-medium">{conversation?.user.name}</span>?
              This action cannot be undone and will permanently remove all
              messages.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="1"
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendOutlined className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
