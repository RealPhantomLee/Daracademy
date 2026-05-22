/**
 * Consumer-facing Noah widget component
 * Fixed bottom-right, manages state machine and rendering
 * Performance optimized with useCallback and useMemo
 */

import React, { useCallback, useMemo } from "react";
import { useMachine } from "@xstate/react";
import { noahMachine } from "./machine";
import { NoahRenderer } from "./renderer/NoahRenderer";
import { DialogueBubble } from "./DialogueBubble";
import { noahContext } from "./context";

interface NoahWidgetProps {
  /**
   * Whether the widget should be visible
   * @default true
   */
  enabled?: boolean;
}

export const NoahWidget: React.FC<NoahWidgetProps> = ({ enabled = true }) => {
  const [state, send] = useMachine(noahMachine);

  const showBubble = state.value !== "idle";
  const isVisible = enabled && state.context.message;

  // Memoize dismiss handler to prevent unnecessary re-renders
  const handleDismiss = useCallback(() => {
    send({ type: "DISMISS" });
  }, [send]);

  // Memoize dispatch function to prevent unnecessary re-renders of children
  const dispatch = useCallback(
    (event: Parameters<typeof send>[0]) => {
      send(event);
    },
    [send],
  );

  // Memoize context value to prevent Provider re-renders
  const contextValue = useMemo(() => ({ dispatch }), [dispatch]);

  if (!enabled) {
    return null;
  }

  return (
    <noahContext.Provider value={contextValue}>
      <div
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center pointer-events-auto"
        role="region"
        aria-label="Noah assistant"
      >
        {/* Dialogue bubble (above cat) */}
        <DialogueBubble
          message={state.context.message}
          visible={showBubble}
          onDismiss={handleDismiss}
        />

        {/* Noah character */}
        <div className="pointer-events-auto cursor-pointer">
          <NoahRenderer
            state={state.value as any}
            context={state.context}
            onDismiss={handleDismiss}
          />
        </div>
      </div>
    </noahContext.Provider>
  );
};
