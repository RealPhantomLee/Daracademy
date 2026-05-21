/**
 * Consumer-facing Noah widget component
 * Fixed bottom-right, manages state machine and rendering
 */

import React, { useEffect } from "react";
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

  const handleDismiss = () => {
    send({ type: "DISMISS" });
  };

  // Provide dispatch function via context
  const dispatch = (event: Parameters<typeof send>[0]) => {
    send(event);
  };

  if (!enabled) {
    return null;
  }

  return (
    <noahContext.Provider value={{ dispatch }}>
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
