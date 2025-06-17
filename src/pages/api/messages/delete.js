import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { conversationWith } = req.query;
    const userId = session.user.id;

    if (!conversationWith) {
      return res
        .status(400)
        .json({ message: "Conversation partner ID is required" });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(conversationWith)
    ) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Delete all messages between the two users
    const result = await Message.deleteMany({
      $or: [
        {
          sender: new mongoose.Types.ObjectId(userId),
          receiver: new mongoose.Types.ObjectId(conversationWith),
        },
        {
          sender: new mongoose.Types.ObjectId(conversationWith),
          receiver: new mongoose.Types.ObjectId(userId),
        },
      ],
    });

    console.log(
      `Deleted ${result.deletedCount} messages between users ${userId} and ${conversationWith}`
    );

    res.status(200).json({
      message: "Conversation deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ message: "Error deleting conversation" });
  }
}
