"use client";

import { useState, useEffect } from "react";
import ProfileUser from "@/components/feed/profileUser";
import UploadStory from "@/components/feed/uploadStory";
import StoryModal from "@/components/feed/storyModal";

const Story = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [friendStories, setFriendStories] = useState([]);
  const [activeUserStory, setActiveUserStory] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [storyHistory, setStoryHistory] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const [meRes, friendsRes] = await Promise.all([
          fetch("/api/stories/me"),
          fetch("/api/stories"),
        ]);

        const myData = await meRes.json();
        const friendData = await friendsRes.json();

        if (meRes.ok && myData) {
          setCurrentUser({
            id: myData.userId,
            username: myData.username,
            profile_img: myData.profilePictureUrl || "/default-avatar.png",
          });
          setUserStories(myData.stories || []);
        } else {
          setCurrentUser({
            id: 0,
            username: "You",
            profile_img: "/default-avatar.png",
          });
        }

        if (friendsRes.ok && Array.isArray(friendData)) {
          setFriendStories(friendData);
        }
      } catch (err) {
        console.error("Failed to load stories", err);
      }
    };

    fetchStories();
  }, []);

  const handleSelectedStory = (story) => {
    setActiveUserStory(story);
    setActiveStoryIndex(0);
    setStoryHistory([]);
  };

  const handleClickYourStory = () => {
    setShowUpload(true);
  };

  const userHasStory = userStories.length > 0;

  return (
    <>
      <div className="w-full overflow-x-auto overflow-y-hidden hide-scrollbar">
        <ul className="flex gap-4">
          {currentUser && (
            <li className="relative text-center flex-shrink-0 w-[75px]">
              <div
                className="relative w-[75px] h-[75px] mx-auto cursor-pointer"
                onClick={() => {
                  if (userHasStory) {
                    const myStoryPayload = {
                      userId: currentUser.id,
                      username: currentUser.username,
                      profilePictureUrl: currentUser.profile_img,
                      stories: userStories,
                    };
                    handleSelectedStory(myStoryPayload);
                  }
                }}
              >
                <div
                  className={`w-full h-full rounded-full border-4 ${
                    userHasStory ? "border-blue-500" : "border-gray-300"
                  } overflow-hidden`}
                >
                  <img
                    src={currentUser.profile_img || "/default-avatar.png"}
                    alt="Your Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClickYourStory();
                  }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white cursor-pointer"
                >
                  +
                </div>
              </div>
              <p className="text-[12px] mt-1">{currentUser.username}</p>
            </li>
          )}

          {Array.isArray(friendStories) &&
            friendStories.map((story, index) => (
              <ProfileUser
                css="w-[75px] h-[75px] flex-shrink-0"
                key={story.userId ?? index}
                user={{
                  id: story.userId,
                  username: story.username ?? "Unknown",
                  profile_img: story.profilePictureUrl || "/default-avatar.png",
                }}
                isSelected={true}
                onClick={() => handleSelectedStory(story)}
              />
            ))}
        </ul>
      </div>

      {showUpload && (
        <UploadStory
          onUpload={async (file) => {
            try {
              const formData = new FormData();
              formData.append("file", file);

              const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              if (!uploadRes.ok) {
                const text = await uploadRes.text();
                console.error("Upload API error:", text);
                throw new Error("Upload failed");
              }

              const { url, type } = await uploadRes.json();
              const cleanType = type.startsWith("image") ? "image" : "video";

              await fetch("/api/stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, type: cleanType }),
              });

              const meRes = await fetch("/api/stories/me");
              const myData = await meRes.json();
              setUserStories(myData?.stories || []);
              setCurrentUser({
                id: myData.userId,
                username: myData.username,
                profile_img: myData.profilePictureUrl || "/default-avatar.png",
              });
            } catch (e) {
              console.error("Failed to upload story", e);
            } finally {
              setShowUpload(false);
            }
          }}
          onClose={() => setShowUpload(false)}
        />
      )}

      {activeUserStory && (
        <StoryModal
          story={activeUserStory}
          onClose={() => {
            setActiveUserStory(null);
            setActiveStoryIndex(null);
            setStoryHistory([]);
          }}
          nextStory={({ fromPrevious }) => {
            if (!fromPrevious) {
              setStoryHistory((prev) => [
                ...prev,
                { user: activeUserStory, index: activeStoryIndex },
              ]);
            }

            const allStories = [
              ...(userStories.length > 0 && currentUser
                ? [
                    {
                      userId: currentUser.id,
                      username: currentUser.username,
                      profilePictureUrl: currentUser.profile_img,
                      stories: userStories,
                    },
                  ]
                : []),
              ...friendStories,
            ];

            const currentIndex = allStories.findIndex(
              (s) => s.userId === activeUserStory.userId
            );
            const next = currentIndex + 1;
            if (next < allStories.length) {
              setActiveUserStory(allStories[next]);
              setActiveStoryIndex(0);
            } else {
              setActiveUserStory(null);
              setActiveStoryIndex(null);
            }
          }}
          previousStory={({ fromNext }) => {
            if (storyHistory.length > 0) {
              const last = storyHistory[storyHistory.length - 1];
              setActiveUserStory(last.user);
              setActiveStoryIndex(last.index);
              setStoryHistory((prev) => prev.slice(0, prev.length - 1));
            } else {
              setActiveUserStory(null);
              setActiveStoryIndex(null);
            }
          }}
        />
      )}
    </>
  );
};

export default Story;