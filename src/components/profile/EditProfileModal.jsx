"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CloseOutlined,
  LoadingOutlined,
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const EditProfileModal = ({
  isOpen,
  onClose,
  onProfileUpdated,
  currentProfile,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    profilePicture: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isInitialized = useRef(false);

  // Initialize form data when modal opens - only once
  useEffect(() => {
    if (isOpen && currentProfile && !isInitialized.current) {
      setFormData({
        name: currentProfile.name || "",
        username: currentProfile.username || "",
        bio: currentProfile.bio || "",
        profilePicture: null,
      });
      setImagePreview(currentProfile.profilePicture || "");
      setError("");
      setSuccess("");
      isInitialized.current = true;
    }
  }, [isOpen, currentProfile]);

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      isInitialized.current = false;
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }));
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.username.trim()) {
      setError("Name and username are required");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      };

      // If there's a new image, convert to base64
      if (formData.profilePicture) {
        updateData.profilePicture = imagePreview;
      }

      const response = await fetch(`/api/users/${currentProfile._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();

      setSuccess("Profile updated successfully!");

      // Notify parent component immediately
      if (onProfileUpdated) {
        onProfileUpdated(updatedProfile);
      }

      // Close modal after showing success message
      setTimeout(() => {
        if (isOpen) {
          onClose();
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData({
        name: "",
        username: "",
        bio: "",
        profilePicture: null,
      });
      setImagePreview("");
      setError("");
      setSuccess("");
      isInitialized.current = false;
      onClose();
    }
  }, [isLoading, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50 p-1"
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserOutlined className="text-gray-600 text-2xl" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profile-picture-upload"
                  disabled={isLoading}
                />
                <label
                  htmlFor="profile-picture-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 inline-flex items-center"
                >
                  <CameraOutlined className="mr-2" />
                  Change Photo
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              maxLength="60"
              disabled={isLoading}
              required
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter username"
              maxLength="30"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Username must be unique and can contain letters, numbers, and
              underscores.
            </p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
              rows="3"
              maxLength="150"
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {formData.bio.length}/150
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || !formData.name.trim() || !formData.username.trim()
            }
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingOutlined className="mr-2" />
                Updating...
              </>
            ) : (
              <>
                <SaveOutlined className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
