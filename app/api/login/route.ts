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
import { userDTO } from "@/lib/services/usersModels";
import { BadRequestError } from "@/lib/errors/errors";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const username = data.username;
    const password = data.password;
    const user = await getUserByUsernameAndPassword(username, password);
    const responseDTO: userDTO = {
      username: user.username,
      uuid: user.uuid,
      lists: user.lists,
      role: user.role,
      time_created: user.time_created,
    };

    const session = await getIronSession<sessionData>(await cookies(), {
      password: "yPNHviX2tjsMevyiorgELH6W5K9kMeJC",
      cookieName: "toDoListSession",
    });
    session.uuid = user.uuid;
    ((session.username = user.username),
      (session.password = user.password),
      (session.isLoggedIn = true));
    await session.save();

    return NextResponse.json(responseDTO, {
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<sessionData>(await cookies(), {
      password: "yPNHviX2tjsMevyiorgELH6W5K9kMeJC",
      cookieName: "toDoListSession",
    });
    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    throw new BadRequestError("Failed to retrieve session data");
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const session = await getIronSession<sessionData>(await cookies(), {
      password: "yPNHviX2tjsMevyiorgELH6W5K9kMeJC",
      cookieName: "toDoListSession",
    });
    session.destroy();
    return NextResponse.json(200);
  } catch (error) {
    throw new BadRequestError("Logout failed... Guess you're stuck here");
  }
}
