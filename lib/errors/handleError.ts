import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError, ValidationError } from "./errors";

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
     if(error instanceof Error){
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    // default
    return NextResponse.json(
        { error: "An unexpected error occurred :(" },
        { status: 500 }
    );
}