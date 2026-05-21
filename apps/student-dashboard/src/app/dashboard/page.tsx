import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { AssignmentCard } from "@/components/widgets/AssignmentCard";
import { SessionCard } from "@/components/widgets/SessionCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Fetch upcoming sessions (next 7 days)
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 7);

  const sessions = await prisma.tutoringSession.findMany({
    where: {
      studentId: user.id,
      status: "SCHEDULED",
      startTime: {
        gte: new Date(),
        lte: upcomingDate,
      },
    },
    include: {
      tutor: true,
    },
    orderBy: { startTime: "asc" },
    take: 3,
  });

  // Fetch recent assignments
  const assignments = await prisma.assignment.findMany({
    where: {
      assignedToId: user.id,
      status: {
        in: ["ASSIGNED", "IN_PROGRESS"],
      },
    },
    orderBy: { dueDate: "asc" },
    take: 3,
  });

  // Fetch unread messages
  const unreadCount = await prisma.message.count({
    where: {
      receiverId: user.id,
      isRead: false,
    },
  });

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">
          Welcome back, {user.name || "Student"}!
        </h1>
        <p className="text-slate-blue/70">
          Here&apos;s your learning overview for this week.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{sessions.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Upcoming Sessions</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{assignments.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Active Assignments</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{unreadCount}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Unread Messages</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-gold">📊</p>
          <p className="text-slate-blue/60 text-sm mt-2">Keep Learning</p>
        </Card>
      </section>

      {/* Upcoming Sessions */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy">Upcoming Sessions</h2>
          <Button variant="outline" size="sm" onClick={() => {}}>
            <a href="/dashboard/schedule">View All</a>
          </Button>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                id={session.id}
                title={session.title}
                subject={session.subject}
                tutorName={session.tutor.name || "Tutor"}
                startTime={session.startTime}
                endTime={session.endTime}
                status={session.status}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">
              No upcoming sessions scheduled.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4 mx-auto"
              onClick={() => {}}
            >
              <a href="/dashboard/schedule">Schedule a Session</a>
            </Button>
          </Card>
        )}
      </section>

      {/* Recent Assignments */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy">Your Assignments</h2>
          <Button variant="outline" size="sm" onClick={() => {}}>
            <a href="/dashboard/assignments">View All</a>
          </Button>
        </div>

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                id={assignment.id}
                title={assignment.title}
                subject={assignment.subject}
                dueDate={assignment.dueDate}
                status={assignment.status}
                description={assignment.description || undefined}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">
              No active assignments at the moment.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4 mx-auto"
              onClick={() => {}}
            >
              <a href="/dashboard/assignments">Browse All</a>
            </Button>
          </Card>
        )}
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-navy mb-4">Need Help?</h3>
          <p className="text-slate-blue/70 mb-4 text-sm">
            Have questions about your assignments or need to reschedule a
            session?
          </p>
          <Button variant="primary" size="sm" onClick={() => {}}>
            <a href="/dashboard/messages">Send a Message</a>
          </Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-navy mb-4">Your Profile</h3>
          <p className="text-slate-blue/70 mb-4 text-sm">
            Update your learning goals, availability, and preferences.
          </p>
          <Button variant="primary" size="sm" onClick={() => {}}>
            <a href="/dashboard/profile">Edit Profile</a>
          </Button>
        </Card>
      </section>
    </div>
  );
}
