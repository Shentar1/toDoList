import { BadRequestError } from "../errors/errors";
import prisma from "../prisma";
import { Job } from "./jobsModels";
import { List } from "./listsModels";
import { NextRequest } from "next/server";

/**
 * TODO: Create a button to create a shareable link for a list
 *       Permit dynamic permissions (assign read, read/write, read/write/delete)
 *       When clicked it should add view permissions to the user if signed in, or prompt for a login, and then add view permissions
 *
 * TODO: add option for reminders on tasks
 * TODO: add option for categories
 */

/**
 *
 * @param request NextRequest object containing a list id
 * @returns an integer representing the list id
 */
export async function parseListId(request: NextRequest): Promise<number> {
  const searchParams = request.nextUrl.searchParams;
  const listIdParam = searchParams.get("listId") || "";
  const listId: number = parseInt(listIdParam);

  if (listId && !isNaN(listId)) {
    return listId;
  } else {
    throw new BadRequestError("List Id is Invalid");
  }
}
/**
 *
 * @param userid
 * @returns Promise that resolves to an array of lists associated to a user id
 * @throws BadRequestError if there are issues with the user id
 */
export async function getListsByUser(userUuid: string): Promise<List[]> {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      select: {
        id: true,
      },
      where: {
        uuid: userUuid,
      },
    });
    const lists = await prisma.lists.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        jobs: true,
      },
    });
    if (!lists) {
      throw new BadRequestError();
    } else if (lists.length === 0) {
      return [];
    } else {
      return lists.map((list) => ({
        id: list.id,
        time_created: list.time_created,
        list_name: list.list_name,
        jobs: list.jobs.map(
          (j: Job) =>
            ({
              id: j.id,
              job_description: j.job_description,
              status: j.status,
              list_id: j.list_id,
            }) as Job,
        ),
      }));
    }
  } catch (error) {
    throw error;
  }
}
/**
 *
 * @param list a list object that is to be validated
 * @returns true if the list is valid
 * @throws if the list is invalid
 */
export async function validateList(list: List): Promise<boolean> {
  try {
    let name = list.list_name;
    let id = list.id;
    //id is not needed for creation, but useful for updates, so we will allow it to be 0 or a valid number, but not undefined or NaN
    let idValid = !isNaN(id);
    //name must be a string with a non-whitespace character
    let nameValid = typeof name === "string" && name.trim().length > 0;

    return idValid && nameValid;
  } catch (error) {
    throw error;
  }
}
/**
 * Attempts to create the list and its jobs in the database. If an error occurs, it catches the error and throws an error
 * indicating that the list was not created successfully.
 * @param list a list object that has been validated
 * @param userId a user id that has been validated and corresponds to the owner of the list object
 * @returns a promise that resolves to true if the operation is successful
 * @throws if the list is invalid
 */
export async function createList(list: List): Promise<List> {
  try {
    const newList = await prisma.lists.create({
      data: {
        list_name: list.list_name,
        user_id: list.user_id,
        time_created: new Date(Date.now()).toUTCString(),
      },
    });
    return newList;
  } catch (error) {
    throw error;
  }
}
/**
 * Attempts to update a list item and its jobs in the database. If an error occurs, it catches the error and throws an error
 * indicating that the list was not created successfully.
 * @param list a list object that has been validated
 * @param userId a user id that has been validated and corresponds to the owner of the list object
 * @returns a promise that resolves to true if the operation is successful
 * @throws if the list is invalid
 */
export async function updateList(list: List): Promise<List> {
  //TODO: add validation that the list id to be updated belongs to the current user
  try {
    const newList = await prisma.lists.update({
      data: {
        list_name: list.list_name,
        user_id: list.user_id,
      },
      where: {
        id: list.id,
      },
    });
    return newList;
  } catch (error) {
    throw error;
  }
}
export async function upsertList(list: List): Promise<List> {
  try {
    const newList = await prisma.lists.upsert({
      where: {
        id: list.id,
      },
      update: {
        list_name: list.list_name,
        user_id: list.user_id,
        time_created: new Date(Date.now()),
      },
      create: {
        list_name: list.list_name,
        user_id: list.user_id,
        time_created: new Date(Date.now()),
      },
    });
    return newList;
  } catch (error) {
    throw error;
  }
}
/**
 * Attempts to create the list and its jobs in the database. If an error occurs, it catches the error and throws an error
 * indicating that the list was not created successfully.
 * @param listId a unique identifier for the list item to be deleted
 * @returns a promise that resolves to true if the operation is successful
 * @throws if the list is invalid
 */
export async function deleteList(listId: number): Promise<List> {
  try {
    const list = await prisma.lists.delete({
      where: {
        id: listId,
      },
    });
    return list;
  } catch (error) {
    throw error;
  }
}
