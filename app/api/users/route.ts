import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors/handleError";
import { User } from "@/lib/services/usersModels";
import {
  validateUser,
  createOrUpdateUser,
  deleteUserByUuid,
  getUserByUsernameAndPassword,
  getUserByUuid,
} from "@/lib/services/usersService";
import { BadRequestError, ValidationError } from "@/lib/errors/errors";
export async function POST(request: NextRequest) {
  try {
    const upload = await request.json();
    if (!upload || typeof upload !== "object") {
      throw new BadRequestError("A User is required");
    }
    if (!upload.password || !upload.username) {
      throw new BadRequestError("A User is required");
    }
    if (await validateUser(upload.username, upload.password)) {
      const user = await createOrUpdateUser(upload);

      return NextResponse.json(
        { user },
        { status: 200, statusText: "User created successfully" },
      );
    } else {
      throw new Error();
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const upload = await request.json();
    if (!upload || typeof upload !== "object") {
      throw new BadRequestError("A User is required");
    }
    if (!upload.newUsername && !upload.newPassword) {
      throw new BadRequestError("A profile edit is required");
    }
    let uuid = upload.uuid;
    let userData = await getUserByUuid(uuid);
    let newUsername = upload.newUsername
      ? upload.newUsername
      : userData.username;
    let newPassword = upload.newPassword
      ? upload.newPassword
      : userData.password;
    if (await validateUser(newUsername, newPassword, false)) {
      userData.username = newUsername;
      userData.password = newPassword;
      const user = await createOrUpdateUser(userData, uuid);
      return NextResponse.json(
        { user },
        { status: 200, statusText: "User updated successfully" },
      );
    } else {
      throw new ValidationError("Invalid Username or Password");
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await request.headers.get("userId");
    if (userId) {
      const user = await deleteUserByUuid(userId);
      return NextResponse.json(
        { user },
        {
          status: 200,
          statusText: "user deleted successfully",
        },
      );
    } else {
      return NextResponse.json({
        status: 400,
        statusText: "No user to delete",
      });
    }
  } catch (error) {
    return handleError(error);
  }
}
