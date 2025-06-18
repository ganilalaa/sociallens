import { formidable } from "formidable";
import path from "path";
import fs from "fs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility to parse form with formidable
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024,
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { fields, files } = await parseForm(req);

    const name = fields.name?.[0] || "";
    const email = fields.email?.[0] || "";
    const username = fields.username?.[0] || "";
    const password = fields.password?.[0] || "";
    const bio = fields.bio?.[0] || "";
    const imageFile = files.image?.[0];

    // Validation
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      bio,
      profilePicture: imageFile
        ? `/uploads/${path.basename(imageFile.filepath)}`
        : null,
    });

    await newUser.save();

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      profilePicture: newUser.profilePicture,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}