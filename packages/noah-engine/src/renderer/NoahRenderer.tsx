/**
 * Main Noah renderer with swap logic between 2D placeholder and 3D GLB model
 * Memoized to prevent unnecessary re-renders when parent updates
 */

import React from "react";
import { NoahPlaceholder } from "./NoahPlaceholder";
import { NoahGLB } from "./NoahGLB";
import type { NoahRendererProps } from "../types";

// Feature flag: set to true once GLB model is ready
const USE_3D_MODEL = false;

const NoahRendererContent: React.FC<NoahRendererProps> = (props) => {
  if (USE_3D_MODEL) {
    return <NoahGLB {...props} />;
  }

  return <NoahPlaceholder state={props.state} size={140} />;
};

export const NoahRenderer = React.memo(NoahRendererContent);
NoahRenderer.displayName = "NoahRenderer";
