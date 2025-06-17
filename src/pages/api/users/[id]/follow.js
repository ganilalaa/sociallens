import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.query;
    const currentUserId = session.user.id;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (currentUserId === id) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const currentUser = await User.findById(currentUserId);
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUserId },
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $addToSet: { followers: currentUserId },
      });
    }

    res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      isFollowing: !isFollowing,
    });
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    res.status(500).json({ message: "Error following/unfollowing user" });
  }
}
