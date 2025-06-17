import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

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

    const { senderId } = req.body;
    const userId = session.user.id;

    if (!senderId) {
      return res.status(400).json({ message: "Sender ID is required" });
    }

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Mark all unread messages from this sender as read
    await Message.updateMany(
      {
        sender: new mongoose.Types.ObjectId(senderId),
        receiver: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Error marking messages as read" });
  }
}
