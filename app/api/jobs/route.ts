import { BadRequestError } from "@/lib/errors/errors";
import { handleError } from "@/lib/errors/handleError";
import {
  getJobById,
  validateJob,
  createOrUpdateJob,
  deleteJobById,
} from "@/lib/services/jobsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idParam = searchParams.get("jobId");
    const id = idParam ? parseInt(idParam) : NaN;
    if (!isNaN(id)) {
      return NextResponse.json(await getJobById(id), { status: 200 });
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
      NextResponse.json(await createOrUpdateJob(job), { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const job = await request.json();
    if (await validateJob(job)) {
      NextResponse.json(await createOrUpdateJob(job), { status: 200 });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    handleError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const idParam = searchParams.get("jobId");
    const id = idParam ? parseInt(idParam) : NaN;
    if (!isNaN(id)) {
      deleteJobById(id);
      NextResponse.json({
        status: 200,
        statusText: "Job Deleted Successfully",
      });
    } else {
      throw new BadRequestError();
    }
  } catch (error) {
    handleError(error);
  }
}
