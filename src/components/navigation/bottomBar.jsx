"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSocket } from "@/contexts/SocketContext";
import {
  HomeOutlined,
  CompassOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  MessageOutlined,
  MoreOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
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
  const router = useRouter();
  const { unreadCount } = useSocket();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handlePageNavigation = (path) => {
    router.push(path);
    setShowMoreMenu(false);
  };

  return (
    <>
      <div className="md:hidden flex items-center justify-center fixed bottom-0 left-0 w-full h-[8dvh] bg-gray-900 text-white text-[23px] z-50">
        <ul className="flex w-full justify-around items-center">
          <ListItem onClick={() => router.push("/")}>
            <HomeOutlined />
          </ListItem>
          <ListItem className="sm:hidden">
            <SearchOutlined />
          </ListItem>
          <ListItem>
            <PlusSquareOutlined />
          </ListItem>
          <ListItem
            onClick={() => router.push("/messages")}
            className="relative"
          >
            <MessageOutlined />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </div>
            )}
          </ListItem>
          <ListItem>
            <CompassOutlined />
          </ListItem>
          <ListItem onClick={toggleMoreMenu}>
            <MoreOutlined />
          </ListItem>
        </ul>
      </div>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                More Options
              </h3>
              <button
                onClick={toggleMoreMenu}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => handlePageNavigation("/about")}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <InfoCircleOutlined className="text-blue-500 text-xl" />
                <span className="text-gray-900">About Us</span>
              </div>

              <div
                onClick={() => handlePageNavigation("/contact")}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <ContactsOutlined className="text-green-500 text-xl" />
                <span className="text-gray-900">Contact Us</span>
              </div>

              <div
                onClick={() => handlePageNavigation("/faq")}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <QuestionCircleOutlined className="text-purple-500 text-xl" />
                <span className="text-gray-900">FAQ</span>
              </div>

              <div
                onClick={() => handlePageNavigation("/terms")}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <FileTextOutlined className="text-orange-500 text-xl" />
                <span className="text-gray-900">Terms & Conditions</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomBar;
