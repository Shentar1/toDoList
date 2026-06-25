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
import { userDTO } from "@/lib/services/usersModels";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idParam = searchParams.get("jobId");
    const id = idParam ? parseInt(idParam) : NaN;

    if (!isNaN(id)) {
      const jobs = await getJobsByListId(id);
      const responseDTO: jobDTO[] = jobs.map((j) => ({
        job_description: j.job_description,
        status: j.status,
        time_created: j.time_created,
      }));
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
    const searchParams = request.nextUrl.searchParams;
    const idParam = searchParams.get("jobId");
    const id = idParam ? parseInt(idParam) : NaN;
    if (!isNaN(id)) {
      const newJob = await deleteJobById(id);
      const responseDTO: jobDTO = {
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
