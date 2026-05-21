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

export interface NoahEvent {
  type:
    | "SHOW_WELCOME"
    | "SHOW_NOTIFICATION"
    | "SHOW_HELPER"
    | "SHOW_CELEBRATION"
    | "START_READING"
    | "DISMISS"
    | "TIMEOUT";
  message?: string;
  duration?: number;
}

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
