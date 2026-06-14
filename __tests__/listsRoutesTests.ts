import "@testing-library/jest-dom";
import { GET, POST, PUT, DELETE } from "../app/api/lists/route";
import { NextRequest } from "next/server";
import {
  BadRequestError,
  DatabaseError,
  ValidationError,
} from "@/lib/errors/errors";
import * as listsService from "../lib/services/listsService";
const mockList = [
  {
    id: 1,
    list_name: "Test List",
    user_uuid: "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
    jobs: [],
  },
  {
    id: 2,
    list_name: "Test List",
    user_uuid: "d23cb603-c4ec-4fdf-9730-cd7d1973950b",
    jobs: [],
  },
];
jest.mock("../lib/services/listsService");
jest.mock("../lib/services/usersService");
describe("lists GET route", () => {
  it("should return a collection of lists for a valid user id", async () => {
    (listsService.getListsByUser as jest.Mock).mockResolvedValueOnce(mockList);
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
    );
    const response = await GET(mockRequest);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockList);
  });
});
describe("lists POST route", () => {
  it("should create a new list for a valid user id and list data", async () => {
    (listsService.validateList as jest.Mock).mockResolvedValueOnce(true);
    (listsService.createList as jest.Mock).mockResolvedValueOnce(mockList[0]);
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      {
        method: "POST",
        body: JSON.stringify(mockList[0]),
      },
    );
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("List created successfully");
  });
  it("should return an error for an invalid list structure", async () => {
    (listsService.validateList as jest.Mock).mockRejectedValueOnce(
      new ValidationError("Failed to validate list data"),
    );
    (listsService.createList as jest.Mock).mockResolvedValueOnce(mockList[0]);
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      {
        method: "POST",
        body: JSON.stringify([]),
      },
    );
    const response = await POST(mockRequest);
    expect(response.status).toBe(422);
  });
});
describe("lists PUT route", () => {
  it("should update an existing list item", async () => {
    (listsService.updateList as jest.Mock).mockResolvedValueOnce(mockList[0]);
    (listsService.validateList as jest.Mock).mockResolvedValueOnce(true);
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      {
        method: "PUT",
        body: JSON.stringify(mockList[0]),
      },
    );
    const response = await PUT(mockRequest);

    await expect(response.json()).resolves.toEqual({
      status: 200,
      statusText: "List Updated Successfully",
    });
  });
  it("should return an error for a non-object structure", async () => {
    (listsService.validateList as jest.Mock).mockRejectedValueOnce(
      new ValidationError("Invalid list item"),
    );
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      {
        method: "PUT",
        body: JSON.stringify([]),
      },
    );
    const response = await PUT(mockRequest);
    expect(response.status).toBe(422);
  });
  it("should return an error for an invalid list structure", async () => {
    (listsService.validateList as jest.Mock).mockRejectedValueOnce(
      new ValidationError("Invalid list item"),
    );
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?userId=d23cb603-c4ec-4fdf-9730-cd7d1973950b",
      {
        method: "PUT",
        body: JSON.stringify({ invalid: "data" }),
      },
    );
    const response = await PUT(mockRequest);
    expect(response.status).toBe(422);
  });
});
describe("lists DELETE route", () => {
  (it("should delete an existing list item", async () => {
    (listsService.deleteList as jest.Mock).mockResolvedValueOnce(true);
    (listsService.parseListId as jest.Mock).mockResolvedValueOnce(1);
    const mockRequest = new NextRequest(
      "http://localhost:3000/api/lists?listId=1",
      {
        method: "DELETE",
      },
    );
    const response = await DELETE(mockRequest);
    expect(response!.json()).resolves.toEqual({
      status: 203,
      statusText: "List Deleted Successfully",
    });
  }),
    it("should return an error for an invalid list id", async () => {
      (listsService.parseListId as jest.Mock).mockRejectedValue(
        new BadRequestError("List Id is Invalid"),
      );
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/lists?listId=abc",
        {
          method: "DELETE",
        },
      );
      const response = await DELETE(mockRequest);
      expect(listsService.parseListId).toHaveBeenCalledWith(mockRequest);
      expect(listsService.parseListId).rejects.toThrow(BadRequestError);
      expect(response.status).toBe(400);
    }),
    it("should return an error if there is an issue with the database", async () => {
      (listsService.parseListId as jest.Mock).mockResolvedValueOnce(1);
      (listsService.deleteList as jest.Mock).mockRejectedValueOnce(
        new DatabaseError("Database error"),
      );
      const mockRequest = new NextRequest(
        "http://localhost:3000/api/lists?listId=1",
        {
          method: "DELETE",
        },
      );
      const response = await DELETE(mockRequest);
      expect(listsService.parseListId).toHaveBeenCalledWith(mockRequest);
      expect(listsService.deleteList).toHaveBeenCalledWith(1);
      expect(response.status).toBe(500);
    }));
});
