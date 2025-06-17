import React, { useState } from "react";
import ProfilePic from "../feed/profilePic";
import {
  CheckCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  isConnected,
  onNewChat,
  onDeleteConversation,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}m ago`;
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleDeleteClick = (e, conversation) => {
    e.stopPropagation(); // Prevent conversation selection
    setConversationToDelete(conversation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      await onDeleteConversation(conversationToDelete.user._id);
      setShowDeleteModal(false);
      setConversationToDelete(null);
    } catch (error) {
      console.error("Error deleting conversation:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <CheckCircleOutlined className="text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">No conversations yet</p>
          <p className="text-sm text-gray-400">
            Start messaging someone to see conversations here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <PlusOutlined />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isSelected =
            selectedConversation?.user._id === conversation.user._id;
          const hasUnread = conversation.unreadCount > 0;

          return (
            <div
              key={conversation.user._id}
              className={`p-4 border-b cursor-pointer transition-colors group ${
                isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                {/* Profile Picture */}
                <div className="relative">
                  <ProfilePic
                    css="w-12 h-12"
                    profilePic={
                      conversation.user.profilePicture ||
                      `https://i.pravatar.cc/150?u=${conversation.user.username}`
                    }
                  />
                  {isConnected && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-medium truncate ${
                        hasUnread ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {conversation.user.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(conversation.lastMessage.createdAt)}
                      </span>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteClick(e, conversation)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                        title="Delete conversation"
                      >
                        <DeleteOutlined className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-sm truncate ${
                      hasUnread ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {truncateText(conversation.lastMessage.content)}
                  </p>

                  {/* Unread Badge */}
                  {hasUnread && (
                    <div className="flex items-center justify-between mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-600 font-medium">
                        {conversation.unreadCount} new
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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
              <span className="font-medium">
                {conversationToDelete?.user.name}
              </span>
              ? This action cannot be undone and will permanently remove all
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
    </div>
  );
};

export default ConversationList;
