import React from "react";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAdminSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireAdminSession();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Fetch key metrics
  const [totalStudents, activeSessions, totalRevenue, recentSignups] =
    await Promise.all([
      prisma.user.count({
        where: { role: "STUDENT" },
      }),
      prisma.tutoringSession.count({
        where: {
          status: "IN_PROGRESS",
          startTime: { gte: now },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: weekAgo },
        },
        _sum: { amount: true },
      }),
      prisma.user.count({
        where: {
          role: "STUDENT",
          createdAt: { gte: weekAgo },
        },
      }),
    ]);

  const revenue = totalRevenue._sum.amount
    ? parseFloat(totalRevenue._sum.amount.toString())
    : 0;

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-4xl font-bold text-navy mb-2">
            Welcome, {session.user?.name || "Admin"}!
          </h1>
          <p className="text-slate-blue/70">
            Here&apos;s your academy overview.
          </p>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <p className="text-4xl font-bold text-navy">{totalStudents}</p>
            <p className="text-slate-blue/60 text-sm mt-2">Total Students</p>
          </Card>
          <Card className="text-center">
            <p className="text-4xl font-bold text-navy">{activeSessions}</p>
            <p className="text-slate-blue/60 text-sm mt-2">
              Sessions This Week
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-4xl font-bold text-gold">
              ${revenue.toFixed(2)}
            </p>
            <p className="text-slate-blue/60 text-sm mt-2">Revenue (7d)</p>
          </Card>
          <Card className="text-center">
            <p className="text-4xl font-bold text-navy">{recentSignups}</p>
            <p className="text-slate-blue/60 text-sm mt-2">New Signups (7d)</p>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-navy mb-3">
              Student Management
            </h3>
            <p className="text-slate-blue/70 text-sm mb-4">
              Create, edit, and manage student accounts and profiles.
            </p>
            <Link href="/dashboard/students">
              <Button variant="primary" size="sm" className="w-full">
                Manage Students
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-navy mb-3">
              Session Control
            </h3>
            <p className="text-slate-blue/70 text-sm mb-4">
              Schedule, reschedule, and manage tutoring sessions.
            </p>
            <Link href="/dashboard/sessions">
              <Button variant="primary" size="sm" className="w-full">
                Manage Sessions
              </Button>
            </Link>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-navy mb-3">
              Achievement Titles
            </h3>
            <p className="text-slate-blue/70 text-sm mb-4">
              Configure and manage the title/achievement system.
            </p>
            <Link href="/dashboard/titles">
              <Button variant="primary" size="sm" className="w-full">
                Manage Titles
              </Button>
            </Link>
          </Card>
        </section>

        {/* Info Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-navy mb-4">More Tools</h3>
            <ul className="space-y-2 text-sm text-slate-blue/70">
              <li className="flex items-center gap-2">
                <span>👥</span>
                <Link href="/dashboard/guardians" className="hover:text-navy">
                  Guardian Management
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span>💬</span>
                <Link href="/dashboard/messages" className="hover:text-navy">
                  Admin Messaging
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span>📊</span>
                <Link href="/dashboard/analytics" className="hover:text-navy">
                  Analytics & Reports
                </Link>
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-navy mb-4">
              System Health
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-slate-blue/70">Database</span>
                <span className="text-green-600 font-medium">Operational</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-blue/70">Auth Service</span>
                <span className="text-green-600 font-medium">Operational</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-blue/70">Analytics</span>
                <span className="text-green-600 font-medium">Operational</span>
              </li>
            </ul>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
