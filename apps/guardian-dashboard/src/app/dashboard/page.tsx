import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { StudentCard } from "@/components/widgets/StudentCard";
import { SessionOverview } from "@/components/widgets/SessionOverview";

const ErrorState = ({
  message,
  action,
}: {
  message: string;
  action?: () => void;
}) => (
  <div className="p-8 space-y-8">
    <section className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="text-sm font-medium text-yellow-800 mb-2">{message}</h3>
      {action && (
        <button
          onClick={action}
          className="text-sm text-blue-600 hover:underline"
        >
          Try again
        </button>
      )}
    </section>
  </div>
);

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <ErrorState message="Please sign in to continue" />;
  }

  // Fetch guardian user
  const guardian = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!guardian) {
    return <ErrorState message="Guardian profile not found" />;
  }

  // For now, fetch all students to show linked students
  // TODO: implement proper guardian-student linking when schema is updated
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      studentProfile: true,
    },
    take: 6,
  });

  // Fetch upcoming sessions for all students
  const upcomingDate = new Date();
  upcomingDate.setDate(upcomingDate.getDate() + 7);

  const studentIds = students.map((s) => s.id);
  const sessions = await prisma.tutoringSession.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      status: "SCHEDULED",
      startTime: {
        gte: new Date(),
        lte: upcomingDate,
      },
    },
    include: {
      student: true,
    },
    orderBy: { startTime: "asc" },
    take: 5,
  });

  // Fetch recent payments
  const payments = await prisma.payment.findMany({
    where: {
      userId: guardian.id,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const totalSpent = completedPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.toString()),
    0,
  );

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">
          Welcome back, {guardian.name || "Guardian"}!
        </h1>
        <p className="text-slate-blue/70">
          Monitor your children&apos;s learning progress and manage payments.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{students.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Linked Students</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{sessions.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Upcoming Sessions</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{payments.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Total Payments</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-gold">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Amount Paid</p>
        </Card>
      </section>

      {/* Linked Students */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy">Your Students</h2>
          {students.length > 0 && (
            <Link href="/dashboard/students">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          )}
        </div>

        {students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.slice(0, 3).map((student) => (
              <StudentCard
                key={student.id}
                id={student.id}
                name={student.name || "Student"}
                school={student.studentProfile?.school || undefined}
                gradeLevel={student.studentProfile?.gradeLevel || undefined}
                subjects={student.studentProfile?.subjects || []}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-blue/60">
              No students linked to your account yet.
            </p>
            <Link href="/dashboard/students">
              <Button variant="primary" size="sm" className="mt-4 mx-auto">
                Link a Student
              </Button>
            </Link>
          </Card>
        )}
      </section>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">Upcoming Sessions</h2>
        <SessionOverview
          sessions={sessions.map((s) => ({
            id: s.id,
            title: s.title,
            studentName: s.student.name || "Student",
            startTime: s.startTime,
            endTime: s.endTime,
            status: s.status,
          }))}
        />
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-navy mb-4">Payments</h3>
          <p className="text-slate-blue/70 mb-4 text-sm">
            View payment history and invoices for tutoring sessions.
          </p>
          <Link href="/dashboard/payments">
            <Button variant="primary" size="sm">
              View Payments
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-navy mb-4">Messages</h3>
          <p className="text-slate-blue/70 mb-4 text-sm">
            Communicate with tutors and discuss student progress.
          </p>
          <Link href="/dashboard/messages">
            <Button variant="primary" size="sm">
              Send Message
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-navy mb-4">
            Student Details
          </h3>
          <p className="text-slate-blue/70 mb-4 text-sm">
            View detailed progress, grades, and assignments.
          </p>
          <Link href="/dashboard/students">
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
