// File: /pages/api/stories/index.js

import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// Konverton MIME type në 'image' ose 'video'
const normalizeMediaType = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "image"; // fallback default
};

export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  const userId = session.user.id;

  switch (req.method) {
    case "GET":
      try {
        const currentUser = await User.findById(userId).populate("following");

        const followingIds = currentUser.following.map((user) => user._id);
        const now = new Date();

        const stories = await Story.find({
          expiresAt: { $gt: now },
          user: { $in: followingIds },
        })
          .sort({ createdAt: 1 })
          .populate("user", "username profilePicture");

        const grouped = {};
        stories.forEach((story) => {
          const uid = story.user._id;
          if (!grouped[uid]) {
            grouped[uid] = {
              userId: uid,
              username: story.user.username,
              profilePictureUrl: story.user.profilePicture,
              stories: [],
            };
          }
          grouped[uid].stories.push(story.media.url);
        });

        return res.status(200).json(Object.values(grouped));
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        return res.status(500).json({ message: "Failed to fetch stories" });
      }

    case "POST":
      try {
        const { url, type } = req.body;

        if (!url || !type) {
          return res.status(400).json({ message: "URL and type are required" });
        }

        const mediaType = normalizeMediaType(type);

        const newStory = await Story.create({
          user: userId,
          media: { url, type: mediaType },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        return res.status(201).json({
          id: newStory._id,
          url: newStory.media.url,
          type: newStory.media.type,
          createdAt: newStory.createdAt,
        });
      } catch (error) {
        console.error("Failed to create story:", error);
        return res.status(500).json({ message: "Failed to create story" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}