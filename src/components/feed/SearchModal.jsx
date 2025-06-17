"use client";

import { useState, useEffect } from "react";
import {
  CloseOutlined,
  SearchOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SearchModal = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchUsers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError("Failed to search users");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Search Users</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username or name..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <LoadingOutlined className="text-2xl text-blue-500" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}

          {error && <div className="p-4 text-red-600 text-center">{error}</div>}

          {!isLoading &&
            !error &&
            searchQuery &&
            searchResults.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No users found
              </div>
            )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="divide-y">
              {searchResults.map((user) => (
                <SearchResultItem
                  key={user._id}
                  user={user}
                  onClose={handleClose}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && !searchQuery && (
            <div className="p-8 text-center text-gray-500">
              Start typing to search for users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultItem = ({ user, onClose }) => {
  return (
    <Link href={`/profile/${user._id}`} onClick={onClose}>
      <div className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors">
        <div className="flex-shrink-0">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <UserOutlined className="text-gray-600 text-xl" />
            </div>
          )}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-semibold text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500">@{user.username}</div>
          {user.bio && (
            <div className="text-sm text-gray-600 mt-1 truncate">
              {user.bio}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchModal;
