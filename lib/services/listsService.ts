import { BadRequestError, NotFoundError, ValidationError, DatabaseError } from "../errors/errors";
import { handleError } from "../errors/handleError";
import prisma from "../prisma";
import { Job } from "./jobsModels";
import { validateJob } from "./jobsService"
import { List } from "./listsModels";

export async function getListsByUser(userid: number): Promise<List[]>{
    if(userid !=0 && !userid || isNaN(userid)){
        throw new BadRequestError('User id is required');
    }
    try {
        const lists = await prisma.lists.findMany({
            where: {
                user_id: userid
            },
            include: {
                jobs: true
            }
        });
        if(lists.length === 0){
            return [];
        }
        return lists.map(list => ({
            id: list.id,
            list_name: list.list_name,
            user_id: list.user_id,
            jobs: list.jobs.map(j => ({
                id: j.id,
                job_description: j.job_description,
                status: j.status,
                list_id: j.list_id
            } as Job)),
        }));
    } catch (error) {
        throw error;
    }
}
export async function validateList(list:List): Promise<boolean>{
    try{
        let name = list.list_name;
        let jobs = list.jobs;
        let id = list.id;
        //id is not needed for creation, but useful for updates, so we will allow it to be 0 or a valid number, but not undefined or NaN
        let idValid = !isNaN(id) && (id === 0 || id);
        //name must be a string with a non-whitespace character
        let nameValid = typeof name === 'string' && name.trim().length > 0;
        //each job must have a non-empty description and status, and a valid id
        //not needed for new jobs, but useful for updates, so we will allow it to be 0 or a valid number, but not undefined or NaN
        let jobsValid = Array.isArray(jobs) && jobs.every( job => {
            return validateJob(job);
        });
        if(idValid && nameValid && jobsValid){
            return true;
        }else{
            return false;
        }
    }catch(error){
        //if any unexpected error occurs during validation, we will consider the data invalid
        //this error is specifically for catching errors in validation logic not due to invaid data
        throw new ValidationError("Failed to validate list data");
    }
}

export async function createList(list: List, userId: number):Promise<boolean>{
        //Attempts to create the list and its jobs in the database. If an error occurs, it catches the error and throws an error,
        //indicating that the list was not created successfully.
    try{
        const newList = await prisma.lists.create({
            data: {
                list_name: list.list_name,
                user_id: userId,
                jobs: {
                    createMany:{
                        data: list.jobs
                    }
                }
            }
        });
        return true;
    }catch(error){
        throw new DatabaseError("Database Error: Failed to create list");
    }
}