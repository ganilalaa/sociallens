"use client"

import { useEffect, useState } from "react"
import SwitchProfile from "../navigation/SwitchProfile"

const dummyProfile = {
  id: 1,
  username: "your_username",
  firstName: "Your",
  lastName: "Name",
  profilePicture: {
    url: "https://i.pravatar.cc/150?img=1",
  },
}

const dummySuggestions = [
  {
    id: 2,
    username: "john_doe",
    profilePicture: { url: "https://i.pravatar.cc/150?img=2" },
    isSponsored: true,
  },
  {
    id: 3,
    username: "jane_smith",
    profilePicture: { url: "https://i.pravatar.cc/150?img=3" },
    isSponsored: false,
  },
  {
    id: 4,
    username: "michael_b",
    profilePicture: { url: "https://i.pravatar.cc/150?img=4" },
    isSponsored: true,
  },
]

const SuggestedFriends = () => {
  const [profileId, setProfileId] = useState(null)
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    setProfileId(dummyProfile)
    setProfiles(dummySuggestions)
  }, [])

  const follow = (id) => {
    console.log("Followed user with ID:", id)
  }

  return (
    <aside className="hidden xl:block lg:block lg:ml-16 xl:ml-7 mt-6 w-[315px] text-sm">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
        <SwitchProfile
          imageSRC={profileId?.profilePicture?.url}
          username={profileId?.username}
          beloweN={`${profileId?.firstName} ${profileId?.lastName}`}
          navLink={"Switch"}
          css={"text-[#008FEC] hover:text-[#00376B] cursor-pointer"}
        />

        <div className="w-full flex justify-between mt-6 mb-2">
          <p className="text-[#737373] font-semibold">Suggested for you</p>
          <p className="text-black hover:text-[#a7a6a6] cursor-pointer text-xs">See All</p>
        </div>

        <div className="flex flex-col gap-4">
          {profiles.slice(0, 5).map((user) => (
            <div key={user.id} className="relative">
              {user.isSponsored && (
                <span className="absolute -left-2 -top-2 bg-blue-500 text-white text-[10px] px-2 py-[2px] rounded-full z-10">
                  Sponsored
                </span>
              )}
              <SwitchProfile
                username={user.username}
                imageSRC={user.profilePicture?.url}
                beloweN={"Suggested by SocialLens"}
                onClick={() => follow(user.id)}
                button={"Follow"}
                css={"text-[#008FEC] hover:text-[#00376B] cursor-pointer"}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default SuggestedFriends