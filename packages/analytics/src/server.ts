import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    const apiKey = process.env.POSTHOG_API_KEY;
    const apiHost = process.env.POSTHOG_API_HOST || "https://us.posthog.com";

    if (!apiKey) {
      throw new Error(
        "POSTHOG_API_KEY environment variable is required for server-side analytics",
      );
    }

    posthogClient = new PostHog(apiKey, {
      host: apiHost,
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
  posthog.capture({
    distinctId: userId,
    event,
    properties,
  });
}

export async function identifyUser(
  userId: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  const posthog = getPostHogClient();
  posthog.identify({
    distinctId: userId,
    properties,
  });
}

export async function flushEvents(): Promise<void> {
  const posthog = getPostHogClient();
  await posthog.shutdownAsync();
}
