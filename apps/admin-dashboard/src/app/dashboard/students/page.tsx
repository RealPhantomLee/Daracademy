import React from "react";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentTable } from "@/components/tables/StudentTable";
import { requireAdminSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function StudentsPage() {
  const session = await requireAdminSession();

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      studentProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Student Management</h1>
            <p className="text-slate-blue/70 mt-1">
              Manage all student accounts and profiles
            </p>
          </div>
          <Link href="/dashboard/students/create">
            <Button variant="primary">Create Student</Button>
          </Link>
        </section>

        <Card>
          <StudentTable students={students} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
