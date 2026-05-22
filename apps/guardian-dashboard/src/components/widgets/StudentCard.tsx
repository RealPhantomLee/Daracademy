"use client";

import React from "react";
import { Card, Button } from "@daracademy/ui";

interface StudentCardProps {
  id: string;
  name: string;
  school?: string;
  gradeLevel?: number;
  subjects: string[];
  recentGrade?: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  id,
  name,
  school,
  gradeLevel,
  subjects,
  recentGrade,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-navy">{name}</h3>
        {school && <p className="text-sm text-slate-blue/60">{school}</p>}
        {gradeLevel && (
          <p className="text-sm text-slate-blue/60">Grade {gradeLevel}</p>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div>
          <p className="text-xs text-slate-blue/50 uppercase font-medium mb-2">
            Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <span
                key={subject}
                className="inline-block bg-slate-blue/10 text-navy text-xs px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {recentGrade !== undefined && (
        <div className="py-3 border-t border-slate-blue/10 mb-4">
          <p className="text-sm text-slate-blue/70">
            <span className="font-medium">Recent Grade:</span> {recentGrade}%
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <a
          href={`/dashboard/students/${id}`}
          className="flex-1"
          aria-label={`View details for ${name}`}
        >
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </a>
      </div>
    </Card>
  );
};
