import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PostsFeed from "@/components/feed/postFeed";
import SuggestedFriends from "@/components/feed/suggestedFriends";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";

export default function Home({ initialPosts, suggestedUsers }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return null;
  }

  return (
    <main className="mt-[70px] flex justify-center px-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6 justify-between">
        <div className="flex-1">
          <PostsFeed initialPosts={initialPosts} />
        </div>
        <SuggestedFriends initialUsers={suggestedUsers} />
      </div>
    </main>
  );
}

// SSR - Server Side Rendering for fresh data
export async function getServerSideProps(context) {
  try {
    await connectDB();

    // Get session on server side
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session) {
      return {
        redirect: {
          destination: "/auth/login",
          permanent: false,
        },
      };
    }

    // Fetch posts from followed users (fresh data)
    const user = await User.findById(session.user.id).populate("following");
    const followingIds = user.following.map((follow) => follow._id);

    // Include user's own posts and posts from followed users
    const posts = await Post.find({
      $or: [{ author: session.user.id }, { author: { $in: followingIds } }],
    })
      .populate("author", "name username profilePicture")
      .populate("likes", "name username")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "name username profilePicture",
        },
      })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Fetch suggested users (users not followed)
    const suggestedUsers = await User.find({
      _id: {
        $nin: [...followingIds, session.user.id],
      },
    })
      .select("name username profilePicture followersCount")
      .limit(5)
      .lean();

    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(posts)),
        suggestedUsers: JSON.parse(JSON.stringify(suggestedUsers)),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        initialPosts: [],
        suggestedUsers: [],
        error: "Failed to load data",
      },
    };
  }
}
