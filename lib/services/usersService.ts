import { BadRequestError, ValidationError } from "../errors/errors";
import prisma from "../prisma";
import { NextRequest } from "next/server";
import { User, userDTO } from "./usersModels";
import { Role } from "@/app/generated/prisma/enums";

export async function parseUserUuid(request: NextRequest): Promise<string> {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (userId && userId.length === 36) {
    return userId;
  } else {
    throw new BadRequestError("User Id is Invalid");
  }
}

export async function getUserByUuid(uuid: string): Promise<User> {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        uuid: uuid,
      },
      include: {
        lists: {
          include: {
            jobs: true,
          },
        },
      },
    });
    if (
      user.role !== "Admin" &&
      user.role !== "User" &&
      user.role !== "Owner"
    ) {
      throw new Error("Corrupted Data - Contact Customer Service");
    }
    return {
      ...user,
      role: user.role as Role,
    };
  } catch (error) {
    throw error;
  }
}
export async function getUserByUsernameAndPassword(
  username: string,
  password: string,
): Promise<User> {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        username: username,
        password: password,
      },
    });
    if (
      user.role !== "Admin" &&
      user.role !== "Owner" &&
      user.role !== "User"
    ) {
      throw new Error("Corrupted data - Contact Customer Support");
    }
    return {
      ...user,
      role: user.role as Role,
    };
  } catch (error) {
    throw error;
  }
}
export async function createOrUpdateUser(
  user: User,
  uuid?: string,
): Promise<User> {
  try {
    const newUser = await prisma.users.upsert({
      where: uuid ? { uuid: uuid } : { username: user.username },
      update: {
        username: user.username,
        password: user.password,
      },
      create: {
        username: user.username,
        password: user.password,
        time_created: new Date(Date.now()),
        role: Role.User,
      },
    });
    return {
      ...newUser,
      role: user.role as Role,
    };
  } catch (error) {
    throw error;
  }
}
export async function validateUser(
  username: string,
  password: string,
  createRequest = true,
): Promise<boolean> {
  if (createRequest) {
    let existingUser = await prisma.users.count({
      where: {
        username: username,
      },
    });
    if (existingUser !== 0) {
      throw new ValidationError("User already Exists");
    }
  }
  const validUsername =
    username.trim().length > 4 && typeof username === "string";

  const validPassword =
    password.trim().length > 4 && typeof password === "string";

  return validPassword && validUsername;
}
export async function deleteUserByUuid(uuid: string): Promise<User> {
  try {
    const user = await prisma.users.delete({
      where: {
        uuid: uuid,
      },
    });
    return {
      ...user,
      role: user.role as Role,
    };
  } catch (error) {
    throw error;
  }
}
