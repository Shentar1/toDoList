import prisma from "@/lib/prisma";
import { Job } from "./jobsModels";
import { NotFoundError } from "../errors/errors";

export async function getJobsByListId(listId: number): Promise<Job[]> {
  if (!listId || isNaN(listId)) {
    throw new Error("List ID is required");
  }
  try {
    const jobs = await prisma.jobs.findMany({
      where: {
        id: listId,
      },
    });
    if (jobs.length === 0) {
      throw new NotFoundError("No jobs found for this list");
    }
    return jobs.map((job) => ({
      id: job.id,
      job_description: job.job_description ?? "",
      status: job.status ?? "",
      list_id: job.list_id,
      time_created: job.time_created,
    }));
  } catch (error) {
    throw error;
  }
}
/**
 *
 * @param job a potential job to be added of type Job
 * @returns true if the job is valid, false if it is invalid
 */
export async function validateJob(job: Job) {
  const id = job.id;
  const job_description = job.job_description;
  const status = job.status;

  const idValid = id && !isNaN(id);
  const job_descriptionValid =
    typeof job_description === "string" && job_description.trim().length;
  const statusValid = typeof status === "string" && status.trim().length > 0;

  return idValid && job_descriptionValid && statusValid;
}

export async function getJobById(id: number): Promise<Job> {
  try {
    const job = prisma.jobs.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
    return job;
  } catch (error) {
    throw error;
  }
}
export async function createOrUpdateJob(job: Job) {
  try {
    return await prisma.jobs.upsert({
      where: {
        id: job.id,
      },
      create: {
        job_description: job.job_description,
        list_id: job.list_id,
        status: job.status,
        time_created: new Date(Date.now()),
      },
      update: {
        job_description: job.job_description,
        list_id: job.list_id,
        status: job.status,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteJobById(id: number): Promise<Job> {
  const job = prisma.jobs.delete({
    where: {
      id: id,
    },
  });
  return job;
}
