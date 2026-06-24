const username = `Alice`;
const password = `alice@example.com`;
const loginURL = "/api/login";
async function loginTest(username, password) {
  const userResponse = await fetch(loginURL, {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
  });
  const userId = await userResponse.json();
  return userId;
}

async function getListsTest(userId) {
  const listUrl = `/api/lists?userId=${userId}`;
  const listsResponse = await fetch(listUrl);
  const lists = await listsResponse.json();
  return lists;
}
async function getJobsTest(list) {
  let jobs = [];
  for (let j = 0; j < list.jobs.length; j++) {
    const jobsUrl = `/api/jobs?jobId=${list.jobs[j].id}`;
    const jobResponse = await fetch(jobsUrl);
    const job = await jobResponse.json();
    jobs.push(job);
  }
  return jobs;
}
async function runTests() {
  let userId = await loginTest(username, password);
  console.log(userId);
  let lists = await getListsTest(userId);
  console.log(lists);
  for (let i = 0; i < lists.length; i++) {
    let jobs = await getJobsTest(lists[i]);
    console.log(jobs);
  }
}
runTests();
