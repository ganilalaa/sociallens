"use client";

import React, { useEffect, useState, useRef } from "react";

const StoryModal = ({ story, onClose, nextStory, previousStory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState([]);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const stories = story?.stories || [];
  const currentStory = stories[currentIndex];

  // Initialize progress bar
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(new Array(stories.length).fill(0));
  }, [story]);

  // Timer logic for progress bar
  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const updated = [...prev];
        if (updated[currentIndex] < 100) {
          updated[currentIndex] += 2;
        }
        return updated;
      });
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  // Auto-next when progress completes
  useEffect(() => {
    if (progress[currentIndex] >= 100) {
      clearInterval(intervalRef.current);
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        timeoutRef.current = setTimeout(() => {
          if (typeof nextStory === "function") {
            nextStory({ fromPrevious: false });
          } else {
            onClose();
          }
        }, 300);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [progress, currentIndex]);

  // Handlers
  const handleNext = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (typeof nextStory === "function") {
      nextStory({ fromPrevious: false });
    }
  };

  const handlePrevious = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (typeof previousStory === "function") {
      previousStory({ fromNext: false });
    }
  };

  if (!story || stories.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-[380px] h-[680px] sm:w-[420px] sm:h-[740px] bg-black flex flex-col items-center justify-center px-4 rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
        >
          &times;
        </button>

        {/* Progress bars */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 px-4 z-40">
          {stories.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white bg-opacity-40 rounded overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: `${progress[i] || 0}%` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Username */}
        <div className="absolute top-10 left-4 z-40 text-white font-semibold text-sm sm:text-base">
          {story.username || "User"}
        </div>

        {/* Story content */}
        <div className="w-full h-full flex items-center justify-center mt-12">
          <div className="w-full max-h-full overflow-hidden rounded-lg">
            {currentStory?.endsWith(".mp4") ? (
              <video
                src={currentStory}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={currentStory}
                alt="Story"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>

        {/* Message input & emoji */}
        <div className="absolute bottom-4 w-full px-4 flex items-center justify-between text-white z-40">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Send Message"
              className="flex-grow bg-white bg-opacity-10 text-white px-4 py-2 rounded-full outline-none placeholder-white"
            />
            <button className="border border-white px-3 py-1 rounded-full text-sm">
              Send
            </button>
          </div>
          <button className="ml-3 text-2xl">❤️</button>
        </div>

        {/* Previous / Next buttons */}
        <div className="absolute -left-14 top-1/2 transform -translate-y-1/2 z-50">
          <button
            className="w-14 h-14 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center shadow-lg backdrop-blur"
            onClick={handlePrevious}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="absolute -right-14 top-1/2 transform -translate-y-1/2 z-50">
          <button
            className="w-14 h-14 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white flex items-center justify-center shadow-lg backdrop-blur"
            onClick={handleNext}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
