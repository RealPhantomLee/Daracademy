/**
 * Fetch wrapper with timeout support
 * Prevents requests from hanging indefinitely
 */

export async function fetchWithTimeout(
  url: string,
  options?: RequestInit & { timeout?: number },
): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options || {};

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle timeout specifically
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms to ${url}`);
    }

    throw error;
  }
}

/**
 * Make a GET request with timeout
 */
export async function getWithTimeout(
  url: string,
  timeout: number = 5000,
): Promise<Response> {
  return fetchWithTimeout(url, {
    method: "GET",
    timeout,
  });
}

/**
 * Make a POST request with timeout
 */
export async function postWithTimeout(
  url: string,
  body: Record<string, unknown> | string,
  timeout: number = 5000,
): Promise<Response> {
  return fetchWithTimeout(url, {
    method: "POST",
    timeout,
    headers: {
      "Content-Type":
        typeof body === "string" ? "text/plain" : "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

/**
 * Retry a fetch request with exponential backoff
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit & { timeout?: number; maxRetries?: number },
): Promise<Response> {
  const { maxRetries = 3, timeout = 5000, ...fetchOptions } = options || {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchWithTimeout(url, {
        ...fetchOptions,
        timeout,
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on client errors (4xx)
      if (
        lastError instanceof Error &&
        lastError.message.includes("status") &&
        lastError.message.includes("4")
      ) {
        throw lastError;
      }

      // Exponential backoff before retry
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Request failed after ${maxRetries} attempts: ${lastError?.message}`,
  );
}
