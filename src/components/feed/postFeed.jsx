import React, { useState, useEffect } from "react";
import {
  MoreOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import ProfilePic from "./profilePic.jsx";
import AddComment from "./addComment.jsx";
import CommentsDisplay from "./CommentsDisplay.jsx";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      console.log("response",response);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId, currentLikeStatus) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const data = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: data.post.likes, isLiked: data.isLiked }
            : post
        )
      );
    } catch (error) {
      console.error("Error liksing post:", error);
      alert("Failed to like post. Please try again.");
    }
  };

  const handleCommentPosted = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4 max-w-2xl mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
            <div className="w-full h-64 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4 max-w-2xl mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 p-8 text-center">
          <p className="text-red-600">Error loading posts: {error}</p>
          <button
            onClick={fetchPosts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 px-4 max-w-2xl mx-auto">
        <div className="w-full rounded-xl overflow-hidden shadow-md bg-white border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            No posts yet. Be the first to share something!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4 max-w-2xl mx-auto mt-[-60px]">
      {posts.map((post) => (
        <Post
          key={post._id}
          post={post}
          onLikePost={handleLikePost}
          onCommentPosted={handleCommentPosted}
        />
      ))}
    </div>
  );
};

const Post = ({ post, onLikePost, onCommentPosted }) => {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

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

  const handleLikeClick = () => {
    if (!session) {
      alert("Please log in to like posts");
      return;
    }
    onLikePost(post._id, post.isLiked);
  };

  const handleCommentClick = () => {
    if (!session) {
      alert("Please log in to comment");
      return;
    }
    setShowCommentInput(!showCommentInput);
  };

  const handleShowAllComments = () => {
    setShowComments(true);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md bg-white border border-gray-200">
      <PostHeader
        username={post.author?.username || "Unknown User"}
        elapsedTime={formatTimeAgo(post.createdAt)}
        isSponsored={post.isSponsored}
        profilePicture={post.author?.profilePicture}
      />
      <PostImage imageUrl={post.media?.url} />

      {/* Like and Comment Actions */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
          >
            {post.isLiked ? (
              <HeartFilled className="text-xl text-red-500" />
            ) : (
              <HeartOutlined className="text-xl" />
            )}
            <span className="text-sm font-medium">
              {post.likes?.length || 0} likes
            </span>
          </button>

          <button
            onClick={handleCommentClick}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageOutlined className="text-xl" />
            <span className="text-sm font-medium">
              {post.comments?.length || 0} comments
            </span>
          </button>
        </div>
      </div>

      <PostDescription
        username={post.author?.username || "Unknown User"}
        description={post.description}
      />

      {/* Comments Display */}
      <CommentsDisplay
        comments={post.comments}
        onShowAllComments={handleShowAllComments}
      />

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-4 pb-4">
          <AddComment
            postId={post._id}
            onCommentPosted={onCommentPosted}
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
};

const PostHeader = ({ username, elapsedTime, isSponsored, profilePicture }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <ProfilePic
          css="w-10 h-10"
          profilePic={
            profilePicture || `https://i.pravatar.cc/150?u=${username}`
          }
        />
        <div>
          <div className="font-semibold text-gray-800">{username}</div>
          <div className="text-xs text-gray-500">{elapsedTime}</div>
        </div>
        {isSponsored && (
          <span className="ml-2 text-xs text-white bg-blue-600 px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        )}
      </div>
      <MoreOutlined className="text-xl text-gray-500 cursor-pointer hover:text-gray-800" />
    </div>
  );
};

const PostImage = ({ imageUrl }) => (
  <div className="w-full max-h-[500px] overflow-hidden">
    <img
      src={imageUrl}
      alt="Post"
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
  </div>
);

const PostDescription = ({ username, description }) => (
  <div className="px-4 pt-3">
    <span className="font-semibold text-gray-800">{username}</span>{" "}
    <span className="text-gray-700">{description}</span>
  </div>
);

export default PostsFeed;
