import React, { useState } from "react";

const AddComment = ({
  onCommentPosted,
  post,
  parentComment,
  replying,
  setReplying,
  className = "",
}) => {
  const [commentBody, setCommentBody] = useState("");

  const handleCommentChange = (e) => {
    setCommentBody(e.target.value);
  };

  const handlePostComment = async () => {
    console.log("Posting comment:", commentBody);


    const fakeResponse = {
      data: {
        id: Date.now(),
        content: commentBody,
        commenter: {
          username: "testuser", 
          id: 123,
        },
      },
    };

    onCommentPosted(fakeResponse.data);

    setCommentBody("");
    if (setReplying) setReplying(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && commentBody.length === 0) {
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
        className={`border-0 outline-none flex-1 ${className}`}
      />
      {commentBody.length > 0 && (
        <div
          className="flex-4 cursor-pointer text-cyan-600 font-bold"
          onClick={handlePostComment}
        >
          {replying ? "Reply" : "Post"}
        </div>
      )}
    </div>
  );
};

export default AddComment;