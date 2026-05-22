"use client";

import type { ApiResponse } from "./response";

/**
 * Fetch options with defaults
 */
interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Parse and validate API response
 */
async function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return {
      success: false,
      error: `Invalid content type: ${contentType}`,
      code: "INVALID_RESPONSE",
    };
  }

  try {
    const data = await response.json();

    // Validate response structure
    if (!("success" in data)) {
      return {
        success: false,
        error: "Invalid API response structure",
        code: "INVALID_RESPONSE",
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: "Failed to parse response",
      code: "PARSE_ERROR",
    };
  }
}

/**
 * Make an API request with error handling and timeouts
 */
export async function apiFetch<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { timeout = 5000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await parseResponse<T>(response);

      if (errorData.success) {
        return {
          success: false,
          error: `HTTP ${response.status}`,
          code: `HTTP_${response.status}`,
        };
      }

      return errorData;
    }

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
          code: "TIMEOUT",
        };
      }

      if (error.message.includes("Failed to fetch")) {
        return {
          success: false,
          error: "Network error",
          code: "NETWORK_ERROR",
        };
      }

      return {
        success: false,
        error: error.message || "Unknown error",
        code: "REQUEST_ERROR",
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    };
  }
}

/**
 * GET request
 */
export async function apiGet<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, { ...options, method: "GET" });
}

/**
 * POST request
 */
export async function apiPost<T>(
  url: string,
  data?: unknown,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request
 */
export async function apiPut<T>(
  url: string,
  data?: unknown,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  url: string,
  data?: unknown,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  return apiFetch<T>(url, { ...options, method: "DELETE" });
}

/**
 * Upload file with FormData
 */
export async function apiUpload<T>(
  url: string,
  formData: FormData,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { timeout = 5000, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Upload failed: HTTP ${response.status}`,
        code: `HTTP_${response.status}`,
      };
    }

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Upload timeout",
          code: "TIMEOUT",
        };
      }

      return {
        success: false,
        error: error.message || "Upload failed",
        code: "UPLOAD_ERROR",
      };
    }

    return {
      success: false,
      error: "Upload failed",
      code: "UNKNOWN_ERROR",
    };
  }
}

/**
 * Type-safe error handler
 */
export function getErrorMessage(response: ApiResponse): string {
  if (response.success) {
    return "No error";
  }

  const errorMap: Record<string, string> = {
    VALIDATION_ERROR: "Please check your input and try again",
    UNAUTHORIZED: "You are not authorized to perform this action",
    FORBIDDEN: "You do not have permission to access this resource",
    NOT_FOUND: "The requested resource was not found",
    CONFLICT: "This resource already exists",
    TIMEOUT: "Request took too long. Please try again",
    NETWORK_ERROR: "Network connection error. Please check your internet",
    INTERNAL_ERROR: "An error occurred on the server. Please try again later",
  };

  return errorMap[response.code || ""] || response.error || "An error occurred";
}

/**
 * Check if response indicates user should be redirected to login
 */
export function isAuthError(response: ApiResponse): boolean {
  return response.code === "UNAUTHORIZED";
}

/**
 * Check if response indicates permission error
 */
export function isPermissionError(response: ApiResponse): boolean {
  return response.code === "FORBIDDEN";
}

/**
 * Check if response indicates validation error
 */
export function isValidationError(response: ApiResponse): boolean {
  return response.code === "VALIDATION_ERROR";
}
