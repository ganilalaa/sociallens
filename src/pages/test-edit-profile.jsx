"use client";

import { useSession } from "next-auth/react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useState } from "react";

export default function TestEditProfilePage() {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to test the edit profile feature.</div>;
  }

  const mockProfile = {
    name: session.user.name,
    username: session.user.username,
    bio: "This is a test bio for the edit profile functionality.",
    profilePicture: session.user.profilePicture,
  };

  const handleProfileUpdated = (updatedProfile) => {
    console.log("Profile updated:", updatedProfile);
    alert("Profile updated successfully! Check the console for details.");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Profile Test</h1>
      <p className="mb-4">Welcome, {session.user.name}!</p>

      <div className="space-y-4">
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open Edit Profile Modal
        </button>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current Profile Info:</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Username:</strong> {session.user.username}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Profile Picture:</strong>{" "}
              {session.user.profilePicture ? "Set" : "Not set"}
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            How the edit profile works:
          </h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click "Edit Profile" button to open the modal</li>
            <li>Update your name, username, bio, and profile picture</li>
            <li>Profile picture supports JPG, PNG, GIF (max 5MB)</li>
            <li>Username must be unique</li>
            <li>Changes are saved to the database</li>
            <li>Session is updated with new information</li>
            <li>Profile page reflects changes immediately</li>
          </ul>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProfileUpdated={handleProfileUpdated}
        currentProfile={mockProfile}
      />
    </div>
  );
}
