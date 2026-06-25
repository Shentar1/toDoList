import { NextRequest } from "next/server";
import {
  getUserByUsernameAndPassword,
  getUserByUuid,
} from "@/lib/services/usersService";
import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors/handleError";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionData } from "@/lib/services/sessionModels";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const username = data.username;
    const password = data.password;
    const userId = await getUserByUsernameAndPassword(username, password);
    return NextResponse.json(userId, {
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}
