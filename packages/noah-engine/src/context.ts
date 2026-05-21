/**
 * React context for Noah event dispatching
 */

import React, { createContext } from "react";
import type { NoahEvent } from "./types";

export interface NoahContextType {
  dispatch: (event: NoahEvent) => void;
}

export const noahContext = createContext<NoahContextType | undefined>(
  undefined
);

export function useNoahDispatch(): NoahContextType {
  const context = React.useContext(noahContext);
  if (!context) {
    throw new Error("useNoahDispatch must be used within NoahProvider");
  }
  return context;
}
