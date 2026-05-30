import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "./errors";

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

    // default
    return NextResponse.json(
        { error: "An unexpected error occurred :(" },
        { status: 500 }
    );
}