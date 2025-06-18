import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, describe, it, test } from "@jest/globals";

import Login from "./login";
import { signIn, useSession } from "next-auth/react";

jest.mock("next-auth/react");

beforeEach(() => {
  useSession.mockReturnValue({ data: null, status: "unauthenticated" });
});

describe("Login Page", () => {
  it("renders login form", () => {
    render(<Login />);
    expect(
      screen.getByPlaceholderText(/email, username or phone/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty and login is clicked", async () => {
    render(<Login />);
    fireEvent.click(screen.getByText(/log in/i));
    expect(await screen.findByText(/please enter both/i)).toBeInTheDocument();
  });

  it("calls signIn on valid input", async () => {
    signIn.mockResolvedValue({});
    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email, username or phone/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/log in/i));
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith(
        "credentials",
        expect.objectContaining({
          email: "test@example.com",
          password: "password123",
          redirect: false,
        })
      );
    });
  });
});
