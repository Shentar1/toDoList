import '@testing-library/jest-dom'
import {getListsByUser, validateList} from '../lib/services/listsService';
import prisma from '../lib/prisma';
jest.mock('../lib/prisma',() => ({
    lists: {
        findMany: jest.fn()
    }
}));
describe('validateListItem',()=>{
    it('should return true for valid list name and id',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: []
        }
        expect(await validateList(list)).toBe(true);
    });
    it('should return true for valid list with jobs',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(true);
    });
    it('should return false for invalid list id',async ()=>{
        const list = {
            id: undefined as unknown as number,
            name: 'My List',
            jobs: []
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for non-numeric list id',async ()=>{
        const list = {
            id: 'abc' as unknown as number, 
            name: 'My List',
            jobs: []
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for empty list name',async ()=>{
        const list = {
            id: 0,
            name: '   ',
            jobs: []
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for undefined list name',async ()=>{
        const list = {
            id: 0,
            name: undefined as unknown as string,
            jobs: []
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for non-string list name', async ()=>{
        const list = {
            id: 0,
            name: 123 as unknown as string,
            jobs: []
        }
        expect(await validateList(list)).toBe(false);
    });
    
    it('should return false for job with empty description',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: '   ',
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with undefined description',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: undefined as unknown as string,
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with non-string description',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: 123 as unknown as string,
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with empty status',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: '   '
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with undefined status',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: undefined as unknown as string
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with non-string status',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 0,
                    job_description: 'My Job',
                    status: 123 as unknown as string
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with invalid id',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: 'abc' as unknown as number,
                    job_description: 'My Job',
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
    it('should return false for job with undefined id',async ()=>{
        const list = {
            id: 0,
            name: 'My List',
            jobs: [
                {
                    id: undefined as unknown as number,
                    job_description: 'My Job',
                    status: 'pending'
                }
            ]
        }
        expect(await validateList(list)).toBe(false);
    });
});

describe('getListsByUser',()=>{
    /*
        TODO: Since getListsByUser interacts with the database, we should mock the database calls to test the function in isolation.
        We can use a library like jest.mock to mock the prisma client and simulate different scenarios, such as returning a list of lists,
        returning an empty array, or throwing an error. This way we can ensure that our function behaves correctly under different conditions
        without relying on the actual database.
    */
    it('should return an array of lists for a valid user id',async ()=>{
        // This test would require mocking the database response to return a list of lists for the given user id
        // For example, we could mock the prisma.lists.findMany method to return a predefined array of lists
        // Then we would call getListsByUser with a valid user id and expect it to return the mocked array of lists
        (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce([
            {
                id: 1,  
                list_name: 'My List 1',
                user_id: 1,
                jobs: [
                    {
                        id: 1,
                        job_description: 'My Job 1',
                        status: 'pending'
                    }
                ]   
            },
            {
                id: 2,
                list_name: 'My List 2',
                user_id: 1,
                jobs: []
            }
        ]);
        const testlist = await getListsByUser(1);
        expect(testlist).toEqual([
            {
                id: 1,
                name: 'My List 1',
                jobs: [
                    {
                        id: 1,
                        job_description: 'My Job 1',
                        status: 'pending'
                    }
                ]
            },
            {
                id: 2,
                name: 'My List 2',
                jobs: []
            }
        ]);
    });
    it('should return an empty array if no lists are found for the user',async ()=>{
        // This test would require mocking the database response to return an empty array for the given user id
        // Then we would call getListsByUser with a valid user id and expect it to return an empty array
        (prisma.lists.findMany as jest.Mock).mockResolvedValueOnce([]);
        
        const lists = await getListsByUser(0);
        expect(lists).toEqual([]);
    });
    it('should throw an error for an invalid user id',async ()=>{
        await expect(getListsByUser(undefined as unknown as number)).rejects.toThrow('Userid is required');
    });
    it('should throw an error for a non-numeric user id',async ()=>{
        await expect(getListsByUser('abc' as unknown as number)).rejects.toThrow('Userid is required');
    });
});

describe('createList',()=>{
    /**
     * TODO: Similar to getListsByUser, we should mock the database calls in createList to test the function in isolation. 
     * We can simulate different scenarios, such as successful creation of a list, failure due to invalid data, or database errors. 
     * This way we can ensure that our function behaves correctly under different conditions without relying on the actual database.
     */
    
})