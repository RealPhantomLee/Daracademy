import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY;

  if (!apiKey) {
    console.warn(
      "[PostHog] POSTHOG_API_KEY not configured, events will be discarded",
    );
    return null;
  }

  if (!posthogClient) {
    const apiHost = process.env.POSTHOG_API_HOST || "https://us.posthog.com";

    posthogClient = new PostHog(apiKey, {
      host: apiHost,
      flushInterval: 5000, // Batch events every 5s
    });
  }

  return posthogClient;
}

export async function captureEvent(
  userId: string,
  event: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const posthog = getPostHogClient();
  if (!posthog) return; // Graceful fallback if not configured

  try {
    posthog.capture({
      distinctId: userId,
      event,
      properties,
    });
  } catch (error) {
    console.error("[PostHog] Failed to capture event:", error);
    // Don't throw - analytics should never crash the app
  }
}

export async function identifyUser(
  userId: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const posthog = getPostHogClient();
  if (!posthog) return;

  try {
    posthog.identify({
      distinctId: userId,
      properties,
    });
  } catch (error) {
    console.error("[PostHog] Failed to identify user:", error);
  }
}

export async function flushEvents(): Promise<void> {
  const posthog = getPostHogClient();
  if (!posthog) return;

  try {
    // Use optional chaining and type assertion for shutdownAsync
    const client = posthog as any;
    if (client.shutdownAsync && typeof client.shutdownAsync === "function") {
      await client.shutdownAsync();
    }
  } catch (error) {
    console.error("[PostHog] Failed to flush events:", error);
  }
}

export function shutdown(): void {
  const posthog = getPostHogClient();
  if (posthog) {
    const client = posthog as any;
    if (client.shutdownAsync && typeof client.shutdownAsync === "function") {
      client.shutdownAsync().catch((error: Error) => {
        console.error("[PostHog] Failed to shutdown:", error);
      });
    }
  }
}
