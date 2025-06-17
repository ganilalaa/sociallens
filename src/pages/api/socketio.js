import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import mongoose from "mongoose";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req, res) => {
  try {
    if (!res.socket.server.io) {
      console.log("*First use, starting socket.io");

      const httpServer = res.socket.server;
      const io = new ServerIO(httpServer, {
        path: "/api/socketio",
        addTrailingSlash: false,
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
          credentials: true,
        },
        transports: ["polling", "websocket"],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
      });

      // Connect to database
      connectDB();

      // Store connected users
      const connectedUsers = new Map();

      io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Handle user authentication
        socket.on("authenticate", (userId) => {
          connectedUsers.set(userId, socket.id);
          socket.userId = userId;
          console.log(`User ${userId} authenticated`);
        });

        // Handle private messages
        socket.on("send_message", async (data) => {
          const { receiverId, content, senderId } = data;

          try {
            // Validate ObjectIds
            if (
              !mongoose.Types.ObjectId.isValid(senderId) ||
              !mongoose.Types.ObjectId.isValid(receiverId)
            ) {
              socket.emit("message_error", { error: "Invalid user ID format" });
              return;
            }

            // Save message to database
            const message = await Message.create({
              sender: new mongoose.Types.ObjectId(senderId),
              receiver: new mongoose.Types.ObjectId(receiverId),
              content: content.trim(),
            });

            const populatedMessage = await Message.findById(message._id)
              .populate("sender", "name username profilePicture")
              .populate("receiver", "name username profilePicture");

            // Emit to receiver if online
            const receiverSocketId = connectedUsers.get(receiverId);
            if (receiverSocketId) {
              io.to(receiverSocketId).emit("receive_message", populatedMessage);
            }

            // Emit back to sender for confirmation
            socket.emit("message_sent", populatedMessage);
          } catch (error) {
            console.error("Error saving message:", error);
            socket.emit("message_error", { error: "Failed to send message" });
          }
        });

        // Handle typing indicators
        socket.on("typing_start", (data) => {
          const { receiverId } = data;
          const receiverSocketId = connectedUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("user_typing", {
              userId: socket.userId,
            });
          }
        });

        socket.on("typing_stop", (data) => {
          const { receiverId } = data;
          const receiverSocketId = connectedUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("user_stopped_typing", {
              userId: socket.userId,
            });
          }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
          if (socket.userId) {
            connectedUsers.delete(socket.userId);
            console.log(`User ${socket.userId} disconnected`);
          }
          console.log("User disconnected:", socket.id);
        });
      });

      res.socket.server.io = io;
    } else {
      console.log("socket.io already running");
    }

    res.status(200).end();
  } catch (error) {
    console.error("Error in socketio handler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default ioHandler;
