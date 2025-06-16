"use client";

import {
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
  HeartOutlined,
  PlusSquareOutlined,
  BellTwoTone,
  DollarOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ListItem({ children, className = "", onClick }) {
  const baseClass =
    "min-h-16 border-b text-lg flex justify-center xl:justify-start items-center gap-2 cursor-pointer";
  return (
    <li className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </li>
  );
}

function HiddenText({ children }) {
  return <span className="hidden xl:inline">{children}</span>;
}

const UserSidebar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const router = useRouter();

  const dummyProfile = {
    id: "1",
    username: "john_doe",
    profilePicture: {
      url: "https://i.pravatar.cc/150",
    },
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    setShowNotifications(false);
  };

  const toggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSearchBar(false);
  };

  const handleLogout = () => {

    router.push("/login");
  };

  return (
    <div className="hidden md:block fixed left-0 top-0 w-16 xl:w-64 h-[100dvh] bg-gray-900 text-white p-4 xl:p-8 z-50">
      <div className="h-full">
        <div>
          <h1 className="hidden xl:block text-4xl font-bold">social-lens</h1>
          <h1 className="xl:hidden text-2xl font-bold">SL</h1>
          <p className="hidden xl:block">closer together</p>
        </div>
        <ul className="mt-16">
          <Link href="/">
            <ListItem>
              <HomeOutlined />
              <HiddenText>Home</HiddenText>
            </ListItem>
          </Link>
          <ListItem onClick={toggleSearchBar}>
            <SearchOutlined />
            <HiddenText>Search</HiddenText>
          </ListItem>

          <Link href="/inbox">
            <ListItem>
              <MessageOutlined />
              <HiddenText>Message</HiddenText>
            </ListItem>
          </Link>

          <ListItem onClick={toggleNotifications}>
            <HeartOutlined />
            <HiddenText>Notifications</HiddenText>
            <BellTwoTone twoToneColor="#fc0339" />
          </ListItem>

          <Link href="/ads">
            <ListItem>
              <DollarOutlined />
              <HiddenText>Ad Packages</HiddenText>
            </ListItem>
          </Link>

          <ListItem onClick={toggleCreatePost}>
            <PlusSquareOutlined />
            <HiddenText>Create</HiddenText>
          </ListItem>

          <Link href={`/profile/${dummyProfile.id}`}>
            <ListItem>
              <img
                className="rounded-full object-cover"
                width="30"
                height="30"
                src={dummyProfile.profilePicture.url}
                alt="Profile"
              />
              <HiddenText>Profile</HiddenText>
            </ListItem>
          </Link>
        </ul>

        <div className="absolute bottom-0 w-full">
          <ListItem className="border-b-0" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5a2 2 0 00-2-2h-3a2 2 0 00-2 2v1"
              />
            </svg>
            <HiddenText>Log Out</HiddenText>
          </ListItem>
        </div>
      </div>

      {showSearchBar && (
        <div className="absolute top-0 left-full ml-2 bg-white text-black p-4 rounded shadow">
          SearchBar (Dummy)
        </div>
      )}
      {showNotifications && (
        <div className="absolute top-0 left-full ml-2 bg-white text-black p-4 rounded shadow">
          Notifications (Dummy)
        </div>
      )}
      {showCreatePost && (
        <div className="absolute top-0 left-full ml-2 bg-white text-black p-4 rounded shadow">
          CreatePostTest (Dummy)
        </div>
      )}
    </div>
  );
};

export default UserSidebar;