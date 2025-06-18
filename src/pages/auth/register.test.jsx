import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./register";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  );
});
afterEach(() => {
  jest.resetAllMocks();
});

describe("Register Page", () => {
  it("renders register form", () => {
    render(<Register />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it("shows error if fields are empty and next is clicked", async () => {
    render(<Register />);
    fireEvent.click(screen.getByText(/next/i));
    expect(
      await screen.findByText(/all fields are required/i)
    ).toBeInTheDocument();
  });

  it("submits registration with valid data", async () => {
    render(<Register />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText(/next/i));
    // Step 2: skip file upload
    fireEvent.click(screen.getByText(/next/i));
    // Step 3: skip bio
    fireEvent.click(screen.getByText(/next/i));
    // Step 4: submit
    fireEvent.click(screen.getByText(/complete sign-up/i));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/register",
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
