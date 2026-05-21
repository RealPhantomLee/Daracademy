import React from "react";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SessionTable } from "@/components/tables/SessionTable";
import { requireAdminSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function SessionsPage() {
  const session = await requireAdminSession();

  const sessions = await prisma.tutoringSession.findMany({
    include: {
      student: true,
      tutor: true,
    },
    orderBy: { startTime: "desc" },
  });

  const tableData = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    subject: s.subject,
    studentName: s.student.name,
    tutorName: s.tutor.name,
    startTime: s.startTime,
    status: s.status,
  }));

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Session Management</h1>
            <p className="text-slate-blue/70 mt-1">
              Manage all tutoring sessions
            </p>
          </div>
          <Link href="/dashboard/sessions/create">
            <Button variant="primary">Create Session</Button>
          </Link>
        </section>

        <Card>
          <SessionTable sessions={tableData} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
