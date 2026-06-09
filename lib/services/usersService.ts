import { NextURL } from "next/dist/server/web/next-url";
import { BadRequestError, NotFoundError, ValidationError, DatabaseError, PrismaError } from "../errors/errors";
import prisma from "../prisma";
import { NextRequest } from "next/server";
import { List } from "./listsModels";
import { User } from "./usersModels";
import { Job } from "./jobsModels";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Prisma } from "@/app/generated/prisma/client";
import { Elsie_Swash_Caps } from "next/font/google";

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

/*export async function getUserById(userId:number):Promise<User>{
    const user = await prisma.users.findUniqueOrThrow({
        where:{
            id:userId,
        },
        include:{
            lists:{
                include:{
                    jobs:true,
                }
            },
        }
    });
    return user;
}*/
export async function getUserByUsernameAndPassword(username:string, password:string):Promise<User>{
    try{
        const user = await prisma.users.findUniqueOrThrow({
            where:{
                username:username,
                password:password,
            },
            include:{
                lists:{
                    include:{
                        jobs:true,
                    }
                },
            }
        });
        return user;
    }catch(error){
        throw error;
    }
}
export async function createOrUpdateUser(user:User):Promise<User>{
    try {
        const newUser = prisma.users.upsert({
            where:{
                username:user.username,
                password:user.password,
            },
            update:{
                username:user.username,
                password:user.password,
                role:user.role,
            },
            create:{
                username:user.username,
                password:user.password,
                time_created:user.time_created,
                role:user.role,
            }
        });
        return newUser;
    } catch (error) {
        throw error
    }
}
export async function validateUser(user:User):Promise<boolean>{
    const username = user.username;
    const password = user.password;
    const timeCreated = user.time_created;
    const role = user.role;

    const validUsername = username.trim().length > 4 && typeof username === 'string';
    const validPassword = password.trim().length > 8 && typeof password === 'string';
    const validTime = timeCreated instanceof Date && !isNaN(timeCreated.getTime());
    const validRole = role.trim().length > 0 && typeof role === 'string';

    return validPassword && validUsername && validTime && validRole;
}
export async function deleteUserById(id:number){
    prisma.users.delete({
        where:{
            id:id
        },
    })
}