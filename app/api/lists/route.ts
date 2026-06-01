import { BadRequestError } from '@/lib/errors/errors';
import { handleError } from '@/lib/errors/handleError';
import { getJobsByListId } from '@/lib/services/jobsService';
import { List } from '@/lib/services/listsModels';
import { getListsByUser, validateList, createList } from '@/lib/services/listsService';
import { createValidationSampleTracking } from 'next/dist/server/app-render/instant-validation/instant-samples';
import { NextRequest, NextResponse } from 'next/server';

// Get all lists - GET api/lists?userid=<userid>
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userIdParam = searchParams.get('userId') ?? '';
        const userId: number = parseInt(userIdParam);

        if(!userIdParam || isNaN(userId)){
            throw new BadRequestError("user id is required")
        }

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
        //get the userId who the the list belongs to
        const searchParams = request.nextUrl.searchParams;
        const userIdParam = searchParams.get('userId') ?? '';
        const userId: number = parseInt(userIdParam);

        //throew a bad request error if the userid is not valid
        if(!userIdParam || isNaN(userId)){
            throw new BadRequestError("user id is required")
        }
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
        // Validate body here (e.g., check for required fields)
    }
    catch(error){
        handleError(error);
    }
}
//update list - PUT api/lists/<listId> (w/ JSON payload)
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        // Validate body here (e.g., check for required fields)
    }
    catch(error){
        return handleError(error);
    }
}
//delete list - DELETE api/lists/<listId>
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        // Validate body here (e.g., check for required fields)
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