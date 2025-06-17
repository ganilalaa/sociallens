import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { conversationWith } = req.query;
        const userId = session.user.id;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid user ID format" });
        }

        if (conversationWith) {
          // Validate conversation partner ID
          if (!mongoose.Types.ObjectId.isValid(conversationWith)) {
            return res
              .status(400)
              .json({ message: "Invalid conversation partner ID format" });
          }

          // Get messages between two users
          const messages = await Message.find({
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
          })
            .populate("sender", "name username profilePicture")
            .populate("receiver", "name username profilePicture")
            .sort({ createdAt: 1 })
            .limit(50);

          res.status(200).json(messages);
        } else {
          // Get all conversations for the user
          const conversations = await Message.aggregate([
            {
              $match: {
                $or: [
                  { sender: new mongoose.Types.ObjectId(userId) },
                  { receiver: new mongoose.Types.ObjectId(userId) },
                ],
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $group: {
                _id: {
                  $cond: [
                    { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
                    "$receiver",
                    "$sender",
                  ],
                },
                lastMessage: { $first: "$$ROOT" },
                unreadCount: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          {
                            $eq: [
                              "$receiver",
                              new mongoose.Types.ObjectId(userId),
                            ],
                          },
                          { $eq: ["$isRead", false] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
            {
              $project: {
                _id: 1,
                user: {
                  _id: 1,
                  name: 1,
                  username: 1,
                  profilePicture: 1,
                },
                lastMessage: 1,
                unreadCount: 1,
              },
            },
          ]);

          res.status(200).json(conversations);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Error fetching messages" });
      }
      break;

    case "POST":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Not authenticated" });
        }

        const { receiverId, content } = req.body;
        const senderId = session.user.id;

        if (!receiverId || !content) {
          return res
            .status(400)
            .json({ message: "Receiver ID and content are required" });
        }

        // Validate ObjectIds
        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          return res.status(400).json({ message: "Invalid user ID format" });
        }

        if (content.length > 1000) {
          return res
            .status(400)
            .json({ message: "Message cannot be more than 1000 characters" });
        }

        const message = await Message.create({
          sender: new mongoose.Types.ObjectId(senderId),
          receiver: new mongoose.Types.ObjectId(receiverId),
          content: content.trim(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name username profilePicture")
          .populate("receiver", "name username profilePicture");

        res.status(201).json(populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
