/**
 * Noah Engine - Animated learning assistant
 * Main entry point and public API
 */

// Components
export { NoahWidget } from "./NoahWidget";
export { DialogueBubble } from "./DialogueBubble";
export { NoahRenderer } from "./renderer/NoahRenderer";

// Context
export { noahContext } from "./context";
export type { NoahContextType } from "./context";

// Types
export type {
  NoahState,
  NoahEvent,
  NoahContextData,
  NoahRendererProps,
} from "./types";

// Dialogue
export { noahResponses } from "./dialogue/responses";

// Machine
export { noahMachine } from "./machine";
