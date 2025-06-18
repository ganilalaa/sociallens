"use client";

import {
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
  HeartOutlined,
  PlusSquareOutlined,
  BellTwoTone,
  DollarOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useSocket } from "@/contexts/SocketContext";
import CreatePostModal from "../feed/CreatePostModal";
import SearchOverlay from "../feed/SearchOverlay";
import { useSearch } from "@/pages/_app";

function ListItem({ children, className = "", onClick }) {
  const baseClass =
    "min-h-12 px-3 py-2 rounded-md transition-colors duration-200 text-sm flex justify-center xl:justify-start items-center gap-3 cursor-pointer hover:bg-gray-800";
  return (
    <li className={`${baseClass} ${className}`} onClick={onClick}>
      {children}
    </li>
  );
}

function HiddenText({ children }) {
  return (
    <span className="hidden xl:inline font-medium tracking-wide">
      {children}
    </span>
  );
}

const UserSidebar = () => {
  const { data: session } = useSession();
  const { isSearchOpen, setIsSearchOpen } = useSearch();
  const { unreadCount } = useSocket();
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

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const handlePostCreated = (newPost) => {
    console.log("New post created:", newPost);
    window.location.reload();
  };

  return (
    <>
      <div className="hidden md:flex fixed left-0 top-0 w-16 xl:w-56 h-screen bg-gray-900 text-white p-4 z-50 shadow-lg overflow-y-auto flex-col justify-between">
        {/* Top Section */}
        <div>
          <div className="mb-6">
            <h1 className="hidden xl:block text-2xl font-bold leading-tight">
              social-lens
            </h1>
            <h1 className="xl:hidden text-xl font-bold">SL</h1>
            <p className="hidden xl:block text-xs text-gray-400">
              closer together
            </p>
          </div>

          {/* Navigation */}
          <ul className="space-y-1">
            <Link href="/"><ListItem><HomeOutlined /><HiddenText>Home</HiddenText></ListItem></Link>
            <ListItem onClick={toggleSearchBar}><SearchOutlined /><HiddenText>Search</HiddenText></ListItem>
            <Link href="/messages">
              <ListItem className="relative">
                <MessageOutlined />
                <HiddenText>Messages</HiddenText>
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 xl:static xl:ml-auto bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </ListItem>
            </Link>
            <ListItem onClick={toggleNotifications}>
              <HeartOutlined />
              <HiddenText>Notifications</HiddenText>
              <BellTwoTone twoToneColor="#fc0339" />
            </ListItem>
            <Link href="/ads"><ListItem><DollarOutlined /><HiddenText>Ads</HiddenText></ListItem></Link>
            <ListItem onClick={toggleCreatePost}><PlusSquareOutlined /><HiddenText>Create</HiddenText></ListItem>

            {session?.user && (
              <Link href={`/profile/${session.user.id}`}>
                <ListItem>
                  {session.user.profilePicture ? (
                    <img
                      className="rounded-full object-cover"
                      width="28"
                      height="28"
                      src={session.user.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <HiddenText>Profile</HiddenText>
                </ListItem>
              </Link>
            )}
          </ul>

          {/* Static Pages */}
          <div className="mt-6">
            <div className="hidden xl:block text-xs text-gray-400 uppercase tracking-widest mb-2 px-2">
              Information
            </div>
            <ul className="space-y-1">
              <Link href="/about"><ListItem><InfoCircleOutlined /><HiddenText>About</HiddenText></ListItem></Link>
              <Link href="/contact"><ListItem><ContactsOutlined /><HiddenText>Contact</HiddenText></ListItem></Link>
              <Link href="/faq"><ListItem><QuestionCircleOutlined /><HiddenText>FAQ</HiddenText></ListItem></Link>
              <Link href="/terms"><ListItem><FileTextOutlined /><HiddenText>Terms</HiddenText></ListItem></Link>
            </ul>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <ListItem className="hover:bg-red-600" onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5a2 2 0 00-2-2h-3a2 2 0 00-2 2v1" />
            </svg>
            <HiddenText>Log Out</HiddenText>
          </ListItem>
        </div>
      </div>

      {/* Notifications popup */}
      {showNotifications && (
        <div className="absolute top-0 left-16 xl:left-56 ml-2 bg-white text-black p-4 rounded shadow text-sm z-50">
          Notifications (Dummy)
        </div>
      )}

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