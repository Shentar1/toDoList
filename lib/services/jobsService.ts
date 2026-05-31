import prisma from '@/lib/prisma';
import {Job} from './jobsModels';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { List } from './listsModels';


export async function getJobsByListId(userid: number, listId: number):Promise<Job[]>{
    if(!listId || isNaN(listId)){
        throw new Error('List ID is required');
    }
    try {
        const jobs = await prisma.jobs.findMany({
            where: {
                id: listId
            }
        });
        if(jobs.length === 0){
            throw new NotFoundError("No jobs found for this list");
        }
        return jobs.map(job => ({
            id: job.id,
            job_description: job.job_description ?? "",
            status: job.status ?? ""
        }));
    }catch (error) {
        throw error;
    }
}