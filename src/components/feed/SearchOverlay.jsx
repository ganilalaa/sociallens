"use client";

import { useState, useEffect, useRef } from "react";
import {
  SearchOutlined,
  LoadingOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SearchOverlay = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError("");
    onClose();
  };

  const handleResultClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
      <div ref={searchRef} className="max-w-2xl mx-auto p-4">
        {/* Search Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Search Users</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <LoadingOutlined className="text-2xl text-blue-500" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-600 text-center bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {!isLoading &&
            !error &&
            searchQuery &&
            searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserOutlined className="text-4xl mb-2 text-gray-300" />
                <p>No users found</p>
              </div>
            )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <SearchResultItem
                  key={user._id}
                  user={user}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}

          {!isLoading && !error && !searchQuery && (
            <div className="text-center py-8 text-gray-500">
              <SearchOutlined className="text-4xl mb-2 text-gray-300" />
              <p>Start typing to search for users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultItem = ({ user, onClick }) => {
  return (
    <Link href={`/profile/${user._id}`} onClick={onClick}>
      <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
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
            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
              {user.bio}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchOverlay;
