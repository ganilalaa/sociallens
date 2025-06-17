import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { id } = req.query;
    const { text } = req.body;
    const userId = session.user.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    if (text.length > 200) {
      return res
        .status(400)
        .json({ message: "Comment cannot be more than 200 characters" });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Add the comment
    post.comments.push({
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    });

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("author", "name username profilePicture")
      .populate("comments.user", "name username profilePicture");

    res.status(201).json({
      post: updatedPost,
      commentCount: updatedPost.comments.length,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment" });
  }
}
