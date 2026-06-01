import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {PrismaClient} from '../app/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({connectionString});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({adapter});
const client = prisma as any;

async function main() {
    const users = [
        { username: 'Alice', password: 'alice@example.com', role: 'user' },
        { username: 'Bob', password: 'bob@example.com', role: 'user' },
        { username: 'Carol', password: 'carol@example.com', role: 'user' },
        { username: 'Dave', password: 'dave@example.com', role: 'user' },
        { username: 'Eve', password: 'eve@example.com', role: 'user' },
        { username: 'Frank', password: 'frank@example.com', role: 'user' },
        { username: 'Grace', password: 'grace@example.com', role: 'user' },
        { username: 'Heidi', password: 'heidi@example.com', role: 'user' },
        { username: 'Ivan', password: 'ivan@example.com', role: 'user' },
        { username: 'Judy', password: 'judy@example.com', role: 'user' },
    ];

    const userRecords = await prisma.users.createMany({
        data:users
    });
    const lists = [
        { list_name: "list1", user_id: 1 },
        { list_name: "list2", user_id: 6 },
        { list_name: "list3", user_id: 7 },
        { list_name: "list4", user_id: 8 },
        { list_name: "list5", user_id: 1 },
        { list_name: "list6", user_id: 8 },
        { list_name: "list7", user_id: 6 },
        { list_name: "list8", user_id: 8 },
        { list_name: "list9", user_id: 2 },
        { list_name: "list10", user_id: 4 }
    ]
    const listRecords = await prisma.lists.createMany({
        data: lists,
    })
    const jobs = [
        {job_description:"Build deck", status:"in progress", list_id:3},
        {job_description:"Write report", status:"pending", list_id:1},
        {job_description:"Fix bug", status:"in progress", list_id:5},
        {job_description:"Review code", status:"completed", list_id:2},
        {job_description:"Update docs", status:"pending", list_id:8},
        {job_description:"Deploy app", status:"in progress", list_id:4},
        {job_description:"Test features", status:"pending", list_id:9},
        {job_description:"Refactor utils", status:"in progress", list_id:6},
        {job_description:"Setup CI/CD", status:"pending", list_id:7},
        {job_description:"Optimize database", status:"completed", list_id:9}
    ]

    const jobRecords = await prisma.jobs.createMany({
        data: jobs
    })
  console.log('Seed complete.');
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });