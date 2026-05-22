/**
 * Noah state machine types and interfaces
 */

export type NoahState =
  | "idle"
  | "welcome"
  | "notification"
  | "helper"
  | "celebration"
  | "reading";

/**
 * Discriminated union type for all Noah state machine events
 * Each event type is fully typed with its specific properties
 */
export type NoahEvent =
  | { type: "SHOW_WELCOME" }
  | { type: "SHOW_NOTIFICATION"; message?: string; duration?: number }
  | { type: "SHOW_HELPER"; message?: string }
  | { type: "SHOW_CELEBRATION"; message?: string }
  | { type: "START_READING"; message?: string }
  | { type: "DISMISS" }
  | { type: "TIMEOUT" };

export interface NoahContextData {
  message: string;
  displayTime: number;
  startTime: number;
}

export interface NoahRendererProps {
  state: NoahState;
  context: NoahContextData;
  onDismiss: () => void;
}
