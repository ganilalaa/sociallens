import React from "react";
import ProfilePic from "./profilePic.jsx";

const CommentsDisplay = ({ comments, onShowAllComments, showAll = false }) => {
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

  if (!comments || comments.length === 0) {
    return null;
  }

  // Show all comments if showAll is true, otherwise show only the last 2
  const commentsToShow = showAll ? comments : comments.slice(-2);
  const hasMoreComments = !showAll && comments.length > 2;

  return (
    <div className="px-4 pb-2">
      {hasMoreComments && (
        <div
          className="text-sm text-gray-500 cursor-pointer hover:underline mb-2"
          onClick={onShowAllComments}
        >
          View all {comments.length} comments
        </div>
      )}

      {commentsToShow.map((comment, index) => (
        <div key={comment._id || index} className="flex items-start gap-2 mb-2">
          <ProfilePic
            css="w-6 h-6 flex-shrink-0"
            profilePic={
              comment.user?.profilePicture ||
              `https://i.pravatar.cc/150?u=${comment.user?.username}`
            }
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-800">
                {comment.user?.username || "Unknown User"}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-700 break-words">{comment.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsDisplay;
