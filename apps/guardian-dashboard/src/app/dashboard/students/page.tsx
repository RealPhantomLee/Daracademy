import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { StudentCard } from "@/components/widgets/StudentCard";

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

export default async function StudentsPage() {
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

  // Fetch all students linked to this guardian
  // TODO: implement proper guardian-student linking when schema is updated
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      studentProfile: true,
      assignments: {
        where: {
          status: {
            in: ["ASSIGNED", "IN_PROGRESS", "SUBMITTED"],
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Your Students</h1>
        <p className="text-slate-blue/70">
          Monitor the progress and activities of all your linked students.
        </p>
      </section>

      {/* Students Grid */}
      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
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
          <p className="text-slate-blue/60 mb-4">
            No students linked to your account yet.
          </p>
          <div className="mx-auto inline-block">
            <Button variant="primary" size="sm" disabled>
              Link a Student
            </Button>
          </div>
          <p className="text-xs text-slate-blue/50 mt-4">
            Student linking is coming soon
          </p>
        </Card>
      )}
    </div>
  );
}
