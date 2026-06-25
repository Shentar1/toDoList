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
const listsURL = `/api/lists?userId=`;
const listURL = `/api/lists?listId=`;
const jobURL = `api/jobs?jobId=`;
const jobsURL = `/api/jobs?listId=`;

async function createUserTest(username: string, password: string) {
  const response = await fetch(userURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return (await response.json()) as userDTO;
}
async function createListTest(userId: string) {
  const response = await fetch(listsURL + userId, {
    method: "POST",
    body: JSON.stringify({
      id: 0,
      list_name: listName,
      userId: userId,
    } as listDTO),
  });
  return (await response.json()) as listDTO;
}
async function createJobTest(listId: number) {
  const response = await fetch(jobURL + listId, {
    method: "POST",
    body: JSON.stringify({
      job_description: jobName,
      status: "Pending",
      list_id: listId,
    } as jobDTO),
  });
  return (await response.json()) as jobDTO;
}
async function loginTest(username: string, password: string) {
  const response = await fetch(loginURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  return (await response.json()) as userDTO;
}
async function getListsTest(userId: string) {
  const response = await fetch(listsURL + userId);
  return (await response.json()) as listDTO[];
}
async function getJobsTest(list: listDTO) {
  if (list.jobs) {
    const response = await fetch(jobsURL + list.id);
    return await response.json();
  }
}
async function getJobTest(jobId: number) {
  const response = await fetch(jobURL + jobId);
  return await response.json();
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

async function updateListTest(listId: number, listName: string) {
  const response = await fetch(listURL + listId, {
    method: "PUT",
    body: JSON.stringify({ id: listId, list_name: listName }),
  });
  return (await response.json()) as listDTO;
}
async function updateJobTest(
  jobId: number,
  listId: number,
  jobDescription?: string,
  status?: string,
) {
  const response = await fetch(jobURL + jobId, {
    method: "PUT",
    body: JSON.stringify({
      id: jobId,
      list_id: listId,
      job_description: jobDescription,
      status: status,
    }),
  });
  return (await response.json()) as jobDTO;
}
async function deleteUserTest(uuid: string) {
  const response = await fetch(userURL, {
    method: "DELETE",
    headers: {
      userId: uuid,
    },
  });
  return await response.json();
}
async function deleteListTest(listId: number) {
  const response = await fetch(listURL, {
    method: "DELETE",
    body: JSON.stringify(listId),
  });
  return (await response.json()) as listDTO;
}
async function deleteJobTest(jobId: number) {
  const response = await fetch(jobURL, {
    method: "DELETE",
    body: JSON.stringify(jobId),
  });
  return (await response.json()) as jobDTO;
}
export default function runTests() {
  useEffect(() => {
    async function run() {
      const user = await createUserTest(username, password);
      console.log(user);
      const userId = (await loginTest(username, password)).uuid;
      console.log(userId);
      const list = await createListTest(userId);
      console.log(list);
      const newJob = await createJobTest(list.id);
      console.log(newJob);
      let updatedUser = await updateUserTest(userId, "admin2", "admin2");
      console.log(updatedUser);
      updatedUser = await updateUserTest(userId, "admin3");
      console.log(updatedUser);
      updatedUser = await updateUserTest(userId, undefined, "admin3");
      console.log(updatedUser);
      let updatedList = await updateListTest(list.id, "list12");
      console.log(updatedList);
      let updatedJob = await updateJobTest(
        newJob.id,
        newJob.list_id,
        "bugfix",
        "pending",
      );
      console.log(updatedJob);
      const lists = await getListsTest(userId);
      console.log(lists);
      for (var i: number = 0; i < lists.length; i++) {
        const jobs = await getJobsTest(lists[i]);
        console.log(jobs);
      }
      const job = await getJobTest(newJob.id);
      console.log(job);
      console.log(await deleteJobTest(job.id));
      console.log(await deleteListTest(list.id));
      console.log(await deleteUserTest(userId));
    }
    run();
  });
  return null;
}
