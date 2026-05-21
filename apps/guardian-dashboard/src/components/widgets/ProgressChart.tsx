"use client";

import React from "react";
import { Card } from "@daracademy/ui";

interface ProgressData {
  subject: string;
  completed: number;
  total: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  title?: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  title = "Assignment Progress",
}) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-navy mb-6">{title}</h3>

      <div className="space-y-6">
        {data.map((item) => {
          const percentage = (item.completed / item.total) * 100;
          return (
            <div key={item.subject}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-navy">
                  {item.subject}
                </span>
                <span className="text-xs text-slate-blue/60">
                  {item.completed} / {item.total}
                </span>
              </div>
              <div className="w-full bg-slate-blue/10 rounded-full h-2">
                <div
                  className="bg-gold h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.length === 0 && (
        <p className="text-center text-slate-blue/60 py-8">
          No progress data available
        </p>
      )}
    </Card>
  );
};
