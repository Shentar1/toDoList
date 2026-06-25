import { BadRequestError } from "@/lib/errors/errors";
import { handleError } from "@/lib/errors/handleError";
import { jobDTO } from "@/lib/services/jobsModels";
import {
  getJobById,
  getJobsByListId,
  validateJob,
  createOrUpdateJob,
  deleteJobById,
} from "@/lib/services/jobsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listIdParam = searchParams.get("listId");
    const jobIdParam = searchParams.get("jobId");
    const listId = listIdParam ? parseInt(listIdParam) : NaN;
    const jobId = jobIdParam ? parseInt(jobIdParam) : NaN;
    if (!isNaN(listId)) {
      const jobs = await getJobsByListId(listId);
      const responseDTO: jobDTO[] = jobs.map((j) => ({
        id: j.id,
        list_id: j.list_id,
        job_description: j.job_description,
        status: j.status,
        time_created: j.time_created,
      }));
      return NextResponse.json(responseDTO, { status: 200 });
    } else if (!isNaN(jobId)) {
      const job = await getJobById(jobId);
      const responseDTO: jobDTO = {
        id: job.id,
        list_id: job.list_id,
        job_description: job.job_description,
        status: job.status,
        time_created: job.time_created,
      };
      return NextResponse.json(responseDTO, { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const job = await request.json();
    if (await validateJob(job)) {
      const newJob = await createOrUpdateJob(job);
      const responseDTO: jobDTO = {
        id: newJob.id,
        list_id: newJob.list_id,
        job_description: newJob.job_description,
        status: newJob.status,
        time_created: newJob.time_created,
      };
      return NextResponse.json(responseDTO, { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const job = await request.json();
    if (await validateJob(job)) {
      const newJob = await createOrUpdateJob(job);
      const responseDTO: jobDTO = {
        id: newJob.id,
        list_id: newJob.list_id,
        job_description: newJob.job_description,
        status: newJob.status,
        time_created: newJob.time_created,
      };
      return NextResponse.json(responseDTO, { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = await request.json();
    if (!isNaN(id)) {
      const job = await deleteJobById(id);
      const responseDTO: jobDTO = {
        id: job.id,
        list_id: job.list_id,
        job_description: job.job_description,
        status: job.status,
        time_created: job.time_created,
      };
      return NextResponse.json(responseDTO, { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    return handleError(error);
  }
}
