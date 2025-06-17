import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: [true, "Please provide message content"],
    maxlength: [1000, "Message cannot be more than 1000 characters"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
MessageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient querying of conversations
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
