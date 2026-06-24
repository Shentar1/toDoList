import { BadRequestError, ValidationError } from "../errors/errors";
import prisma from "../prisma";
import { NextRequest } from "next/server";
import { User } from "./usersModels";

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
    return user;
  } catch (error) {
    throw error;
  }
}
export async function getUserByUsernameAndPassword(
  _username: string,
  _password: string,
): Promise<String> {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: {
        username: _username,
      },
      select: {
        uuid: true,
      },
    });
    const userUuid = user.uuid;
    return userUuid;
  } catch (error) {
    throw error;
  }
}
export async function createOrUpdateUser(user: User): Promise<User> {
  try {
    const newUser = prisma.users.upsert({
      where: {
        uuid: user.uuid,
      },
      update: {
        username: user.username,
        password: user.password,
        role: user.role,
      },
      create: {
        username: user.username,
        password: user.password,
        time_created: new Date(Date.now()),
        role: user.role,
      },
    });
    return newUser;
  } catch (error) {
    throw error;
  }
}
export async function validateUser(
  user: User,
  createRequest = true,
): Promise<boolean> {
  const username = user.username;
  const password = user.password;
  const timeCreated = user.time_created;
  const role = user.role;
  const validUsername =
    username.trim().length > 4 && typeof username === "string";
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
  const validPassword =
    password.trim().length > 8 && typeof password === "string";
  const validTime =
    timeCreated instanceof Date && !isNaN(timeCreated.getTime());
  const validRole = role.trim().length > 0 && typeof role === "string";

  return validPassword && validUsername && validTime && validRole;
}
export async function deleteUserByUuid(uuid: string): Promise<boolean> {
  try {
    const userId = (await getUserByUuid(uuid)).id;
    prisma.users.delete({
      where: {
        id: userId,
      },
    });
    return true;
  } catch (error) {
    throw error;
  }
}
