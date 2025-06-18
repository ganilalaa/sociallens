// models/Story.js
import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  media: {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Story || mongoose.model("Story", StorySchema);