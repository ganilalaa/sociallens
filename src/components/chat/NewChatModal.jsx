import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import ProfilePic from "../feed/profilePic";

const NewChatModal = ({ isOpen, onClose, onSelectUser }) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/search?q=");
      if (response.ok) {
        const data = await response.json();
        // Filter out current user
        const filteredUsers = data.filter(
          (user) => user._id !== session?.user?.id
        );
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        // Filter out current user
        const filteredUsers = data.filter(
          (user) => user._id !== session?.user?.id
        );
        setSearchResults(filteredUsers);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleUserSelect = (user) => {
    onSelectUser(user);
    onClose();
    setSearchQuery("");
    setSearchResults([]);
  };

  const displayUsers = searchQuery.trim() ? searchResults : users;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">New Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <CloseOutlined className="text-xl" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading users...</p>
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-500">
                {searchQuery.trim() ? "No users found" : "No users available"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {displayUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center gap-3">
                    <ProfilePic
                      css="w-12 h-12"
                      profilePic={
                        user.profilePicture ||
                        `https://i.pravatar.cc/150?u=${user.username}`
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        @{user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
