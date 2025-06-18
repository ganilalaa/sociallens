import { authOptions } from "./[...nextauth]";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";

// Mock User constructor and static methods
function MockUser() {}
MockUser.findOne = jest.fn();

jest.mock("@/models/User", () => {
  return {
    __esModule: true,
    default: MockUser,
    User: MockUser,
  };
});

jest.mock("@/lib/mongodb", () => jest.fn(() => Promise.resolve()));
jest.mock("bcryptjs");
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  Schema: class {
    static Types = { ObjectId: "ObjectId" };
  },
  model: jest.fn(() => ({})),
}));

// Re-import User after mocking
import User from "@/models/User";

describe("NextAuth Credentials authorize", () => {
  const authorize = authOptions.providers[0].authorize;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: throw if findOne is called unexpectedly
    User.findOne.mockImplementation(() => {
      throw new Error("User.findOne not mocked for this test");
    });
  });

  it("returns null if user not found", async () => {
    User.findOne.mockReturnValue({
      select: () => Promise.resolve(null),
    });
    const result = await authorize({ email: "notfound", password: "x" });
    expect(result).toBeNull();
  });

  it("returns null if password is invalid", async () => {
    User.findOne.mockReturnValue({
      select: () => Promise.resolve({ password: "hashed" }),
    });
    bcrypt.compare.mockResolvedValue(false);
    const result = await authorize({ email: "user", password: "wrong" });
    expect(result).toBeNull();
  });
});
