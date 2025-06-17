"use client";

import { useSession } from "next-auth/react";
import SearchOverlay from "@/components/feed/SearchOverlay";
import { useSearch } from "@/pages/_app";

export default function TestSearchPage() {
  const { data: session, status } = useSession();
  const { isSearchOpen, setIsSearchOpen } = useSearch();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to test the search feature.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search & Profile Test</h1>
      <p className="mb-4">Welcome, {session.user.name}!</p>

      <div className="space-y-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Search Overlay
        </button>

        <div>
          <p className="mb-2">Test your profile:</p>
          <a
            href={`/profile/${session.user.id}`}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
          >
            View My Profile
          </a>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            How the new search works:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click "Search" in the sidebar or the button above</li>
            <li>The search overlay appears at the top of the page</li>
            <li>You can still see the content below</li>
            <li>Click outside or the X button to close</li>
            <li>Click on a user to view their profile</li>
          </ul>
        </div>
      </div>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
