"use client";

import React from "react";
import { Card, Badge } from "@daracademy/ui";
import { SessionStatus } from "@daracademy/database";

interface SessionCardProps {
  id: string;
  title: string;
  subject: string;
  tutorName: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
}

const statusColors: Record<
  SessionStatus,
  "success" | "warning" | "default" | "primary"
> = {
  SCHEDULED: "primary",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "default",
  NO_SHOW: "default",
};

const statusLabels: Record<SessionStatus, string> = {
  SCHEDULED: "Upcoming",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
};

export const SessionCard: React.FC<SessionCardProps> = ({
  id,
  title,
  subject,
  tutorName,
  startTime,
  endTime,
  status,
}) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const formattedDate = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = `${start.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          <p className="text-sm text-slate-blue/60">{subject}</p>
        </div>
        <Badge variant={statusColors[status]} size="sm">
          {statusLabels[status]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="text-slate-blue/70">
          <span className="font-medium">Tutor:</span> {tutorName}
        </p>
        <p className="text-slate-blue/70">
          <span className="font-medium">Time:</span> {formattedDate} at{" "}
          {formattedTime}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-blue/10 flex justify-between">
        <span className="text-xs text-slate-blue/50">
          Session ID: {id.slice(0, 8)}
        </span>
        <a
          href={`/dashboard/schedule/${id}`}
          className="text-navy hover:text-slate-blue font-medium text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
          aria-label={`View details for ${title} session on ${new Date(startTime).toLocaleDateString()}`}
        >
          Details →
        </a>
      </div>
    </Card>
  );
};
