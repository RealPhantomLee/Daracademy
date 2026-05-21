"use client";

import React, { useEffect } from "react";
import posthog from "posthog-js";

export interface PostHogProviderProps {
  children: React.ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!apiKey || !apiHost) {
      console.warn("PostHog credentials not configured");
      return;
    }

    posthog.init(apiKey, {
      api_host: apiHost,
      person_profiles: "identified_only",
      autocapture: {
        dom_event_allowlist: ["click", "change", "submit"],
      },
    });
  }, []);

  return <>{children}</>;
};

PostHogProvider.displayName = "PostHogProvider";
