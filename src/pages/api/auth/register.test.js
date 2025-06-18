import handler from "./register";
import httpMocks from "node-mocks-http";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

jest.mock("@/models/User");
jest.mock("@/lib/mongodb");

describe("/api/auth/register API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if fields are missing", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "", name: "", username: "", password: "" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/all fields are required/i);
  });

  it("returns 400 if password is too short", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "a@b.com", name: "A", username: "a", password: "123" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/password must be at least 6/i);
  });

  it("returns 201 on valid registration", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "1",
      name: "A",
      email: "a@b.com",
      username: "a",
      profilePicture: "",
    });
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "a@b.com", name: "A", username: "a", password: "123456" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData().message).toMatch(/user created/i);
  });

  it("returns 400 if user exists", async () => {
    User.findOne.mockResolvedValue({ email: "a@b.com" });
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "a@b.com", name: "A", username: "a", password: "123456" },
    });
    const res = httpMocks.createResponse();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toMatch(/already/);
  });
});
