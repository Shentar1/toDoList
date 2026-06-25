"use client";

import { Job } from "@/lib/services/jobsModels";
import { List } from "@/lib/services/listsModels";
import { User } from "@/lib/services/usersModels";
import { create } from "domain";
import { useEffect } from "react";

const username = `admin`;
const password = `admin`;
const loginURL = `http://localhost:3000/api/login`;
const userURL = `http://localhost:3000/api/users`;

async function createUserTest(username: string, password: string) {
  const response = await fetch(userURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return await response.json();
}
async function loginTest(username: string, password: string) {
  const response = await fetch(loginURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return await response.json();
}
async function getListsTest(userId: string) {
  const listUrl = `/api/lists?userId=${userId}`;
  const response = await fetch(listUrl);
  return await response.json();
}
async function getJobsTest(list: List) {
  let jobs = [] as Job[];
  if (list.jobs) {
    for (let j = 0; j < list.jobs.length; j++) {
      const jobsUrl = `/api/jobs?jobId=${list.jobs[j].id}`;
      const response = await fetch(jobsUrl);
      const job = await response.json();
      console.log(job);
    }
    jobs = list.jobs;
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
  return response.json();
}
async function deleteUserTest(uuid: string) {
  const response = await fetch(userURL, {
    method: "DELETE",
    headers: {
      userId: uuid,
    },
  });
  return response.json();
}

export default function runTests() {
  useEffect(() => {
    async function run() {
      const user = await createUserTest(username, password);
      console.log(user);
      const userId = await loginTest(username, password);
      console.log(userId);
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
      const deleteUserResponse = await deleteUserTest(userId);
      console.log(deleteUserResponse.statusText);
    }
    run();
  });
  return null;
}
