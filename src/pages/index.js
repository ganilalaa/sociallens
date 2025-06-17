import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PostsFeed from "@/components/feed/postFeed";
import SuggestedFriends from "@/components/feed/suggestedFriends";

export default function Home() {
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
          <PostsFeed />
        </div>
        <SuggestedFriends />
      </div>
    </main>
  );
}
