import { User } from "@/lib/services/usersModels";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors/handleError";
import {
  validateUser,
  createOrUpdateUser,
  deleteUserByUuid,
  getUserByUuid,
} from "@/lib/services/usersService";
import { BadRequestError } from "@/lib/errors/errors";

/*export async function GET(request:NextRequest){
    try{
        const userId = await parseUserId(request);
        const user = getUserById(userId);
    }catch(error){
        handleError(error);
    }
}*/

export async function POST(request: NextRequest) {
  try {
    const upload = await request.json();
    if (!upload || typeof upload !== "object") {
      throw new BadRequestError("A User is required");
    }
    if (await validateUser(upload)) {
      const user = createOrUpdateUser(upload);

      return NextResponse.json(
        { user },
        { status: 201, statusText: "User created successfully" },
      );
    }
  } catch (error) {
    handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const upload = await request.json();
    if (!upload || typeof upload !== "object") {
      throw new BadRequestError("A User is required");
    }
    if (await validateUser(upload)) {
      const user = createOrUpdateUser(upload);
      return NextResponse.json(
        { user },
        { status: 202, statusText: "User updated successfully" },
      );
    }
  } catch (error) {
    handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await request.headers.get("uuid");
    if (userId) {
      deleteUserByUuid(userId);
    }
    return NextResponse.json({
      status: 202,
      statusText: "user deleted successfully",
    });
  } catch (error) {
    handleError(error);
  }
}
