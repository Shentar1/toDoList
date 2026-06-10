import "@testing-library/jest-dom";
import * as usersService from "../lib/services/usersService";
import prisma from "../lib/prisma";
import { NotFoundError } from "../lib/errors/errors";
import { User } from "../lib/services/usersModels";

jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    users: {
      findUniqueOrThrow: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
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
    test("returns uuid when userId query parameter is valid", async () => {
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams({
            userId: "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
          }),
        },
      } as unknown as any;

      await expect(usersService.parseUserUuid(request)).resolves.toBe(
        "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      );
    });

    test("throws BadRequestError when userId query parameter is invalid", async () => {
      const request = {
        nextUrl: {
          searchParams: new URLSearchParams({ userId: "123" }),
        },
      } as unknown as any;

      await expect(usersService.parseUserUuid(request)).rejects.toThrow(
        "User Id is Invalid",
      );
    });
  });

  /*  describe('getUserById', () => {
    test('returns user when found', async () => {

      mockedPrisma.users.findUniqueOrThrow.mockResolvedValue(expectedUser);

      await expect(usersService.getUserById(1)).resolves.toBe(expectedUser);
    });
  });*/

  describe("getUserByUsernameAndPassword", () => {
    test("returns user when username and password match", async () => {
      mockedPrisma.users.findUniqueOrThrow.mockResolvedValue(expectedUser);

      await expect(
        usersService.getUserByUsernameAndPassword("test", "secret"),
      ).resolves.toBe(expectedUser);
    });

    test("throws NotFoundError when password does not match", async () => {
      mockedPrisma.users.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError(),
      );

      await expect(
        usersService.getUserByUsernameAndPassword("test", "wrong"),
      ).rejects.toThrow(NotFoundError);
    });

    test("throws NotFoundError when user is not found", async () => {
      mockedPrisma.users.findUniqueOrThrow.mockRejectedValue(
        new NotFoundError(),
      );

      await expect(
        usersService.getUserByUsernameAndPassword("missing", "secret"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("create  or update user", () => {
    test("creates/updates as user and returns new user or properties", async () => {
      const userInput = {
        username: "new",
        password: "verysecure",
      } as User;
      const createdUser = {
        ...userInput,
        id: 2,
        time_created: new Date(),
        role: "user",
        lists: [],
      } as User;

      mockedPrisma.users.upsert.mockResolvedValue(createdUser);

      await expect(usersService.createOrUpdateUser(userInput)).resolves.toBe(
        createdUser,
      );
    });
  });

  describe("validateUser", () => {
    test("returns true for valid user", async () => {
      const validUser = {
        username: "validUser",
        password: "moreThan8",
        time_created: new Date(),
        role: "admin",
      } as User;

      await expect(usersService.validateUser(validUser)).resolves.toBe(true);
    });

    test("returns false for invalid user data", async () => {
      const invalidUser = {
        username: "a",
        password: "short",
        time_created: new Date("invalid"),
        role: "",
      } as User;

      await expect(usersService.validateUser(invalidUser)).resolves.toBe(false);
    });
  });
});
