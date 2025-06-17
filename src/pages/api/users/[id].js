import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: "User ID is required" });
        }

        // Get user profile
        const user = await User.findById(id)
          .select(
            "name username profilePicture bio followers following createdAt"
          )
          .lean();

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Get user's posts
        const posts = await Post.find({ author: id })
          .populate("author", "name username profilePicture")
          .populate("comments.user", "name username profilePicture")
          .sort({ createdAt: -1 })
          .lean();

        // Add like status for current user to each post
        const postsWithLikeStatus = posts.map((post) => ({
          ...post,
          isLiked: post.likes.includes(session.user.id),
        }));

        // Check if current user is following this user
        const currentUser = await User.findById(session.user.id);
        const isFollowing = currentUser.following.includes(id);

        // Check if this is the current user's own profile
        const isOwnProfile = session.user.id === id;

        const profileData = {
          ...user,
          posts: postsWithLikeStatus,
          isFollowing,
          isOwnProfile,
          followersCount: user.followers.length,
          followingCount: user.following.length,
          postsCount: posts.length,
        };

        res.status(200).json(profileData);
      } catch (error) {
        console.error("Profile error:", error);
        res.status(500).json({ message: "Error fetching profile" });
      }
      break;

    case "PUT":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: "User ID is required" });
        }

        // Only allow users to update their own profile
        if (session.user.id !== id) {
          return res
            .status(403)
            .json({ message: "Can only update your own profile" });
        }

        const { name, username, bio, profilePicture } = req.body;

        // Validation
        if (!name || !username) {
          return res
            .status(400)
            .json({ message: "Name and username are required" });
        }

        if (name.length > 60) {
          return res
            .status(400)
            .json({ message: "Name cannot be more than 60 characters" });
        }

        if (username.length > 30) {
          return res
            .status(400)
            .json({ message: "Username cannot be more than 30 characters" });
        }

        if (bio && bio.length > 150) {
          return res
            .status(400)
            .json({ message: "Bio cannot be more than 150 characters" });
        }

        // Check if username is already taken by another user
        const existingUser = await User.findOne({
          username: username,
          _id: { $ne: id }, // Exclude current user
        });

        if (existingUser) {
          return res.status(400).json({ message: "Username is already taken" });
        }

        // Update user
        const updateData = {
          name: name.trim(),
          username: username.trim(),
          bio: bio ? bio.trim() : "",
          updatedAt: Date.now(),
        };

        if (profilePicture) {
          updateData.profilePicture = profilePicture;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }).select("name username profilePicture bio email createdAt updatedAt");

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Error updating profile" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
