/**
 * Main Noah renderer with swap logic between 2D placeholder and 3D GLB model
 */

import React from "react";
import { NoahPlaceholder } from "./NoahPlaceholder";
import { NoahGLB } from "./NoahGLB";
import type { NoahRendererProps } from "../types";

// Feature flag: set to true once GLB model is ready
const USE_3D_MODEL = false;

export const NoahRenderer: React.FC<NoahRendererProps> = (props) => {
  if (USE_3D_MODEL) {
    return <NoahGLB {...props} />;
  }

  return <NoahPlaceholder state={props.state} size={140} />;
};
