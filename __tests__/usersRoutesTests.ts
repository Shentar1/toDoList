import "@testing-library/jest-dom";
import * as userService from "../lib/services/usersService";
import { User } from "../lib/services/usersModels";
import { BadRequestError } from "../lib/errors/errors";

jest.mock("../lib/prisma", () => ({
  users: {
    findMany: jest.fn(),
    upsert: jest.fn().mockImplementation((sql) => {
      return sql.create;
    }),
    delete: jest.fn(),
  },
}));
const mockUser = {
  id: 1,
  uuid: "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
  username: "abcde",
  password: "fghijklmn",
  role: "user",
  time_created: new Date(Date.now()),
} as User;
const badUser = {
  id: 2,
  uuid: "123",
  username: "1234",
  password: "hatred",
  role: "67",
  timeCreated: "no",
} as User;
describe("POST", () => {
  it("should create a user if all the fields for a user are valid", async () => {
    if (await userService.validateUser(mockUser)) {
      const newUser = await userService.createOrUpdateUser(mockUser);
      expect(newUser.time_created).toEqual(mockUser.time_created);
      expect(newUser.username).toEqual(mockUser.username);
      expect(newUser.password).toEqual(mockUser.password);
      expect(newUser.role).toEqual(mockUser.role);
    } else {
      throw new BadRequestError();
    }
  });
  it("should throw a bad request error for an invalid user", async () => {
    expect(userService.validateUser(badUser)).resolves.toBe(false);
  });
});
