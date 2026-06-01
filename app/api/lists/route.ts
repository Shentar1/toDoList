import { BadRequestError } from '@/lib/errors/errors';
import { handleError } from '@/lib/errors/handleError';
import { getListsByUser, validateList, createList, updateList } from '@/lib/services/listsService';
import { NextRequest, NextResponse } from 'next/server';
import { parseUserId } from '@/lib/services/usersSerivce';

// Get all lists - GET api/lists?userid=<userid>
export async function GET(request: NextRequest) {
    try {
        const userId = await parseUserId(request)

        const lists = await getListsByUser(userId);

        return NextResponse.json(lists, {status: 200})
    }
    catch(error){
        return handleError(error);
    }
}
//Create a new list - POST api/lists (w/ JSON payload)
export async function POST(request: NextRequest) {
    try {
        const userId = await parseUserId(request)
        //take the POST body
        const upload = await request.json();
        //require an upload body
        if(!upload||typeof upload !== 'object'){
            throw new BadRequestError("A list is required")
        }
        //validate the list data and throw an error if the data is invalid
        if(await validateList(upload)){
            //create the list here
            createList(upload, userId);
        }else{
            throw new BadRequestError("Malformed or Invalid Data");
        }
    }
    catch(error){
        handleError(error);
    }
}
//update list - PUT api/lists/<listId> (w/ JSON payload)
export async function PUT(request: NextRequest) {
    try {
        const userId = await parseUserId(request)
        //take the POST body
        const upload = await request.json();
        //require an upload body
        if(!upload||typeof upload !== 'object'){
            throw new BadRequestError("A list is required")
        }
        //validate the list data and throw an error if the data is invalid
        if(await validateList(upload)){
            //create the list here
            updateList(upload, userId);
        }else{
            throw new BadRequestError("Malformed or Invalid Data");
        }
    }
    catch(error){
        handleError(error);
    }
}
//delete list - DELETE api/lists/<listId>
export async function DELETE(request: NextRequest) {
    try {
        
    }
    catch(error){
        return handleError(error);
    }
}
/*
    Get all lists (we can get user from auth token header)
    - GET api/lists

    Add job to the list
    - POST api/lists/<listid>/jobs  (w/ JSON payload)

    Update job in the list
    - PUT api/lists/<listid>/jobs/<jobid> (w/ JSON payload)

    Delete job from the list
    - DELETE api/lists/<listid>/jobs/<jobid>

    get jobs from list
    - GET /api/jobs?listId=<listId>
    - GET /api/lists/<listId>
*/ 