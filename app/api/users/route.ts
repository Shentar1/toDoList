import { User } from '@/lib/services/usersModels';
import {NextRequest, NextResponse} from 'next/server';
import { handleError } from '@/lib/errors/handleError';
import { /*parseUserId, getUserById,*/ validateUser, createUser } from '@/lib/services/usersService';
import { BadRequestError } from '@/lib/errors/errors';

/*export async function GET(request:NextRequest){
    try{
        const userId = await parseUserId(request);
        const user = getUserById(userId);
    }catch(error){
        handleError(error);
    }
}*/

export async function POST(request:NextRequest){
    try{
        const upload = await request.json();
        if(!upload || typeof upload !== 'object'){
            throw new BadRequestError("A User is required")
        }
        if(await validateUser(upload)){
            createUser(upload)

            return NextResponse.json(
                {upload},
                {status:201, statusText:"User created successfully"}
            )
        }
    }catch(error){
        handleError(error);
    }
}

export async function PUT(request:NextRequest){
    try{
        
    }catch(error){
        handleError(error);
    }
}

export async function DELETE(request:NextRequest){
    try{
        
    }catch(error){
        handleError(error);
    }
}