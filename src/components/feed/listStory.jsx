"use client"

const ListStory = ({ user, isSelected, onClick }) => {
  const borderStory = isSelected
    ? "border-blue-500"
    : "border-transparent border-gradient"

  return (
    <div className="w-[80px] text-center cursor-pointer" onClick={onClick}>
      <li className={`mx-2 mt-3 border-4 h-[65px] ${borderStory} rounded-full`}>
        <img
          className="rounded-full w-full h-full object-cover"
          src={user.profile_img}
          alt="profile"
        />
      </li>
      {usernameShort(user.username)}
    </div>
  )
}

const usernameShort = (username) => {
  if (!username) return null
  return (
    <p className="text-[12px]">
      {username.length <= 10 ? username : `${username.slice(0, 8)}..`}
    </p>
  )
}

export default ListStory