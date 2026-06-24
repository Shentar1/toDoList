import "@testing-library/jest-dom";
import { NextApiRequest, NextApiResponse } from "next";
import { POST } from "../app/api/login/route";
import { getUserByUsernameAndPassword } from "../lib/services/usersService";
import { NotFoundError } from "../lib/errors/errors";
import { NextRequest } from "next/server";

jest.mock("../lib/services/usersService", () => ({
  getUserByUsernameAndPassword: jest.fn(),
}));

const mockedGetUserByUsernameAndPassword =
  getUserByUsernameAndPassword as jest.Mock;
const user = {
  id: 1,
  username: "alice",
  password: "secret",
  date_created: new Date(),
  role: "user",
};
describe("login API handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and user when credentials are valid", async () => {
    mockedGetUserByUsernameAndPassword.mockReturnValue(user);

    const req = {
      body: { username: "alice", password: "secret" },
    } as unknown as NextRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await POST(req);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("throws NotFoundError when credentials are invalid", async () => {
    mockedGetUserByUsernameAndPassword.mockImplementationOnce(() => {
      throw new NotFoundError();
    });

    const req = {
      body: { username: "bob", password: "wrong" },
    } as unknown as NextRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await expect(POST(req)).rejects.toBeInstanceOf(NotFoundError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
