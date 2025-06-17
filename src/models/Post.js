import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  media: {
    url: {
      type: String,
      required: [true, "Please provide media URL"],
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: [true, "Please provide comment text"],
        maxlength: [200, "Comment cannot be more than 200 characters"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isSponsored: {
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
PostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for comment count
PostSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Virtual for like count
PostSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
