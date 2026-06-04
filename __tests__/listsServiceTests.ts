import '@testing-library/jest-dom'
import * as listsService from '../lib/services/listsService';
import {List} from '../lib/services/listsModels';
import prisma from '../lib/prisma';
import { DatabaseError, ValidationError} from '../lib/errors/errors';
jest.mock('../lib/prisma',() => ({
    users:{
        findMany:jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    lists: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
    jobs:{
        findMany: jest.fn(),
        create:jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}));

describe('validateListItem',()=>{
    it('should return true for valid list list_name and id',async ()=>{
        const list = {
            id: 0,
            user_id:1,
            list_name: 'My List',
            jobs: []
        }
        expect(await listsService.validateList(list)).toBe(true);
    });
    it('should return true for valid list with jobs',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: 'pending',
                    list_id:0
                }
            ]
        }
        expect(await listsService.validateList(list)).toBe(true);
    });
    it('should throw an error for a non-numeric user id',async ()=>{
        const list = {
            id: undefined as unknown as number,
            list_name: 'My List',
            user_id:1,
            jobs: []
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for non-numeric list id',async ()=>{
        const list = {
            id: 'abc' as unknown as number, 
            list_name: 'My List',
            user_id:1,
            jobs: []
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for empty list list_name',async ()=>{
        const list = {
            id: 0,
            list_name: '   ',
            user_id:1,
            jobs: []
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for undefined list list_name',async ()=>{
        const list = {
            id: 0,
            list_name: undefined as unknown as string,
            user_id:1,
            jobs: []
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for non-string list list_name', async ()=>{
        const list = {
            id: 0,
            list_name: 123 as unknown as string,
            user_id:1,
            jobs: []
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    
    it('should throw an error for job with empty description',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: '   ',
                    status: 'pending',
                    list_id:0,
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with undefined description',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: undefined as unknown as string,
                    status: 'pending',
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with non-string description',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: 123 as unknown as string,
                    status: 'pending',
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with empty status',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: '   ',
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with undefined status',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: undefined as unknown as string,
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with non-string status',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: 123 as unknown as string,
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with invalid id',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: 'abc' as unknown as number,
                    job_description: 'My Job',
                    status: 'pending',
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
    it('should throw an error for job with undefined id',async ()=>{
        const list = {
            id: 0,
            list_name: 'My List',
            user_id:1,
            jobs: [
                {
                    id: undefined as unknown as number,
                    job_description: 'My Job',
                    status: 'pending',
                    list_id:0
                }
            ]
        }
        await expect(listsService.validateList(list)).rejects.toThrow(ValidationError);
    });
});

describe('getListsByUser',()=>{
    it('should return an array of lists for a valid user id',async ()=>{
        const testList = [
            {
                id: 1,  
                list_name: 'My List 1',
                user_id: 1,
                jobs: [
                    {
                        id: 1,
                        job_description: 'My Job 1',
                        status: 'pending',
                        list_id:1
                    }
                ]   
            },
            {
                id: 2,
                list_name: 'My List 2',
                user_id: 1,
                jobs: []
            }
        ];
        (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce(testList);
        const list = await listsService.getListsByUser(1);
        expect(list).toEqual(testList);
    });
    it('should return an empty array if no lists are found for the user',async ()=>{
        (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce([]);
        
        const lists = await listsService.getListsByUser(0);
        expect(lists).toEqual([]);
    });
    it('should throw an error for an invalid user id',async ()=>{
        await expect(listsService.getListsByUser(undefined as unknown as number)).rejects.toThrow('User id is required');
    });
    it('should throw an error for a non-numeric user id',async ()=>{
        await expect(listsService.getListsByUser('abc' as unknown as number)).rejects.toThrow('User id is required');
    });
});

describe('createList',()=>{
    it('should return true if the data is valid and prisma creates the row in the database',async ()=>{
        const result = await listsService.createList({list_name: 'My List', id: 1, jobs:[{id:1, job_description:'todo'}]} as List, 1 );
        expect(result).toBe(true);
    });
    it('should throw a database error if prisma returns an error',async ()=>{
        (prisma.lists.create as jest.Mock).mockImplementationOnce(()=>{
            throw new Error();
        })
        await expect(listsService.createList({list_name: 'My List', id: 1, jobs:[{id:1, job_description:'todo'}]} as List, 1 )).rejects.toThrow(DatabaseError);
    });
})

describe('updateList',()=>{
    it('should return true if the data is valid and prisma updates the row in the database',async ()=>{
        const result = await listsService.updateList({list_name: 'My List', id: 1, jobs:[{id:1, job_description:'todo'}]} as List, 1 );
        expect(result).toBe(true);
    });
    it('should throw a database error if prisma returns an error',async ()=>{
        (prisma.lists.update as jest.Mock).mockImplementationOnce(()=>{
            throw new Error();
        })
        await expect(listsService.updateList({list_name: 'My List', id: 1, jobs:[{id:1, job_description:'todo'}]} as List, 1 )).rejects.toThrow(DatabaseError);
    });
})

describe('deleteList',()=>{
    it('should return true if prisma deletes the row in the database',async ()=>{
        const result = await listsService.deleteList(1);
        expect(result).toBe(true);
    });
    it('should throw a database error if prisma returns an error',async ()=>{
        (prisma.lists.delete as jest.Mock).mockImplementationOnce(()=>{
            throw new Error();
        })
        await expect(listsService.deleteList(1)).rejects.toThrow(DatabaseError);
    });
})