import { BadRequestError, ValidationError } from "@/lib/errors/errors";
import { handleError } from "@/lib/errors/handleError";
import {
  getListsByUser,
  validateList,
  upsertList,
  deleteList,
  getListById,
} from "@/lib/services/listsService";
import { NextRequest, NextResponse } from "next/server";
import { parseUserUuid, getUserByUuid } from "@/lib/services/usersService";
import { List, listDTO } from "@/lib/services/listsModels";

// Get all lists - GET api/lists?userid=<userid>
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await parseUserUuid(request);

    const lists = await getListsByUser(userId);

    const responseDTO: listDTO[] = lists.map((list) => ({
      id: list.id,
      list_name: list.list_name,
      jobs: list.jobs,
    }));
    return NextResponse.json(responseDTO, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
//Create a new list - POST api/lists (w/ JSON payload)
export async function POST(request: NextRequest) {
  try {
    //take the POST body
    const upload = await request.json();
    //require an upload body
    if (!upload || typeof upload !== "object") {
      return handleError(new BadRequestError("A list is required"));
    }

    const userId = (await getUserByUuid(upload.userId)).id;
    const list: List = {
      id: 0,
      list_name: upload.list_name,
      user_id: userId,
    };
    //validate the list data and throw an error if the data is invalid
    if (await validateList(list)) {
      //create the list here
      const newList = await upsertList(list);

      const responseDTO: listDTO = {
        id: newList.id,
        list_name: newList.list_name,
        jobs: newList.jobs,
      };
      return NextResponse.json(responseDTO, {
        status: 200,
        statusText: "List created successfully",
      });
    } else {
      throw new ValidationError("Invalid List Data");
    }
  } catch (error) {
    return handleError(error);
  }
}
//update list - PUT api/lists/<listId> (w/ JSON payload)
export async function PUT(request: NextRequest) {
  try {
    //take the POST body
    const upload = await request.json();
    //require an upload body
    if (!upload || typeof upload !== "object") {
      throw new BadRequestError("A list is required");
    }
    //validate the list data and throw an error if the data is invalid
    const list: List = {
      id: upload.id,
      list_name: upload.list_name,
    };
    if (await validateList(list)) {
      //create the list here
      const newList = await upsertList(list);
      const responseDTO: listDTO = {
        id: newList.id,
        list_name: newList.list_name,
      };
      return NextResponse.json(responseDTO, {
        status: 200,
        statusText: "List Updated Successfully",
      });
    } else {
      throw new ValidationError("Invalid List Data");
    }
  } catch (error) {
    return handleError(error);
  }
}
//delete list - DELETE api/lists/<listId>
export async function DELETE(request: NextRequest) {
  try {
    const data = (await request.json()) as { listId: number; uuid: string };
    const listId = data.listId;
    const uuid = data.uuid;
    if (!isNaN(listId)) {
      const user = await getUserByUuid(uuid);
      const list = await getListById(listId);
      if (user.id === list.user_id) {
        await deleteList(listId);

        const responseDTO: listDTO = {
          id: list.id,
          list_name: list.list_name,
          jobs: list.jobs,
        };
        return NextResponse.json(responseDTO, {
          status: 200,
          statusText: "List Deleted Successfully",
        });
      } else {
        throw new BadRequestError();
      }
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    return handleError(error);
  }
}
/*
    Get all lists (we can get user from auth token header)
    - GET api/lists

    Add job to the list
    - POST api/lists/<listid>/jobs  (w/ JSON payload)

    Update job in the list
    - PUT api/lists/<listid>/jobs/<jobid> (w/ JSON payload)

    Delete job from the list
    - DELETE api/lists/<listid>/jobs/<jobid>

    get jobs from list
    - GET /api/jobs?listId=<listId>
    - GET /api/lists/<listId>
*/
