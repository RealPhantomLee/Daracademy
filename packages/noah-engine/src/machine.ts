/**
 * Noah state machine using XState v5
 * Event typing is handled through discriminated union in types.ts
 */

import { createMachine, assign } from "xstate";
import type { NoahContextData } from "./types";

/**
 * Helper function to safely extract event properties with type narrowing
 */
function getEventProp<T extends Record<string, any>, K extends keyof T>(
  event: T,
  key: K,
  defaultValue: any,
): any {
  return event[key] !== undefined ? event[key] : defaultValue;
}

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
              message: ({ event }) =>
                getEventProp(event, "message", "You have something new!"),
              displayTime: ({ event }) => getEventProp(event, "duration", 4000),
              startTime: () => Date.now(),
            }),
          },
          SHOW_HELPER: {
            target: "helper",
            actions: assign({
              message: ({ event }) =>
                getEventProp(event, "message", "Need help? I'm here!"),
              displayTime: () => 5000,
              startTime: () => Date.now(),
            }),
          },
          SHOW_CELEBRATION: {
            target: "celebration",
            actions: assign({
              message: ({ event }) =>
                getEventProp(event, "message", "Amazing work!"),
              displayTime: () => 3000,
              startTime: () => Date.now(),
            }),
          },
          START_READING: {
            target: "reading",
            actions: assign({
              message: ({ event }) =>
                getEventProp(event, "message", "Reading assignment..."),
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
              message: ({ event }) =>
                getEventProp(event, "message", "You have something new!"),
              displayTime: ({ event }) => getEventProp(event, "duration", 4000),
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
              message: ({ event }) =>
                getEventProp(event, "message", "Need help? I'm here!"),
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
  {},
);

export type NoahMachine = typeof noahMachine;
