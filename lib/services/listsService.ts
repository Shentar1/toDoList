import { BadRequestError } from "../errors/errors";
import prisma from "../prisma";
import { Job } from "./jobsModels";
import { List } from "./listsModels";

export async function getListsByUser(userid: number): Promise<List[]>{
    if(!userid || isNaN(userid)){
        throw new BadRequestError('Userid is required');
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

        return lists.map(list => ({
            id: list.id,
            name: list.list_name,
            jobs: list.jobs.map(j => ({
                id: j.id,
                job_description: j.job_description,
                status: j.status
            } as Job)),
        }));
    } catch (error) {
        switch(error){
            default:
                throw new Error('Failed to fetch jobs');
        }
    }
}