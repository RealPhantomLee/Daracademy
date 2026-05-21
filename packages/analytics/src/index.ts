export { PostHogProvider } from "./PostHogProvider";
export type { PostHogProviderProps } from "./PostHogProvider";
export {
  getPostHogClient,
  captureEvent,
  identifyUser,
  flushEvents,
} from "./server";
