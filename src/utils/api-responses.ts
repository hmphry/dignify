import { NextResponse } from 'next/server';

export interface ApiResponse<Data> {
    data: Data | undefined;
    success: boolean;
    message?: string;
}

// generic function to create an API response
// Data will be replaced with actual type when used
// message is optional and can be used to provide additional information
function createApiResponse<Data>(
    code: number,
    data: Data | undefined,
    success: boolean,
    message?: string
): NextResponse {
    const responseBody: ApiResponse<Data> = {
        data,
        message: message || '',
        success,
    };

    return NextResponse.json(responseBody, {
        status: code,
        statusText: message,
    });
}

// Function to create a successful response
// Takes a status code, data, and an optional message
// Returns a NextResponse with success set to true
function successResponse<Data>(
    code: number,
    data: Data,
    message?: string
): NextResponse {
    return createApiResponse(code, data, true, message);
}

// Function to create a successful response with 200 status code
// Takes data and an optional message
export function send200<Data>(
    data: Data,
    message: string = 'Request was successful'
): NextResponse {
    return successResponse<Data>(200, data, message);
}

// Function to create an error response
// Takes a status code and a message
// Returns a NextResponse with success set to false
function errorResponse(code: number, message: string): NextResponse {
    return createApiResponse(code, null, false, message);
}

// Functions to create a error response with standardized HTTP status code
// Takes an optional message
export function send400(message: string = 'Bad Request'): NextResponse {
    return errorResponse(400, message);
}

export function send401(message: string = 'Unauthorized'): NextResponse {
    return errorResponse(401, message);
}

export function send403(message: string = 'Forbidden'): NextResponse {
    return errorResponse(403, message);
}

export function send404(message: string = 'Not Found'): NextResponse {
    return errorResponse(404, message);
}

export function send409(message: string = 'Conflict'): NextResponse {
    return errorResponse(409, message);
}

export function send500(
    message: string = 'Internal Server Error'
): NextResponse {
    return errorResponse(500, message);
}
