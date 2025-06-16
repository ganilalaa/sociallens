"use client"

const UsernameLong = (username) => {
  if (!username) return null
  if (username.length <= 10) {
    return <p className="text-[12px]">{username}</p>
  }
  return <p className="text-[12px]">{username.slice(0, 8) + ".."}</p>
}

const ProfileUser = ({ user, isSelected, onClick, css }) => {
  const borderStory = isSelected ? "border-blue-500" : "border-transparent"

  return (
    <div onClick={onClick} className={`${css} rounded-full text-center mx-2 cursor-pointer`}>
      <img
        className={`${css} object-cover rounded-full border-4 ${borderStory}`}
        src={user.profile_img}
        alt="profile"
      />
      {UsernameLong(user.username)}
    </div>
  )
}

export default ProfileUser