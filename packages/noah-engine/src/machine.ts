/**
 * Noah state machine using XState v5
 */

import { createMachine, assign } from "xstate";
import type { NoahEvent, NoahContextData } from "./types";

export const noahMachine = createMachine(
  {
    id: "noah",
    initial: "idle",
    context: {
      message: "",
      displayTime: 3000,
      startTime: 0,
    } as NoahContextData,
    states: {
      idle: {
        on: {
          SHOW_WELCOME: {
            target: "welcome",
            actions: assign({
              message: () => "Welcome back! Ready to learn today?",
              displayTime: () => 5000,
              startTime: () => Date.now(),
            }),
          },
          SHOW_NOTIFICATION: {
            target: "notification",
            actions: assign({
              message: ({ event }) => (event as any).message || "You have something new!",
              displayTime: ({ event }) => (event as any).duration || 4000,
              startTime: () => Date.now(),
            }),
          },
          SHOW_HELPER: {
            target: "helper",
            actions: assign({
              message: ({ event }) => (event as any).message || "Need help? I'm here!",
              displayTime: () => 5000,
              startTime: () => Date.now(),
            }),
          },
          SHOW_CELEBRATION: {
            target: "celebration",
            actions: assign({
              message: ({ event }) => (event as any).message || "Amazing work!",
              displayTime: () => 3000,
              startTime: () => Date.now(),
            }),
          },
          START_READING: {
            target: "reading",
            actions: assign({
              message: ({ event }) => (event as any).message || "Reading assignment...",
              displayTime: () => 60000,
              startTime: () => Date.now(),
            }),
          },
        },
      },
      welcome: {
        after: {
          5000: "idle",
        },
        on: {
          DISMISS: "idle",
          SHOW_NOTIFICATION: {
            target: "notification",
            actions: assign({
              message: ({ event }) => (event as any).message || "You have something new!",
              displayTime: ({ event }) => (event as any).duration || 4000,
              startTime: () => Date.now(),
            }),
          },
        },
      },
      notification: {
        after: {
          4000: "idle",
        },
        on: {
          DISMISS: "idle",
          SHOW_HELPER: {
            target: "helper",
            actions: assign({
              message: ({ event }) => (event as any).message || "Need help? I'm here!",
              displayTime: () => 5000,
              startTime: () => Date.now(),
            }),
          },
        },
      },
      helper: {
        after: {
          5000: "idle",
        },
        on: {
          DISMISS: "idle",
        },
      },
      celebration: {
        after: {
          3000: "idle",
        },
        on: {
          DISMISS: "idle",
        },
      },
      reading: {
        after: {
          60000: "idle",
        },
        on: {
          DISMISS: "idle",
        },
      },
    },
  },
  {}
);

export type NoahMachine = typeof noahMachine;
