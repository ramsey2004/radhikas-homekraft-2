import { NextRequest, NextResponse } from 'next/server';

/**
 * Utility function for handling API errors
 * Usage: apiErrorResponse(error, statusCode)
 */
export function apiErrorResponse(
  message: string,
  statusCode: number = 500,
  details?: Record<string, any>
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Utility function for handling successful API responses
 * Usage: apiSuccessResponse(data, statusCode)
 */
export function apiSuccessResponse(
  data: any,
  statusCode: number = 200,
  message?: string
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API Error:', error);

      const message =
        error instanceof Error ? error.message : 'Internal server error';
      const statusCode =
        (error as any)?.statusCode || (error as any)?.status || 500;

      return apiErrorResponse(message, statusCode);
    }
  };
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  errors: Record<string, string[]> | string
) {
  const isString = typeof errors === 'string';
  return apiErrorResponse(
    isString ? errors : 'Validation failed',
    400,
    isString ? undefined : errors
  );
}

/**
 * Authentication error response
 */
export function authErrorResponse(message: string = 'Unauthorized') {
  return apiErrorResponse(message, 401);
}

/**
 * Authorization error response
 */
export function forbiddenErrorResponse(
  message: string = 'Forbidden'
) {
  return apiErrorResponse(message, 403);
}

/**
 * Not found error response
 */
export function notFoundErrorResponse(
  message: string = 'Resource not found'
) {
  return apiErrorResponse(message, 404);
}

/**
 * Conflict error response (e.g., duplicate entry)
 */
export function conflictErrorResponse(
  message: string = 'Conflict'
) {
  return apiErrorResponse(message, 409);
}
