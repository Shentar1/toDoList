import "@testing-library/jest-dom";
import * as usersService from "../lib/services/usersService";
import prisma from "../lib/prisma";
import { NotFoundError } from "../lib/errors/errors";
import { User } from "../lib/services/usersModels";
import { NextRequest } from "next/server";

jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    users: {
      findUniqueOrThrow: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as any;
const expectedUser = {
  id: 1,
  uuid: "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
  username: "test",
  password: "secret",
  time_created: new Date(),
  role: "user",
  lists: [],
} as User;

describe("usersService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("parseUseruuid", () => {
    test("returns uuid when userId query parameter is valid", () => {
      const request = new NextRequest(
        "localhost:3000/users/userId?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      );
      expect(usersService.parseUserUuid(request)).resolves.toBe(
        "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      );
    });

    test("throws BadRequestError when userId query parameter is invalid", () => {
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams({ userId: "123" }),
        },
      } as unknown as any;

      expect(usersService.parseUserUuid(request)).rejects.toThrow(
        "User Id is Invalid",
      );
    });
  });
  describe("getUserByUsernameAndPassword", () => {
    test("returns user when username and password match", () => {
      mockedPrisma.users.findUniqueOrThrow.mockResolvedValue(expectedUser);

      expect(
        usersService.getUserByUsernameAndPassword("test", "secret"),
      ).resolves.toBe(expectedUser);
    });

    test("throws NotFoundError when password does not match", () => {
      mockedPrisma.users.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError(),
      );

      expect(
        usersService.getUserByUsernameAndPassword("test", "wrong"),
      ).rejects.toThrow(NotFoundError);
    });

    test("throws NotFoundError when user is not found", () => {
      mockedPrisma.users.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError(),
      );

      expect(
        usersService.getUserByUsernameAndPassword("missing", "secret"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("create  or update user", () => {
    test("creates/updates as user and returns new user or properties", () => {
      const userInput = {
        username: "new",
        password: "verysecure",
      } as User;
      const createdUser = {
        ...userInput,
        id: 2,
        role: "user",
      } as User;

      mockedPrisma.users.upsert.mockResolvedValue(createdUser);

      expect(usersService.createOrUpdateUser(userInput)).resolves.toBe(
        createdUser,
      );
    });
  });

  describe("validateUser", () => {
    test("returns true for valid user", () => {
      const validUser = {
        username: "validUser",
        password: "moreThan8",
        role: "admin",
      } as User;

      expect(usersService.validateUser(validUser)).resolves.toBe(true);
    });

    test("returns false for invalid user data", () => {
      const invalidUser = {
        username: "a",
        password: "short",
        role: "",
      } as User;

      expect(usersService.validateUser(invalidUser)).resolves.toBe(false);
    });
  });
  describe("deleteUser", () => {
    test("should return true for a successful deletion", () => {
      const successful = usersService.deleteUserByUuid(expectedUser.uuid);
      expect(successful).resolves.toBe(true);
    });
    test("should throw", () => {
      (prisma.users.findUniqueOrThrow as jest.Mock).mockRejectedValueOnce(
        new Error(),
      );
      expect(usersService.deleteUserByUuid(expectedUser.uuid)).rejects.toThrow(
        Error,
      );
    });
  });
});
