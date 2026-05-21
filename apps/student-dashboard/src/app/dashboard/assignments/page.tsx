"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@daracademy/ui";
import { AssignmentCard } from "@/components/widgets/AssignmentCard";
import { AssignmentStatus } from "@daracademy/database";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  description: string | null;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AssignmentStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/assignments");
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters: (AssignmentStatus | "ALL")[] = [
    "ALL",
    "ASSIGNED",
    "IN_PROGRESS",
    "SUBMITTED",
    "GRADED",
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesFilter = filter === "ALL" || assignment.status === filter;
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Assignments</h1>
        <p className="text-slate-blue/70">
          Manage and track your assignment progress.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="space-y-4">
        <input
          type="text"
          placeholder="Search assignments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-blue/20 bg-ivory focus:outline-none focus:ring-2 focus:ring-navy"
        />

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-navy text-ivory"
                  : "bg-slate-blue/10 text-navy hover:bg-slate-blue/20"
              }`}
            >
              {f === "ALL" ? "All Assignments" : f.replace("_", " ")}
            </button>
          ))}
        </div>
      </section>

      {/* Assignments Grid */}
      <section>
        {loading ? (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">Loading assignments...</p>
          </Card>
        ) : filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                id={assignment.id}
                title={assignment.title}
                subject={assignment.subject}
                dueDate={new Date(assignment.dueDate)}
                status={assignment.status}
                description={assignment.description || undefined}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">
              {filter === "ALL"
                ? "No assignments found."
                : `No ${filter.toLowerCase()} assignments.`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-navy hover:text-slate-blue font-medium mt-2 text-sm"
              >
                Clear search
              </button>
            )}
          </Card>
        )}
      </section>
    </div>
  );
}
