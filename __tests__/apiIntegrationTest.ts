import { jobDTO } from "@/lib/services/jobsModels";
import { listDTO } from "@/lib/services/listsModels";
import { userDTO } from "@/lib/services/usersModels";

const API_BASE = process.env.API_BASE_URL ?? "http://127.0.0.1:3000";
const username = "admin";
const password = "admin";
const listName = "list1";
const jobName = "job1";

async function request(path: string, init: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  return fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
}

async function createUserTest(username: string, password: string) {
  const response = await request("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body as userDTO;
}

async function createListTest(userId: string) {
  const response = await request(`/api/lists?userId=${userId}`, {
    method: "POST",
    body: JSON.stringify({
      id: 0,
      list_name: listName,
      user_id: userId,
    } as listDTO),
  });
  const body = await response.json();
  expect(response.ok).toBe(true);
  return body;
}

async function createJobTest(listId: number) {
  const response = await request(`/api/jobs?listId=${listId}`, {
    method: "POST",
    body: JSON.stringify({
      job_description: jobName,
      status: "Pending",
      list_id: listId,
    } as jobDTO),
  });
  expect(response.ok).toBe(true);
  return response.json() as Promise<jobDTO>;
}

async function loginTest(username: string, password: string) {
  const response = await request("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function getListsTest(userId: string) {
  const response = await request(`/api/lists?userId=${userId}`);
  expect(response.ok).toBe(true);
  return response.json() as Promise<listDTO[]>;
}

async function getJobsTest(list: listDTO) {
  const response = await request(`/api/jobs?listId=${list.id}`);
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function getJobTest(jobId: number) {
  const response = await request(`/api/jobs?jobId=${jobId}`);
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function updateUserTest(
  uuid: string,
  newUsername?: string,
  newPassword?: string,
) {
  const response = await request("/api/users", {
    method: "PUT",
    body: JSON.stringify({
      newUsername,
      newPassword,
      uuid,
    }),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function updateListTest(listId: number, listName: string) {
  const response = await request(`/api/lists?listId=${listId}`, {
    method: "PUT",
    body: JSON.stringify({ id: listId, list_name: listName }),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function updateJobTest(
  jobId: number,
  listId: number,
  jobDescription?: string,
  status?: string,
) {
  const response = await request(`/api/jobs?jobId=${jobId}`, {
    method: "PUT",
    body: JSON.stringify({
      id: jobId,
      list_id: listId,
      job_description: jobDescription,
      status,
    }),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function deleteUserTest(uuid: string) {
  const response = await request("/api/users", {
    method: "DELETE",
    headers: {
      userId: uuid,
    },
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function deleteListTest(listId: number) {
  const response = await request(`/api/lists?listId=${listId}`, {
    method: "DELETE",
    body: JSON.stringify(listId),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

async function deleteJobTest(jobId: number) {
  const response = await request(`/api/jobs?jobId=${jobId}`, {
    method: "DELETE",
    body: JSON.stringify(jobId),
  });
  expect(response.ok).toBe(true);
  const body = await response.json();
  return body;
}

describe("API integration test", () => {
  test("should exercise the full user/list/job flow", async () => {
    const newUser = await createUserTest(username, password);
    expect(newUser.uuid).toBeTruthy();

    const loginResult = await loginTest(username, password);
    expect(loginResult.uuid).toEqual(newUser.uuid);

    const list = await createListTest(newUser.uuid);
    expect(list).toBeTruthy();

    const newJob = await createJobTest(list.id);
    expect(newJob).toBeTruthy();

    const updatedUser = await updateUserTest(newUser.uuid, "admin2", "admin2");
    expect(updatedUser).toBeTruthy();

    const updatedList = await updateListTest(list.id, "list12");
    expect(updatedList.list_name).toEqual("list12");

    const updatedJob = await updateJobTest(
      newJob.id,
      newJob.list_id,
      "bugfix",
      "pending",
    );
    expect(updatedJob.job_description).toEqual("bugfix");

    const lists = await getListsTest(newUser.uuid);
    expect(Array.isArray(lists)).toBe(true);

    const fetchedJob = await getJobTest(newJob.id);
    expect(fetchedJob.id).toEqual(newJob.id);

    await deleteJobTest(fetchedJob.id);
    await deleteListTest(list.id);
    await deleteUserTest(newUser.uuid);
  }, 30000);
});
