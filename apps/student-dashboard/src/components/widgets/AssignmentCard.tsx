"use client";

import React from "react";
import { Card, Badge } from "@daracademy/ui";
import { AssignmentStatus } from "@daracademy/database";

interface AssignmentCardProps {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  status: AssignmentStatus;
  description?: string;
}

const statusColors: Record<
  AssignmentStatus,
  "success" | "warning" | "error" | "primary"
> = {
  ASSIGNED: "primary",
  IN_PROGRESS: "warning",
  SUBMITTED: "warning",
  GRADED: "success",
  RETURNED: "error",
};

const statusLabels: Record<AssignmentStatus, string> = {
  ASSIGNED: "Not Started",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  GRADED: "Graded",
  RETURNED: "Returned",
};

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  id,
  title,
  subject,
  dueDate,
  status,
  description,
}) => {
  const isOverdue =
    new Date() > dueDate && status !== "GRADED" && status !== "RETURNED";
  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-navy">{title}</h3>
          <p className="text-sm text-slate-blue/60">{subject}</p>
        </div>
        <Badge variant={isOverdue ? "error" : statusColors[status]} size="sm">
          {statusLabels[status]}
        </Badge>
      </div>

      {description && (
        <p className="text-sm text-slate-blue/70 mb-4 line-clamp-2">
          {description}
        </p>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-slate-blue/10">
        <span
          className={`text-sm font-medium ${
            isOverdue ? "text-red-600" : "text-slate-blue/60"
          }`}
        >
          Due: {formattedDate}
        </span>
        <a
          href={`/dashboard/assignments/${id}`}
          className="text-navy hover:text-slate-blue font-medium text-sm transition-colors"
        >
          View →
        </a>
      </div>
    </Card>
  );
};
