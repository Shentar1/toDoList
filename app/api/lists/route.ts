import { BadRequestError } from '@/lib/errors/errors';
import { handleError } from '@/lib/errors/handleError';
import { getJobsByListId } from '@/lib/services/jobsService';
import { getListsByUser } from '@/lib/services/listsService';
import { NextRequest, NextResponse } from 'next/server';

// Get all lists - GET api/lists?userid=<userid>
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userIdParam = searchParams.get('userId') ?? ''; // e.g. `/api/search?query=hello`
        const userId: number = parseInt(userIdParam);

        if(!userIdParam || isNaN(userId)){
            throw new BadRequestError("userId is required")
        }

        const lists = await getListsByUser(userId);

        return NextResponse.json(lists, {status: 200})
    }
    catch(error){
        return handleError(error);
    }
}

/*
    Get all lists by user (both are acceptable)
    - GET api/users/<userid>/lists
    - GET api/lists?userid=<userid>

    Get all lists (we can get user from auth token header)
    - GET api/lists
    
    Create new list
    - POST api/lists (w/ JSON payload)

    Update list
    - PUT api/lists/<listId> (w/ JSON payload)

    Delete list
    - DELETE api/lists/<listId> (w/ JSON payload)

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