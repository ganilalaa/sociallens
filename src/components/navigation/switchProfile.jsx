import React from "react";

const SwitchProfile = ({
  imageSRC,
  username,
  beloweN,
  navLink,
  css = "",
  onClick,
  button,
  check,
}) => {
  return (
    <div className="w-full py-2">
      <div className="flex items-center justify-between w-full">
        {/* Profile Info */}
        <div className="flex items-center">
          <img
            className="w-[55px] h-[55px] rounded-full object-cover"
            src={imageSRC}
            alt={`${username}'s profile`}
          />
          <div className="ml-3">
            <p className="font-bold text-sm">{username}</p>
            <p className="text-[#737373] text-xs">{beloweN}</p>
          </div>
        </div>

        {/* Right Action */}
        <div className="flex flex-col items-end text-right text-sm">
          {navLink && <p className={css}>{navLink}</p>}
          {button && (
            <button onClick={onClick} className={css}>
              {button}
            </button>
          )}
          {check && <div>{check}</div>}
        </div>
      </div>
    </div>
  );
};

export default SwitchProfile;