import { authOptions } from "./[...nextauth]";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

jest.mock("@/models/User");
jest.mock("@/lib/mongodb");
jest.mock("bcryptjs");

describe("NextAuth Credentials authorize", () => {
  const authorize = authOptions.providers[0].authorize;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null if user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const result = await authorize({ email: "notfound", password: "x" });
    expect(result).toBeNull();
  });

  it("returns null if password is invalid", async () => {
    User.findOne.mockResolvedValue({ password: "hashed" });
    bcrypt.compare.mockResolvedValue(false);
    const result = await authorize({ email: "user", password: "wrong" });
    expect(result).toBeNull();
  });

  it("returns user object if credentials are valid", async () => {
    User.findOne.mockResolvedValue({
      _id: { toString: () => "1" },
      email: "a@b.com",
      name: "A",
      username: "a",
      password: "hashed",
      profilePicture: "",
    });
    bcrypt.compare.mockResolvedValue(true);
    const result = await authorize({ email: "a@b.com", password: "123456" });
    expect(result).toMatchObject({
      id: "1",
      email: "a@b.com",
      name: "A",
      username: "a",
      profilePicture: "",
    });
  });
});
