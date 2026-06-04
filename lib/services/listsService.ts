import { BadRequestError, ValidationError, DatabaseError } from "../errors/errors";
import prisma from "../prisma";
import { Job } from "./jobsModels";
import { validateJob } from "./jobsService"
import { List } from "./listsModels";
import { NextRequest } from "next/server";

/**
 * 
 * @param request NextRequest object containing a list id
 * @returns an integer representing the list id
 */
export async function parseListId(request:NextRequest):Promise<number>{
    const searchParams = request.nextUrl.searchParams;
    const listIdParam = searchParams.get('listId') ?? '';
    const listId: number = parseInt(listIdParam);

    if(listId && !isNaN(listId)){
        return listId;
    }else{
        throw new BadRequestError("List Id is Invalid");
    }
}
/**
 * 
 * @param userid 
 * @returns Promise that resolves to an array of lists associated to a user id
 * @throws BadRequestError if there are issues with the user id
 */
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
/**
 * 
 * @param list a list object that is to be validated
 * @returns true if the list is valid
 * @throws if the list is invalid 
 */
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
            throw new ValidationError("Failed to validate list data");
        }
    }catch{
        //if any unexpected error occurs during validation, we will consider the data invalid
        //this error is specifically for catching errors in validation logic not due to invaid data
        throw new ValidationError("Failed to validate list data");
    }
}
/** 
* Attempts to create the list and its jobs in the database. If an error occurs, it catches the error and throws an error 
* indicating that the list was not created successfully.
* @param list a list object that has been validated
* @param userId a user id that has been validated and corresponds to the owner of the list object
* @returns a promise that resolves to true if the operation is successful
* @throws if the list is invalid 
*/
export async function createList(list: List, userId: number):Promise<boolean>{
    try{
        await prisma.lists.create({
            data: {
                list_name: list.list_name,
                user_id: userId,
                time_created:new Date(Date.now()).toUTCString(),
                jobs: {
                    createMany:{
                        data: list.jobs
                    }
                }
            }
        });
        return true;
    }catch{
        throw new DatabaseError("Database Error: Failed to create list");
    }
}
/** 
* Attempts to update a list item and its jobs in the database. If an error occurs, it catches the error and throws an error 
* indicating that the list was not created successfully.
* @param list a list object that has been validated
* @param userId a user id that has been validated and corresponds to the owner of the list object
* @returns a promise that resolves to true if the operation is successful
* @throws if the list is invalid 
*/
export async function updateList(list:List, userId: number):Promise<boolean>{
    //TODO: add validation that the list id to be updated belongs to the current user
    try{
        await prisma.lists.update({
            data:{
                list_name: list.list_name,
                user_id:userId,
                jobs:{
                    createMany:{
                        data: list.jobs
                    }
                }
            },
            where:{
                id:list.id
            }
        })
        return true;
    }catch{
        throw new DatabaseError("Database Error: Failed to update list");
    }
}
/** 
* Attempts to create the list and its jobs in the database. If an error occurs, it catches the error and throws an error 
* indicating that the list was not created successfully.
* @param listId a unique identifier for the list item to be deleted
* @returns a promise that resolves to true if the operation is successful
* @throws if the list is invalid 
*/
export async function deleteList(listId:number):Promise<boolean>{
    //TODO: add validation that the list id to be deleted belongs to the current user
    try{
        await prisma.lists.delete({
            where:{
                id:listId,
            }
        })
        return true;
    }catch{
        throw new DatabaseError("Database Error: Failed to delete list");
    }
}