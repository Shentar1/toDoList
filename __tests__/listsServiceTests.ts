import "@testing-library/jest-dom";
import * as listsService from "../lib/services/listsService";
import { List } from "../lib/services/listsModels";
import prisma from "../lib/prisma";
jest.mock("../lib/prisma", () => ({
  users: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUniqueOrThrow: jest.fn().mockImplementation(() => {
      return { user_id: 1 };
    }),
  },
  lists: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  jobs: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("validateListItem", () => {
  it("should return true for valid list list_name and id", async () => {
    const list = {
      id: 1,
      user_id: 1,
      list_name: "My List",
    };
    expect(await listsService.validateList(list)).toBe(true);
  });
  it("should throw an error for a non-numeric user id", async () => {
    const list = {
      id: undefined as unknown as number,
      list_name: "My List",
      user_id: 1,
      jobs: [],
    };
    await expect(listsService.validateList(list)).resolves.toBe(false);
  });
  it("should throw an error for non-numeric list id", async () => {
    const list = {
      id: "abc" as unknown as number,
      list_name: "My List",
      user_id: 1,
      jobs: [],
    };
    await expect(listsService.validateList(list)).resolves.toBe(false);
  });
  it("should throw an error for empty list list_name", async () => {
    const list = {
      id: 0,
      list_name: "   ",
      user_id: 1,
      jobs: [],
    };
    await expect(listsService.validateList(list)).resolves.toBe(false);
  });
  it("should throw an error for undefined list list_name", async () => {
    const list = {
      id: 0,
      list_name: undefined as unknown as string,
      user_id: 1,
      jobs: [],
    };
    await expect(listsService.validateList(list)).resolves.toBe(false);
  });
  it("should throw an error for non-string list list_name", async () => {
    const list = {
      id: 0,
      list_name: 123 as unknown as string,
      user_id: 1,
      jobs: [],
    };
    await expect(listsService.validateList(list)).resolves.toBe(false);
  });
});

describe("getListsByUser", () => {
  it("should return an array of lists for a valid user id", async () => {
    const testList = [
      {
        id: 1,
        list_name: "My List 1",
        user_id: 1,
        jobs: [
          {
            id: 1,
            job_description: "My Job 1",
            status: "pending",
            list_id: 1,
          },
        ],
      },
      {
        id: 2,
        list_name: "My List 2",
        user_id: 1,
        jobs: [],
      },
    ];
    (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce(testList);
    const list = await listsService.getListsByUser("1");
    expect(list).toEqual(testList);
  });
  it("should return an empty array if no lists are found for the user", async () => {
    (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce([]);

    const lists = await listsService.getListsByUser("0");
    expect(lists).toEqual([]);
  });
  it("should throw an error for an invalid user id", async () => {
    await expect(
      listsService.getListsByUser(undefined as unknown as string),
    ).rejects.toThrow("Bad Request");
  });
  it("should throw an error for a non-numeric user id", async () => {
    await expect(
      listsService.getListsByUser(123 as unknown as string),
    ).rejects.toThrow("Bad Request");
  });
});

describe("createList", () => {
  it("should return the list item if the data is valid and prisma creates the row in the database", async () => {
    (prisma.lists.create as jest.Mock).mockImplementationOnce(() => {
      return { id: 1, list_name: "My List", user_id: 1 } as List;
    });
    const result = await listsService.createList({
      list_name: "My List",
      user_id: 1,
    } as List);
    expect(result.id).toBe(1);
    expect(result.list_name).toBe("My List");
    expect(result.user_id).toBe(1);
  });
  it("should throw a database error if prisma returns an error", async () => {
    (prisma.lists.create as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(
      listsService.createList({ list_name: "My List", id: 1 } as List),
    ).rejects.toThrow(Error);
  });
});

describe("updateList", () => {
  it("should return the list item if the data is valid and prisma updates the row in the database", async () => {
    (prisma.lists.update as jest.Mock).mockImplementationOnce(() => {
      return { id: 1, user_id: 1, list_name: "My List" } as List;
    });

    const result = await listsService.updateList({
      id: 1,
      list_name: "My List",
      user_id: 1,
    } as List);
    expect(result.id).toBe(1);
    expect(result.list_name).toBe("My List");
    expect(result.user_id).toBe(1);
  });
  it("should throw a database error if prisma returns an error", async () => {
    (prisma.lists.update as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(
      listsService.updateList({ list_name: "My List", id: 1 } as List),
    ).rejects.toThrow(Error);
  });
});

describe("deleteList", () => {
  it("should return true if prisma deletes the row in the database", async () => {
    let lists = [
      {
        id: 1,
        user_id: 1,
        list_name: "My List",
      },
    ] as List[];
    (prisma.lists.delete as jest.Mock).mockImplementationOnce(() => {
      let deleteIndex = lists.findIndex((l) => {
        l.id === 1;
      });
      lists.splice(deleteIndex);
    });
    const result = await listsService.deleteList(1);
    expect(result).toBe(true);
  });
  it("should throw a database error if prisma returns an error", async () => {
    let lists = [
      {
        id: 1,
        user_id: 1,
        list_name: "My List",
      },
    ] as List[];
    (prisma.lists.delete as jest.Mock).mockImplementationOnce(() => {
      (prisma.lists.delete as jest.Mock).mockImplementationOnce(() => {
        let deleteIndex = lists.findIndex((l) => {
          l.id === 1;
        });
        if (deleteIndex === -1) {
          throw new Error();
        }
        lists.splice(deleteIndex);
      });
    });
    await listsService.deleteList(5);
    await expect(listsService.deleteList(1)).rejects.toThrow(Error);
  });
});
