"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "@daracademy/ui";
import { SessionCard } from "@/components/widgets/SessionCard";
import { SessionStatus } from "@daracademy/database";

interface Session {
  id: string;
  title: string;
  subject: string;
  tutorName: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
}

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SessionStatus | "ALL">("ALL");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const statuses: (SessionStatus | "ALL")[] = [
    "ALL",
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  const filteredSessions = sessions.filter(
    (session) => filter === "ALL" || session.status === filter,
  );

  // Group sessions by date
  const sessionsByDate = filteredSessions.reduce(
    (acc, session) => {
      const date = new Date(session.startTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    },
    {} as Record<string, Session[]>,
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Your Schedule</h1>
        <p className="text-slate-blue/70">
          View your upcoming tutoring sessions and schedule new ones.
        </p>
      </section>

      {/* Controls */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? "bg-navy text-ivory"
                    : "bg-slate-blue/10 text-navy hover:bg-slate-blue/20"
                }`}
              >
                {status === "ALL" ? "All Sessions" : status.replace("_", " ")}
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" disabled>
            Schedule Session
          </Button>
        </div>
      </section>

      {/* Sessions List (Grouped by Date) */}
      <section>
        {loading ? (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">Loading schedule...</p>
          </Card>
        ) : Object.keys(sessionsByDate).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
              <div key={date} className="space-y-4">
                <h3 className="text-lg font-semibold text-navy px-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dateSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      id={session.id}
                      title={session.title}
                      subject={session.subject}
                      tutorName={session.tutorName}
                      startTime={new Date(session.startTime)}
                      endTime={new Date(session.endTime)}
                      status={session.status}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">No sessions scheduled yet.</p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4 mx-auto"
              disabled
            >
              Schedule Your First Session
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}
