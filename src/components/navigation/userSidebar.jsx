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
import { useSession } from "next-auth/react";
import CreatePostModal from "../feed/CreatePostModal";
import SearchOverlay from "../feed/SearchOverlay";
import { useSearch } from "@/pages/_app";

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
  const { data: session } = useSession();
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const router = useRouter();

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen);
    setShowNotifications(false);
  };

  const toggleCreatePost = () => {
    setShowCreatePost(!showCreatePost);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handlePostCreated = (newPost) => {
    // You can add logic here to refresh the feed or show a success message
    console.log("New post created:", newPost);
    // Optionally trigger a page refresh or update the feed
    window.location.reload();
  };

  return (
    <>
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

            {session?.user && (
              <Link href={`/profile/${session.user.id}`}>
                <ListItem>
                  {session.user.profilePicture ? (
                    <img
                      className="rounded-full object-cover"
                      width="30"
                      height="30"
                      src={session.user.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <HiddenText>Profile</HiddenText>
                </ListItem>
              </Link>
            )}
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

        {showNotifications && (
          <div className="absolute top-0 left-full ml-2 bg-white text-black p-4 rounded shadow">
            Notifications (Dummy)
          </div>
        )}
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
};

export default UserSidebar;
