import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const posts = await Post.find({})
          .populate("author", "name username profilePicture")
          .populate("comments.user", "name username profilePicture")
          .sort({ createdAt: -1 })
          .limit(20);

        res.status(200).json(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts" });
      }
      break;

    case "POST":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { description, mediaUrl, mediaType = "image" } = req.body;

        if (!description || !mediaUrl) {
          return res
            .status(400)
            .json({ message: "Description and media URL are required" });
        }

        const post = await Post.create({
          author: session.user.id,
          description,
          media: {
            url: mediaUrl,
            type: mediaType,
          },
        });

        const populatedPost = await Post.findById(post._id).populate(
          "author",
          "name username profilePicture"
        );

        res.status(201).json(populatedPost);
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
