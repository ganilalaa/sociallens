"use client";

import React, { useRef, useState, useEffect } from "react";

const isMobile = () => {
  if (typeof window === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export default function UploadStory({ onClose, onUpload }) {
  const fileInputRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [status, setStatus] = useState("idle");
  const [profileImg, setProfileImg] = useState(
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );

  useEffect(() => {
    if (isMobile()) {
      setShowCamera(true);
    }
    const raw = localStorage.getItem("profileData");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        if (user?.profilePicture?.url) {
          setProfileImg(user.profilePicture.url);
        }
      } catch {}
    }
  }, []);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setStatus("uploading");
      try {
        // simulate upload
        await wait(1000);
        await onUpload(file);
        await onUpload(localUrl); // we pass URL not file (mock)
        setStatus("success");
        await wait(1500);
        onClose();
        await wait(300);
        setStatus("idle");
      } catch (err) {
        setStatus("idle");
      }
    }
  };

  const renderCircle = () => {
    if (status === "uploading") {
      return (
        <div className="w-[75px] h-[75px] rounded-full border-4 border-blue-500 flex items-center justify-center animate-spin border-t-transparent mx-auto my-2" />
      );
    }

    if (status === "success") {
      return (
        <div className="w-[75px] h-[75px] rounded-full border-4 border-green-500 flex items-center justify-center bg-green-100 mx-auto my-2 transition-opacity duration-300">
          ✓
        </div>
      );
    }

    return (
      <div
        className="relative w-[75px] h-[75px] mx-auto my-2 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-full h-full rounded-full border-4 border-blue-500 overflow-hidden">
          <img
            src={profileImg}
            alt="your-story"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold border-2 border-white">
          +
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload Story</h2>

        {showCamera ? (
          <div className="flex flex-col items-center">
            {renderCircle()}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="gallery-input"
            />
            <label
              htmlFor="gallery-input"
              className="block bg-gray-200 text-black py-2 px-4 rounded w-full text-center cursor-pointer mt-2"
            >
              Choose from Gallery
            </label>
          </div>
        ) : (
          <>
            {renderCircle()}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white py-2 px-4 rounded w-full mt-2"
            >
              Upload from Computer
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
