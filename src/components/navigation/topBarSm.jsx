"use client";

import React from "react";
import {
  MessageOutlined,
  HeartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

function ListItem({ children }) {
  return (
    <li className="sm:px-[40px] xs:px-[25px] 2xs:px-[15px] px-[13px]">
      {children}
    </li>
  );
}

const TopBarSm = () => {
  return (
    <div className="md:hidden flex px-2 justify-between items-center fixed left-0 top-0 w-full h-[8dvh] bg-gray-900 text-white text-[25px] z-40">
      <div>
        <h5 className="sm:text-[22px] xs:text-[20px] 2xs:text-[15px] font-bold text-[15px] uppercase">
          social-lens
        </h5>
      </div>
      <div className="ml-3">
        <input
          className="rounded-md bg-white text-black sm:w-[160px] w-[100px] h-[25px] px-2 text-sm placeholder-gray-500"
          type="search"
          placeholder="Search"
        />
      </div>
      <div>
        <ul className="flex">
          <ListItem>
            <HeartOutlined />
          </ListItem>
          <ListItem>
            <MessageOutlined />
          </ListItem>
        </ul>
      </div>
    </div>
  );
};

export default TopBarSm;