import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import ProfilePic from "./ProfilePic.jsx";

const dummyPosts = [
  {
    id: 1,
    profileId: 101,
    username: "wanderlust_jane",
    created_At: "1h ago",
    media: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    description: "Lost in the mountains 🏞️",
    commentsCount: 12,
    isSponsored: false,
  },
  {
    id: 2,
    profileId: 102,
    username: "urban_boy",
    created_At: "4h ago",
    media: {
      url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    },
    description: "City vibes ✨🌆",
    commentsCount: 8,
    isSponsored: true,
  },
  {
    id: 3,
    profileId: 103,
    username: "foodielover",
    created_At: "6h ago",
    media: {
      url: "https://images.unsplash.com/photo-1520218508822-2f01c7f2f6d3?auto=format&fit=crop&w=800&q=80",
    },
    description: "Homemade brunch 💛🥑",
    commentsCount: 25,
    isSponsored: false,
  },
];

const PostsFeed = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4 max-w-2xl mx-auto">
      {dummyPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const Post = ({ post }) => {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md bg-white border border-gray-200">
      <PostHeader
        username={post.username}
        elapsedTime={post.created_At}
        isSponsored={post.isSponsored}
      />
      <PostImage imageUrl={post.media.url} />
      <PostDescription username={post.username} description={post.description} />
      <PostCommentsInfo count={post.commentsCount} />
    </div>
  );
};

const PostHeader = ({ username, elapsedTime, isSponsored }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <ProfilePic
          css="w-10 h-10"
          profilePic={`https://i.pravatar.cc/150?u=${username}`}
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

const PostCommentsInfo = ({ count }) => (
  <div className="px-4 pt-2 pb-4 text-sm text-gray-500 cursor-pointer hover:underline">
    View all {count} comments
  </div>
);

export default PostsFeed;
