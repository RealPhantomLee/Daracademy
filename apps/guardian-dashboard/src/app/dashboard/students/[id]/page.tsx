import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Badge, Button } from "@daracademy/ui";
import { ProgressChart } from "@/components/widgets/ProgressChart";

interface StudentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  // Fetch guardian user
  const guardian = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!guardian) {
    return <div>Guardian not found</div>;
  }

  const { id: studentId } = await params;

  // Fetch student
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      studentProfile: true,
    },
  });

  if (!student) {
    return <div className="p-8">Student not found</div>;
  }

  // Fetch assignments for this student
  const assignments = await prisma.assignment.findMany({
    where: {
      assignedToId: studentId,
    },
    orderBy: { dueDate: "asc" },
  });

  // Fetch upcoming sessions for this student
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 30);

  const sessions = await prisma.tutoringSession.findMany({
    where: {
      studentId,
      status: {
        in: ["SCHEDULED", "IN_PROGRESS"],
      },
      startTime: {
        gte: new Date(),
        lte: upcomingDate,
      },
    },
    include: {
      tutor: true,
    },
    orderBy: { startTime: "asc" },
  });

  // Fetch feedback/grades
  const feedback = await prisma.sessionFeedback.findMany({
    where: {
      givenToId: studentId,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calculate progress by subject
  const subjectsMap = new Map<string, { completed: number; total: number }>();
  assignments.forEach((assignment) => {
    const key = assignment.subject;
    const current = subjectsMap.get(key) || { completed: 0, total: 0 };
    current.total += 1;
    if (
      assignment.status === "GRADED" ||
      assignment.status === "SUBMITTED" ||
      assignment.status === "RETURNED"
    ) {
      current.completed += 1;
    }
    subjectsMap.set(key, current);
  });

  const progressData = Array.from(subjectsMap.entries()).map(
    ([subject, data]) => ({
      subject,
      ...data,
    }),
  );

  // Calculate average grade
  const gradesCount = feedback.filter((f) => f.rating !== null).length;
  const averageGrade =
    gradesCount > 0
      ? Math.round(
          feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / gradesCount,
        )
      : null;

  const statusColors: Record<
    string,
    "success" | "warning" | "error" | "primary"
  > = {
    ASSIGNED: "primary",
    IN_PROGRESS: "warning",
    SUBMITTED: "warning",
    GRADED: "success",
    RETURNED: "error",
  };

  const statusLabels: Record<string, string> = {
    ASSIGNED: "Not Started",
    IN_PROGRESS: "In Progress",
    SUBMITTED: "Submitted",
    GRADED: "Graded",
    RETURNED: "Returned",
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-navy mb-2">
              {student.name || "Student"}
            </h1>
            {student.studentProfile?.school && (
              <p className="text-slate-blue/70">
                {student.studentProfile.school}
                {student.studentProfile.gradeLevel &&
                  ` • Grade ${student.studentProfile.gradeLevel}`}
              </p>
            )}
          </div>
          <Link href="/dashboard/students">
            <Button variant="outline" size="sm">
              Back to Students
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">
            {assignments.filter((a) => a.status === "GRADED").length}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Assignments Graded</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{sessions.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Upcoming Sessions</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">
            {assignments.filter((a) => a.status === "IN_PROGRESS").length}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">In Progress</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-gold">
            {averageGrade ? `${averageGrade}%` : "–"}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Average Grade</p>
        </Card>
      </section>

      {/* Progress Chart */}
      <section>
        <ProgressChart data={progressData} title="Progress by Subject" />
      </section>

      {/* Current Assignments */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">
          Current Assignments
        </h2>
        <Card>
          {assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((assignment) => {
                const isOverdue =
                  new Date() > assignment.dueDate &&
                  assignment.status !== "GRADED" &&
                  assignment.status !== "RETURNED";
                const dueDate = new Date(assignment.dueDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <div
                    key={assignment.id}
                    className="flex justify-between items-start p-4 bg-slate-blue/5 rounded-lg border border-slate-blue/10"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-navy">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-slate-blue/60 mt-1">
                        {assignment.subject}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          isOverdue
                            ? "text-red-600 font-medium"
                            : "text-slate-blue/70"
                        }`}
                      >
                        Due: {dueDate}
                      </p>
                      {assignment.description && (
                        <p className="text-xs text-slate-blue/60 mt-2 line-clamp-2">
                          {assignment.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4">
                      <Badge
                        variant={
                          isOverdue ? "error" : statusColors[assignment.status]
                        }
                      >
                        {statusLabels[assignment.status]}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-blue/60 py-8">
              No assignments yet
            </p>
          )}
        </Card>
      </section>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">Upcoming Sessions</h2>
        <Card>
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => {
                const start = new Date(session.startTime);
                const formattedDate = start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const formattedTime = start.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={session.id}
                    className="flex justify-between items-start p-4 bg-slate-blue/5 rounded-lg border border-slate-blue/10"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-navy">{session.title}</h3>
                      <p className="text-sm text-slate-blue/60 mt-1">
                        {session.subject} • {session.tutor.name || "Tutor"}
                      </p>
                      <p className="text-sm text-slate-blue/70 mt-2">
                        {formattedDate} at {formattedTime}
                      </p>
                    </div>
                    <Badge variant="primary">
                      {session.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Scheduled"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-blue/60 py-8">
              No upcoming sessions
            </p>
          )}
        </Card>
      </section>

      {/* Recent Feedback */}
      {feedback.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6">Recent Feedback</h2>
          <Card>
            <div className="space-y-4">
              {feedback.map((f) => (
                <div
                  key={f.id}
                  className="p-4 bg-slate-blue/5 rounded-lg border border-slate-blue/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-navy">Session Feedback</p>
                    {f.rating && (
                      <span className="text-sm font-medium text-gold">
                        {f.rating}%
                      </span>
                    )}
                  </div>
                  {f.comment && (
                    <p className="text-sm text-slate-blue/70">{f.comment}</p>
                  )}
                  <p className="text-xs text-slate-blue/50 mt-2">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}
