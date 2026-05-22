"use client";

import React from "react";

export interface CalendlyEmbedProps {
  url: string;
  height?: number;
  className?: string;
}

/**
 * Calendly embed component
 * Renders an embedded Calendly scheduling widget
 */
const CalendlyEmbedComponent = React.forwardRef<
  HTMLDivElement,
  CalendlyEmbedProps
>(({ url, height = 700, className = "" }, ref) => {
  return (
    <div
      ref={ref}
      className={`calendly-embed-container ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: `${height}px`,
        overflow: "hidden",
      }}
    >
      <iframe
        title="Calendly Booking"
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
});

CalendlyEmbedComponent.displayName = "CalendlyEmbed";

export const CalendlyEmbed = CalendlyEmbedComponent;
export default CalendlyEmbedComponent;
