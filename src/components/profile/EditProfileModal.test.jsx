import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfileModal from "./EditProfileModal";

const currentProfile = {
  _id: "1",
  name: "Test",
  username: "testuser",
  bio: "",
  profilePicture: "",
};

describe("EditProfileModal", () => {
  it("renders when open", () => {
    render(
      <EditProfileModal
        isOpen={true}
        onClose={() => {}}
        onProfileUpdated={() => {}}
        currentProfile={currentProfile}
      />
    );
    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  it("shows error if name or username is empty", async () => {
    render(
      <EditProfileModal
        isOpen={true}
        onClose={() => {}}
        onProfileUpdated={() => {}}
        currentProfile={currentProfile}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText(/save changes/i));
    expect(
      await screen.findByText(/name and username are required/i)
    ).toBeInTheDocument();
  });

  it("calls onProfileUpdated on successful update", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(currentProfile) })
    );
    const onProfileUpdated = jest.fn();
    render(
      <EditProfileModal
        isOpen={true}
        onClose={() => {}}
        onProfileUpdated={onProfileUpdated}
        currentProfile={currentProfile}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/enter your name/i), {
      target: { value: "New Name" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: "newuser" },
    });
    fireEvent.click(screen.getByText(/save changes/i));
    await waitFor(() => {
      expect(onProfileUpdated).toHaveBeenCalled();
    });
  });
});
