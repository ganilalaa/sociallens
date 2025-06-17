import React, { useState } from "react";
import { useSession } from "next-auth/react";

const AddComment = ({
  onCommentPosted,
  postId,
  parentComment,
  replying,
  setReplying,
  className = "",
}) => {
  const [commentBody, setCommentBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleCommentChange = (e) => {
    setCommentBody(e.target.value);
  };

  const handlePostComment = async () => {
    if (!session) {
      alert("Please log in to comment");
      return;
    }

    if (!commentBody.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: commentBody }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const data = await response.json();
      onCommentPosted(data.post);
      setCommentBody("");
      if (setReplying) setReplying(false);
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostComment();
    } else if (event.key === "Backspace" && commentBody.length === 0) {
      if (setReplying) setReplying(false);
    }
  };

  return (
    <div className="flex w-full gap-2">
      <input
        type="text"
        placeholder={
          replying
            ? `Reply to ${parentComment?.commenter?.username || "user"}`
            : `Add comment...`
        }
        value={commentBody}
        onChange={handleCommentChange}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        className={`border-0 outline-none flex-1 ${className}`}
      />
      {commentBody.length > 0 && (
        <button
          className="flex-4 cursor-pointer text-cyan-600 font-bold disabled:opacity-50"
          onClick={handlePostComment}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : replying ? "Reply" : "Post"}
        </button>
      )}
    </div>
  );
};

export default AddComment;
