import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard API response types
 */
export type ApiResponse<T = unknown> =
  | { success: true; data: T; code?: string }
  | { success: false; error: string; code?: string; details?: unknown };

/**
 * Create a successful response
 */
export function successResponse<T>(data: T, code?: string): ApiResponse<T> {
  return { success: true, data, code };
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  code?: string,
  details?: unknown,
): ApiResponse {
  return { success: false, error, code, details };
}

/**
 * Create a NextResponse from ApiResponse
 */
export function apiResponse<T>(
  response: ApiResponse<T>,
  status: number = 200,
): NextResponse {
  if (response.success) {
    return NextResponse.json(response, { status });
  }
  return NextResponse.json(response, { status });
}

/**
 * Handle validation error from Zod
 */
export function validationErrorResponse(error: ZodError) {
  const details = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
    code: err.code,
  }));

  return errorResponse("Validation failed", "VALIDATION_ERROR", details);
}

/**
 * Standardized error codes
 */
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  RATE_LIMIT: "RATE_LIMIT",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

/**
 * Standardized HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Response interceptor for consistent error handling
 */
export async function handleApiError(error: unknown): Promise<ApiResponse> {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Error) {
    // Database errors
    if (error.message.includes("Unique constraint failed")) {
      return errorResponse("Resource already exists", ErrorCodes.CONFLICT, {
        details: error.message,
      });
    }

    // Not found errors
    if (error.message.includes("Record to update not found")) {
      return errorResponse("Resource not found", ErrorCodes.NOT_FOUND);
    }

    return errorResponse(
      error.message || "An error occurred",
      ErrorCodes.INTERNAL_ERROR,
    );
  }

  return errorResponse(
    "An unexpected error occurred",
    ErrorCodes.INTERNAL_ERROR,
  );
}

/**
 * Type-safe async wrapper for API handlers
 */
export function createApiHandler<T>(
  handler: () => Promise<ApiResponse<T>>,
): () => Promise<NextResponse> {
  return async () => {
    try {
      const response = await handler();
      if (response.success) {
        return apiResponse(response, HttpStatus.OK);
      }
      const statusMap: Record<string, number> = {
        [ErrorCodes.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
        [ErrorCodes.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
        [ErrorCodes.FORBIDDEN]: HttpStatus.FORBIDDEN,
        [ErrorCodes.NOT_FOUND]: HttpStatus.NOT_FOUND,
        [ErrorCodes.CONFLICT]: HttpStatus.CONFLICT,
        [ErrorCodes.SERVICE_UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
      };
      const status =
        statusMap[response.code || ""] || HttpStatus.INTERNAL_ERROR;
      return apiResponse(response, status);
    } catch (error) {
      const response = await handleApiError(error);
      return apiResponse(response, HttpStatus.INTERNAL_ERROR);
    }
  };
}
