import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { q } = req.query;
    const searchQuery = q ? q.trim() : "";

    let users;

    if (searchQuery.length === 0) {
      // Return all users when no search query is provided
      users = await User.find({
        _id: { $ne: session.user.id }, // Exclude current user
      })
        .select("name username profilePicture bio followers following")
        .limit(20)
        .sort({ name: 1 });
    } else {
      // Search by username or name (case-insensitive)
      users = await User.find({
        $or: [
          { username: { $regex: searchQuery, $options: "i" } },
          { name: { $regex: searchQuery, $options: "i" } },
        ],
        _id: { $ne: session.user.id }, // Exclude current user
      })
        .select("name username profilePicture bio followers following")
        .limit(10);
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching users" });
  }
}
