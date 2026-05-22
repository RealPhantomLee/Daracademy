"use client";

import React, { useState } from "react";
import { Button, Badge } from "@daracademy/ui";
import Link from "next/link";

interface Student {
  id: string;
  name: string | null;
  email: string | null;
  studentProfile: {
    gradeLevel: number | null;
    school: string | null;
    subjects: string[];
  } | null;
  createdAt: Date;
}

interface StudentTableProps {
  students: Student[];
  onDelete?: (id: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<"name" | "email" | "createdAt">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState("");

  const sorted = [...students].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (!aVal || !bVal) return 0;

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter(
    (s) =>
      s.name?.toLowerCase().includes(filter.toLowerCase()) ||
      s.email?.toLowerCase().includes(filter.toLowerCase()),
  );

  const toggleSort = (field: "name" | "email" | "createdAt") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-4">
        <label htmlFor="student-search" className="sr-only">
          Search by name or email
        </label>
        <input
          id="student-search"
          type="text"
          placeholder="Search by name or email..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Search students by name or email"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-blue/20">
        <table className="w-full text-sm">
          <thead className="bg-slate-blue/5 border-b border-slate-blue/20">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("name")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by name"
                  aria-pressed={sortField === "name"}
                >
                  Name{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("email")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by email"
                  aria-pressed={sortField === "email"}
                >
                  Email{" "}
                  {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Grade Level
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Subjects
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Joined
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
                  colSpan={6}
                  className="px-6 py-4 text-center text-slate-blue/60"
                >
                  No students found
                </td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr key={student.id} className="hover:bg-slate-blue/5">
                  <td className="px-6 py-4 font-medium text-navy">
                    {student.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80">
                    {student.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80">
                    {student.studentProfile?.gradeLevel || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {student.studentProfile?.subjects &&
                    student.studentProfile.subjects.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {student.studentProfile.subjects
                          .slice(0, 2)
                          .map((s) => (
                            <Badge key={s} variant="primary" size="sm">
                              {s}
                            </Badge>
                          ))}
                        {student.studentProfile.subjects.length > 2 && (
                          <span className="text-xs text-slate-blue/60">
                            +{student.studentProfile.subjects.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80 text-xs">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/students/${student.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View details for ${student.name}`}
                        >
                          View
                        </Button>
                      </Link>
                      {onDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(student.id)}
                          aria-label={`Delete student ${student.name}`}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-slate-blue/60">
        Showing {filtered.length} of {students.length} students
      </div>
    </div>
  );
};
