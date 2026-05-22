"use client";

import React, { useState } from "react";
import { Button } from "@daracademy/ui";
import Link from "next/link";

interface SessionRow {
  id: string;
  title: string;
  subject: string;
  studentName: string | null;
  tutorName: string | null;
  startTime: Date;
  status: string;
}

interface SessionTableProps {
  sessions: SessionRow[];
}

export const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  const [sortField, setSortField] = useState<"title" | "startTime" | "status">(
    "startTime",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<string>("all");

  const statusColors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    NO_SHOW: "bg-gray-100 text-gray-800",
  };

  const sorted = [...sessions].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (!aVal || !bVal) return 0;

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filtered =
    filter === "all" ? sorted : sorted.filter((s) => s.status === filter);

  const toggleSort = (field: "title" | "startTime" | "status") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {["all", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                filter === status
                  ? "bg-navy text-ivory"
                  : "bg-slate-blue/10 text-navy hover:bg-slate-blue/20"
              }`}
              aria-label={`Filter by ${status === "all" ? "all statuses" : status.replace("_", " ")}`}
              aria-pressed={filter === status}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ),
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-blue/20">
        <table className="w-full text-sm">
          <thead className="bg-slate-blue/5 border-b border-slate-blue/20">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("title")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by session title"
                  aria-pressed={sortField === "title"}
                >
                  Title{" "}
                  {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Subject
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Student
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Tutor
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("startTime")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by start time"
                  aria-pressed={sortField === "startTime"}
                >
                  Start Time{" "}
                  {sortField === "startTime" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("status")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by status"
                  aria-pressed={sortField === "status"}
                >
                  Status{" "}
                  {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-blue/10">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-slate-blue/60"
                >
                  No sessions found
                </td>
              </tr>
            ) : (
              filtered.map((session) => (
                <tr key={session.id} className="hover:bg-slate-blue/5">
                  <td className="px-6 py-4 font-medium text-navy">
                    {session.title}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80">
                    {session.subject}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80">
                    {session.studentName || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80">
                    {session.tutorName || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80 text-xs">
                    {new Date(session.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[session.status] ||
                        "bg-slate-blue/10 text-slate-blue"
                      }`}
                    >
                      {session.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/sessions/${session.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label={`Edit session ${session.title}`}
                      >
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-slate-blue/60">
        Showing {filtered.length} of {sessions.length} sessions
      </div>
    </div>
  );
};
