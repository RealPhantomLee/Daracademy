/**
 * Speech bubble component for Noah dialogue
 * Memoized to prevent unnecessary re-renders
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogueBubbleProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

const DialogueBubbleContent: React.FC<DialogueBubbleProps> = ({
  message,
  visible,
  onDismiss,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50"
        >
          {/* Speech bubble container */}
          <div className="relative bg-white rounded-lg shadow-lg px-4 py-3 max-w-xs whitespace-normal">
            {/* Message text */}
            <p className="text-sm text-gray-800 leading-relaxed">{message}</p>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Tail pointing down */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid white",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DialogueBubble = React.memo(DialogueBubbleContent);
DialogueBubble.displayName = "DialogueBubble";
