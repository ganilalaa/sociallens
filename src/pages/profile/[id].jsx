"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  UserOutlined,
  CalendarOutlined,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import EditProfileModal from "@/components/profile/EditProfileModal";
import PostModal from "@/components/feed/PostModal";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";

export default function ProfilePage({
  profile: initialProfile,
  posts: initialPosts,
}) {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(initialProfile);
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(
    initialProfile?.isFollowing || false
  );
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // Update profile when initialProfile changes (from SSG)
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setIsFollowing(initialProfile.isFollowing || false);
    }
  }, [initialProfile]);

  // Update posts when initialPosts changes (from SSG)
  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  // Fallback: If SSG didn't provide data, fetch it client-side
  const fetchProfile = useCallback(async () => {
    if (initialProfile) return; // Skip if we have SSG data

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`/api/users/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
        } else {
          throw new Error("Failed to fetch profile");
        }
        return;
      }

      const data = await response.json();
      setProfile(data);
      setIsFollowing(data.isFollowing);
    } catch (err) {
      setError("Failed to load profile");
      console.error("Profile error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, initialProfile]);

  useEffect(() => {
    if (id && status !== "loading" && !initialProfile) {
      fetchProfile();
    }
  }, [id, status, fetchProfile, initialProfile]);

  const handleFollow = async () => {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    try {
      setFollowLoading(true);
      const response = await fetch(`/api/users/${id}/follow`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow");
      }

      const data = await response.json();
      setIsFollowing(data.isFollowing);

      // Update the profile data
      setProfile((prev) => ({
        ...prev,
        followersCount: data.isFollowing
          ? prev.followersCount + 1
          : prev.followersCount - 1,
      }));
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
  if (session?.user?.id && profile?._id) {
    setProfile((prev) => ({
      ...prev,
      isOwnProfile: session.user.id === profile._id,
    }));
  }
}, [session?.user?.id, profile?._id]);


  const handleProfileUpdated = useCallback((updatedProfile) => {
    // Update the local profile state with the new data
    setProfile((prev) => ({
      ...prev,
      name: updatedProfile.name,
      username: updatedProfile.username,
      bio: updatedProfile.bio,
      profilePicture: updatedProfile.profilePicture,
    }));
  }, []);

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const handlePostClick = useCallback((post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  }, []);

  const handlePostModalClose = useCallback(() => {
    setShowPostModal(false);
    setSelectedPost(null);
  }, []);

  const handlePostUpdated = useCallback(
    (updatedPost) => {
      // Update the post in the profile's posts array
      setProfile((prev) => ({
        ...prev,
        posts: prev.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        ),
      }));

      // Update the selected post if it's the same one
      if (selectedPost && selectedPost._id === updatedPost._id) {
        setSelectedPost(updatedPost);
      }
    },
    [selectedPost]
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <UserOutlined className="text-gray-600 text-4xl" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <span className="text-gray-500">@{profile.username}</span>

                {profile.isOwnProfile ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 flex items-center"
                    >
                      <EditOutlined className="mr-1" />
                      Edit Profile
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 flex items-center">
                      <SettingOutlined className="mr-1" />
                      Settings
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-4 py-1 rounded text-sm font-medium ${
                        isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      } disabled:opacity-50`}
                    >
                      {followLoading
                        ? "Loading..."
                        : isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/messages?user=${profile._id}`)
                      }
                      className="bg-green-500 text-white px-4 py-1 rounded text-sm hover:bg-green-600 flex items-center"
                    >
                      <MessageOutlined className="mr-1" />
                      Message
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-6 mb-3">
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.postsCount}
                  </div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.followersCount}
                  </div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {profile.followingCount}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-700 mb-2">{profile.bio}</p>
              )}

              {/* Join Date */}
              <div className="flex items-center text-sm text-gray-500">
                <CalendarOutlined className="mr-1" />
                Joined {formatDate(profile.createdAt)}
              </div>
            </div>
          </div>

          {!profile.isOwnProfile && (
            <button className="text-gray-500 hover:text-gray-700">
              <MoreOutlined />
            </button>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>

        {profile.posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">
              <HeartOutlined />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">
              {profile.isOwnProfile
                ? "Share your first post to get started!"
                : "This user hasn't shared any posts yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.media.url}
                  alt="Post"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">
                        <HeartOutlined className="mr-1" />
                        {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center">
                        <MessageOutlined className="mr-1" />
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onProfileUpdated={handleProfileUpdated}
        currentProfile={profile}
      />

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={showPostModal}
        onClose={handlePostModalClose}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}

// SSG - Static Site Generation
export async function getStaticProps({ params }) {
  try {
    await connectDB();

    const { id } = params;

    // Fetch user profile
    const user = await User.findById(id)
      .select("name username email profilePicture bio createdAt")
      .lean();

    if (!user) {
      return {
        notFound: true,
      };
    }

    // Fetch user's posts
    const posts = await Post.find({ author: id })
      .populate("author", "name username profilePicture")
      .populate("likes", "name username")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name username profilePicture",
        },
      })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    // Get follower and following counts
    const followersCount = await User.countDocuments({ following: id });
    const followingCount = await User.findById(id).then(
      (user) => user.following.length
    );
    const postsCount = await Post.countDocuments({ author: id });

    const profile = {
      ...user,
      postsCount,
      followersCount,
      followingCount,
      posts: posts,
      isOwnProfile: false, // Will be determined client-side
      isFollowing: false, // Will be determined client-side
    };

    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile)),
        posts: JSON.parse(JSON.stringify(posts)),
      },
      // ISR - Incremental Static Regeneration (revalidate every 60 seconds)
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true,
    };
  }
}

// SSG - Generate static paths for popular users
export async function getStaticPaths() {
  try {
    await connectDB();

    // Get the most active users (users with most posts)
    const activeUsers = await Post.aggregate([
      {
        $group: {
          _id: "$author",
          postCount: { $sum: 1 },
        },
      },
      {
        $sort: { postCount: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    const paths = activeUsers.map((user) => ({
      params: { id: user._id.toString() },
    }));

    return {
      paths,
      fallback: "blocking", // Generate new pages on-demand
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
