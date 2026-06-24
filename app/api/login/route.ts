import { NextRequest } from "next/server";
import { getUserByUsernameAndPassword } from "@/lib/services/usersService";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const username = data.username;
    const password = data.password;
    const userId = await getUserByUsernameAndPassword(username, password);
    return NextResponse.json(userId);
  } catch (error) {
    throw error;
  }
}
