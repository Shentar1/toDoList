import '@testing-library/jest-dom'
import * as userService from "../lib/services/usersService"
import { User } from "../lib/services/usersModels"
import prisma from '../lib/prisma';
import { DatabaseError, ValidationError} from '../lib/errors/errors';
import { NextRequest } from 'next/server';

jest.mock('../lib/prisma',() => ({
    users:{
        findMany:jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}));
const mockUser = {
    id:1,
    username:"abc",
    password:"def",
    role:"user",
    time_created:new Date(Date.now()),
} as User;
