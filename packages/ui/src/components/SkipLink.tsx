"use client";

import React from "react";

/**
 * SkipLink component provides keyboard users with a way to jump directly to main content,
 * bypassing navigation menus. This improves accessibility for users relying on keyboard navigation.
 *
 * The link is hidden visually but visible to screen readers. On focus, it becomes visible.
 *
 * Usage: Add <SkipLink /> at the beginning of your layout, and ensure main content is wrapped with
 * <main id="main-content">...</main>
 */
export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-2 focus:bg-blue-600 focus:text-white"
    >
      Skip to main content
    </a>
  );
};
