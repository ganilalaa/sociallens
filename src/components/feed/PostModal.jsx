import React, { useState, useEffect } from "react";
import {
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import ProfilePic from "./profilePic.jsx";
import AddComment from "./addComment.jsx";
import CommentsDisplay from "./CommentsDisplay.jsx";

const PostModal = ({ post, isOpen, onClose, onPostUpdated }) => {
  const { data: session } = useSession();
  const [currentPost, setCurrentPost] = useState(post);
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

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

  const handleLikePost = async () => {
    if (!session) {
      alert("Please log in to like posts");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${currentPost._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();

      const updatedPost = {
        ...currentPost,
        likes: data.post.likes,
        isLiked: data.isLiked,
      };

      setCurrentPost(updatedPost);
      if (onPostUpdated) {
        onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleCommentPosted = (updatedPost) => {
    setCurrentPost(updatedPost);
    if (onPostUpdated) {
      onPostUpdated(updatedPost);
    }
  };

  const handleCommentClick = () => {
    if (!session) {
      alert("Please log in to comment");
      return;
    }
    setShowCommentInput(!showCommentInput);
  };

  if (!isOpen || !currentPost) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <ProfilePic
              css="w-10 h-10"
              profilePic={
                currentPost.author?.profilePicture ||
                `https://i.pravatar.cc/150?u=${currentPost.author?.username}`
              }
            />
            <div>
              <div className="font-semibold text-gray-800">
                {currentPost.author?.username || "Unknown User"}
              </div>
              <div className="text-xs text-gray-500">
                {formatTimeAgo(currentPost.createdAt)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <CloseOutlined className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 min-h-[500px]">
            <img
              src={currentPost.media?.url}
              alt="Post"
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Comments Section */}
          <div className="w-[500px] border-l flex flex-col">
            {/* Post Description */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-gray-800">
                  {currentPost.author?.username || "Unknown User"}
                </span>
              </div>
              <p className="text-gray-700 text-base">
                {currentPost.description}
              </p>
            </div>

            {/* Like and Comment Actions */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={handleLikePost}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  {currentPost.isLiked ? (
                    <HeartFilled className="text-2xl text-red-500" />
                  ) : (
                    <HeartOutlined className="text-2xl" />
                  )}
                  <span className="text-base font-medium">
                    {currentPost.likes?.length || 0} likes
                  </span>
                </button>

                <button
                  onClick={handleCommentClick}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <MessageOutlined className="text-2xl" />
                  <span className="text-base font-medium">
                    {currentPost.comments?.length || 0} comments
                  </span>
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto">
              <CommentsDisplay
                comments={currentPost.comments}
                onShowAllComments={() => {}} // No need for this in modal
                showAll={true}
              />
            </div>

            {/* Comment Input */}
            {showCommentInput && (
              <div className="p-6 border-t">
                <AddComment
                  postId={currentPost._id}
                  onCommentPosted={handleCommentPosted}
                  className="text-base"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
