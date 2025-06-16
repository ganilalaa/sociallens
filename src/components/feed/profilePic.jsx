"use client"

import ProfileUser from "@/components/feed/ProfileUser"

const ProfilePic = ({ profilePic, css }) => {
  const user = {
    username: "",
    profile_img: profilePic,
  }

  const handleUserClick = () => {
    console.log("Clicked")
  }

  return (
    <div>
      <ProfileUser
        css={css}
        user={user}
        onClick={handleUserClick}
        isSelected={false}
      />
    </div>
  )
}

export default ProfilePic