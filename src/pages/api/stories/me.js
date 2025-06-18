import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  const userId = session.user.id;

  switch (req.method) {
    case "GET":
      try {
        const now = new Date();

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const stories = await Story.find({
          user: userId,
          expiresAt: { $gt: now },
        }).sort({ createdAt: 1 });

        const storyUrls = stories.map((story) => story.media.url);

        const response = {
          userId: user._id,
          username: user.username,
          profilePictureUrl: user.profilePicture,
          stories: storyUrls,
        };

        return res.status(200).json(response);
      } catch (error) {
        console.error("Failed to fetch user stories:", error);
        return res
          .status(500)
          .json({ message: "Failed to fetch user stories" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}