"use client";

import React from "react";
import { Card, Badge } from "@daracademy/ui";
import { SessionStatus } from "@daracademy/database";

interface UpcomingSession {
  id: string;
  title: string;
  studentName: string;
  startTime: Date;
  endTime: Date;
  status: SessionStatus;
}

interface SessionOverviewProps {
  sessions: UpcomingSession[];
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

export const SessionOverview: React.FC<SessionOverviewProps> = ({
  sessions,
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-navy mb-4">
        Upcoming Sessions
      </h3>

      <div className="space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session) => {
            const start = new Date(session.startTime);
            const formattedDate = start.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const formattedTime = start.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={session.id}
                className="flex justify-between items-start p-3 bg-slate-blue/5 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy">
                    {session.title}
                  </p>
                  <p className="text-xs text-slate-blue/60 mt-1">
                    {session.studentName}
                  </p>
                  <p className="text-xs text-slate-blue/70 mt-1">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
                <Badge variant={statusColors[session.status]} size="sm">
                  {statusLabels[session.status]}
                </Badge>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-slate-blue/60 text-center py-4">
            No upcoming sessions
          </p>
        )}
      </div>
    </Card>
  );
};
