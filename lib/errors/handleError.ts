import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError, ValidationError } from "./errors";
import { DatabaseError } from "pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function handleError(error: unknown): NextResponse {
    if (error instanceof NotFoundError) {
        return NextResponse.json(
            { error: error.message },
            { status: 404 }
        );
    }

    if (error instanceof BadRequestError) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }

    if (error instanceof ValidationError) {
        return NextResponse.json(
            { error: error.message },
            { status: 422 }
        );
     }
     if(error instanceof DatabaseError){
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    if (error instanceof PrismaClientKnownRequestError){
        const prismaStatusMap: Record<string,number>={
            "P2002":409,
            "P2025":404,
        }
        const status = prismaStatusMap[error.code] || 400
        return NextResponse.json(
            {error:error.message},
            {status:status}
        )
    }
    // default
    return NextResponse.json(
        { error: "An unexpected error occurred :(" },
        { status: 500 }
    );
}