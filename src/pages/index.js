import PostsFeed from "@/components/feed/postFeed";
import SuggestedFriends from "@/components/feed/suggestedFriends";

export default function Home() {
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
