import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { StudentCard } from "@/components/widgets/StudentCard";

export default async function StudentsPage() {
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
          <Button
            variant="primary"
            size="sm"
            className="mx-auto"
            onClick={() => {}}
          >
            Link a Student
          </Button>
        </Card>
      )}
    </div>
  );
}
