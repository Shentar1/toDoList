"use client";

import { jobDTO } from "@/lib/services/jobsModels";
import { listDTO } from "@/lib/services/listsModels";
import { userDTO } from "@/lib/services/usersModels";
import { useEffect } from "react";

const username = `admin`;
const password = `admin`;
const listName = `list1`;
const jobName = `job1`;
const loginURL = `/api/login`;
const userURL = `/api/users`;
const listURL = `/api/lists?userId=`;

async function createUserTest(username: string, password: string) {
  const response = await fetch(userURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return (await response.json()) as userDTO;
}
async function createListTest(userId: string) {
  const response = await fetch(listURL + userId, {
    method: "POST",
    body: JSON.stringify({ listName: listName, userId: userId }),
  });
  return (await response.json()) as listDTO;
}
async function createJobTest() {}
async function loginTest(username: string, password: string) {
  const response = await fetch(loginURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return (await response.json()) as userDTO;
}
async function getListsTest(userId: string) {
  const listUrl = `/api/lists?userId=${userId}`;
  const response = await fetch(listUrl);
  return (await response.json()) as listDTO[];
}
async function getJobsTest(list: listDTO) {
  let jobs = [] as jobDTO[];
  if (list.jobs) {
    for (let j = 0; j < list.jobs.length; j++) {
      const jobsUrl = `/api/jobs?jobId=${list.jobs[j].id}`;
      const response = await fetch(jobsUrl);
      const job = await response.json();
    }
  }
  return jobs;
}
async function updateUserTest(
  uuid: string,
  newUsername?: string,
  newPassword?: string,
) {
  const response = await fetch(userURL, {
    method: "PUT",
    body: JSON.stringify({
      newUsername: newUsername,
      newPassword: newPassword,
      uuid: uuid,
    }),
  });
  return (await response.json()) as userDTO;
}

async function updateListTest() {}
async function updateJobTest() {}
async function deleteUserTest(uuid: string) {
  const response = await fetch(userURL, {
    method: "DELETE",
    headers: {
      userId: uuid,
    },
  });
  return await response.json();
}
async function deleteListTest() {}
async function deleteJobTest() {}
export default function runTests() {
  useEffect(() => {
    async function run() {
      const user = await createUserTest(username, password);
      console.log(user);
      const userId = (await loginTest(username, password)).uuid;
      console.log(userId);
      const list = await createListTest(userId);
      console.log(list);
      let updatedUser = await updateUserTest(userId, "admin2", "admin2");
      console.log(updatedUser);
      updatedUser = await updateUserTest(userId, "admin3");
      console.log(updatedUser);
      updatedUser = await updateUserTest(userId, undefined, "admin3");
      console.log(updatedUser);
      const lists = await getListsTest(userId);
      console.log(lists);
      for (var i: number = 0; i < lists.length; i++) {
        const jobs = await getJobsTest(lists[i]);
        console.log(jobs);
      }
      console.log(await deleteUserTest(userId));
    }
    run();
  });
  return null;
}
