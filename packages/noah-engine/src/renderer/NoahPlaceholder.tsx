/**
 * Animated placeholder Noah cat using CSS/SVG and Framer Motion
 */

import React from "react";
import { motion } from "framer-motion";
import type { NoahState } from "../types";

const STATE_ANIMATIONS: Record<NoahState, any> = {
  idle: {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
  welcome: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  notification: {
    rotate: [0, -5, 5, -5, 0],
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  helper: {
    x: [-10, 10, -10, 10, 0],
    transition: { duration: 0.8, ease: "easeInOut" },
  },
  celebration: {
    y: [0, -20, 0],
    transition: { duration: 0.6, repeat: 2, ease: "easeInOut" },
  },
  reading: {
    rotateZ: [0, 2, -2, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const CatSVG: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Body */}
    <ellipse cx="50" cy="60" rx="28" ry="32" fill="white" stroke="#000" strokeWidth="2" />

    {/* Head */}
    <circle cx="50" cy="30" r="20" fill="white" stroke="#000" strokeWidth="2" />

    {/* Left ear */}
    <polygon
      points="35,15 30,5 40,12"
      fill="white"
      stroke="#000"
      strokeWidth="2"
    />

    {/* Right ear */}
    <polygon
      points="65,15 70,5 60,12"
      fill="white"
      stroke="#000"
      strokeWidth="2"
    />

    {/* Left eye */}
    <circle cx="44" cy="26" r="2.5" fill="#000" />

    {/* Right eye */}
    <circle cx="56" cy="26" r="2.5" fill="#000" />

    {/* Nose */}
    <polygon points="50,32 48,35 52,35" fill="#ff69b4" />

    {/* Mouth */}
    <path d="M 50 35 Q 46 38 42 36" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 50 35 Q 54 38 58 36" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Tail */}
    <path
      d="M 65 75 Q 80 70 82 50"
      stroke="#000"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />

    {/* Front left paw */}
    <ellipse cx="38" cy="88" rx="5" ry="8" fill="white" stroke="#000" strokeWidth="1.5" />

    {/* Front right paw */}
    <ellipse cx="62" cy="88" rx="5" ry="8" fill="white" stroke="#000" strokeWidth="1.5" />
  </svg>
);

interface NoahPlaceholderProps {
  state: NoahState;
  size?: number;
}

export const NoahPlaceholder: React.FC<NoahPlaceholderProps> = ({
  state,
  size = 120,
}) => {
  return (
    <motion.div
      animate={STATE_ANIMATIONS[state]}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CatSVG
        className="select-none"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
};
