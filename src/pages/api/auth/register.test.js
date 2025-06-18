// Mock mongoose before any other imports
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  Schema: class {
    static Types = { ObjectId: "ObjectId" };
  },
  model: jest.fn(() => ({})),
}));

import handler from "./register";
import httpMocks from "node-mocks-http";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { formidable } from "formidable";
import bcrypt from "bcryptjs";

// Mock User constructor and static methods
const mockSave = jest.fn();
jest.mock("@/models/User", () => {
  const User = jest.fn().mockImplementation(() => ({ save: mockSave }));
  User.findOne = jest.fn();
  return User;
});

jest.mock("@/lib/mongodb");

// Mock formidable
jest.mock("formidable", () => {
  return {
    formidable: jest.fn().mockImplementation(() => ({
      parse: jest.fn(),
    })),
  };
});

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => Promise.resolve("hashedpw")),
}));

describe("/api/auth/register API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if fields are missing", async () => {
    require("formidable").formidable.mockImplementation(() => ({
      parse: (req, cb) =>
        cb(
          null,
          { name: [""], email: [""], username: [""], password: [""] },
          {}
        ),
    }));
    const req = httpMocks.createRequest({ method: "POST" });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/all fields are required/i);
  });

  it("returns 400 if password is too short", async () => {
    require("formidable").formidable.mockImplementation(() => ({
      parse: (req, cb) =>
        cb(
          null,
          {
            name: ["A"],
            email: ["a@b.com"],
            username: ["a"],
            password: ["123"],
          },
          {}
        ),
    }));
    const req = httpMocks.createRequest({ method: "POST" });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/password must be at least 6/i);
  });

  it("returns 201 on valid registration", async () => {
    User.findOne.mockResolvedValue(null);
    mockSave.mockResolvedValue();
    require("formidable").formidable.mockImplementation(() => ({
      parse: (req, cb) =>
        cb(
          null,
          {
            name: ["A"],
            email: ["a@b.com"],
            username: ["a"],
            password: ["123456"],
            bio: [""],
          },
          {}
        ),
    }));
    const req = httpMocks.createRequest({ method: "POST" });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().message).toMatch(/user created/i);
  });

  it("returns 400 if user exists", async () => {
    User.findOne.mockResolvedValue({ email: "a@b.com" });
    require("formidable").formidable.mockImplementation(() => ({
      parse: (req, cb) =>
        cb(
          null,
          {
            name: ["A"],
            email: ["a@b.com"],
            username: ["a"],
            password: ["123456"],
          },
          {}
        ),
    }));
    const req = httpMocks.createRequest({ method: "POST" });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/already/);
  });
});
