import { NextURL } from "next/dist/server/web/next-url";
import { BadRequestError, NotFoundError, ValidationError, DatabaseError } from "../errors/errors";
import prisma from "../prisma";
import { NextRequest } from "next/server";
import { List } from "./listsModels";
import { Users } from "./usersModels";

export async function getSingleUser(userId:number){
    
}
export async function parseUserId(request:NextRequest):Promise<number>{
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId') ?? '';
    const userId: number = parseInt(userIdParam);

    if(userId && !isNaN(userId)){
        return userId;
    }else{
        throw new BadRequestError("User Id is Invalid");
    }
}