"use client";

import React from "react";
import {
  HomeOutlined,
  CompassOutlined,
  PlusSquareOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function ListItem({ children, className = "", onClick }) {
  return (
    <li
      className={`sm:px-[60px] xs:px-[29px] 2xs:px-[24px] px-[12px] ${className} cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

const BottomBar = () => {
  return (
    <div className="md:hidden flex items-center justify-center fixed bottom-0 left-0 w-full h-[8dvh] bg-gray-900 text-white text-[23px] z-50">
      <ul className="flex w-full justify-around items-center">
        <ListItem>
          <HomeOutlined />
        </ListItem>
        <ListItem className="sm:hidden">
          <SearchOutlined />
        </ListItem>
        <ListItem>
          <PlusSquareOutlined />
        </ListItem>
        <ListItem>
          <CompassOutlined />
        </ListItem>
        <ListItem>
          <img
            className="rounded-full object-cover"
            width="30"
            height="30"
            src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            alt="Profile"
          />
        </ListItem>
      </ul>
    </div>
  );
};

export default BottomBar;