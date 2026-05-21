import React from "react";
import { prisma } from "@daracademy/database";
import { Card } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAdminSession } from "@/lib/auth-guard";

export default async function AnalyticsPage() {
  const session = await requireAdminSession();

  const [
    totalStudents,
    totalTutors,
    totalSessions,
    completedSessions,
    totalPayments,
    averageSessionRating,
    subjectStats,
    studentsByGrade,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TUTOR" } }),
    prisma.tutoringSession.count(),
    prisma.tutoringSession.count({
      where: { status: "COMPLETED" },
    }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.sessionFeedback.aggregate({
      _avg: { rating: true },
    }),
    prisma.tutoringSession.groupBy({
      by: ["subject"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.studentProfile.groupBy({
      by: ["gradeLevel"],
      _count: { id: true },
      orderBy: { gradeLevel: "asc" },
    }),
  ]);

  const totalPaymentAmount = totalPayments._sum.amount
    ? parseFloat(totalPayments._sum.amount.toString())
    : 0;
  const avgRating = averageSessionRating._avg.rating || 0;
  const completionRate =
    totalSessions > 0
      ? ((completedSessions / totalSessions) * 100).toFixed(1)
      : 0;

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-8">
        <section>
          <h1 className="text-3xl font-bold text-navy">Analytics</h1>
          <p className="text-slate-blue/70 mt-1">
            Platform usage and performance metrics
          </p>
        </section>

        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <p className="text-3xl font-bold text-navy">{totalStudents}</p>
            <p className="text-slate-blue/60 text-sm mt-2">Total Students</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-navy">{totalTutors}</p>
            <p className="text-slate-blue/60 text-sm mt-2">Total Tutors</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-navy">{totalSessions}</p>
            <p className="text-slate-blue/60 text-sm mt-2">Total Sessions</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-gold">
              ${totalPaymentAmount.toFixed(0)}
            </p>
            <p className="text-slate-blue/60 text-sm mt-2">Total Revenue</p>
          </Card>
        </section>

        {/* Performance Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold text-navy mb-4">Session Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Completion Rate</span>
                <span className="font-bold text-navy">{completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Completed Sessions</span>
                <span className="font-bold text-navy">{completedSessions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Avg Rating</span>
                <span className="font-bold text-navy">
                  {avgRating.toFixed(1)} / 5
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Active Users</span>
                <span className="font-bold text-navy">
                  {totalStudents + totalTutors}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Tutor Ratio</span>
                <span className="font-bold text-navy">
                  1:
                  {totalTutors > 0
                    ? (totalStudents / totalTutors).toFixed(1)
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Status</span>
                <span className="text-green-600 font-bold">Operational</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy mb-4">Financial</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Total Payments</span>
                <span className="font-bold text-navy">
                  ${totalPaymentAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-blue/70">Avg Per Session</span>
                <span className="font-bold text-navy">
                  $
                  {completedSessions > 0
                    ? (totalPaymentAmount / completedSessions).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* Subject Popularity */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-semibold text-navy mb-4">Top Subjects</h3>
            <div className="space-y-2">
              {subjectStats.length === 0 ? (
                <p className="text-slate-blue/60">No sessions yet</p>
              ) : (
                subjectStats.map((stat) => (
                  <div
                    key={stat.subject || "unknown-subject"}
                    className="flex justify-between items-center pb-2 border-b border-slate-blue/10"
                  >
                    <span className="text-slate-blue/80">
                      {stat.subject || "Unknown"}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-blue/10 rounded">
                        <div
                          className="h-full bg-navy rounded"
                          style={{
                            width: `${(stat._count.id / Math.max(...subjectStats.map((s) => s._count.id), 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium text-navy w-8 text-right">
                        {stat._count.id}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-navy mb-4">Students by Grade</h3>
            <div className="space-y-2">
              {studentsByGrade.length === 0 ? (
                <p className="text-slate-blue/60">No grade data</p>
              ) : (
                studentsByGrade.map((stat) => (
                  <div
                    key={`grade-${stat.gradeLevel}`}
                    className="flex justify-between items-center pb-2 border-b border-slate-blue/10"
                  >
                    <span className="text-slate-blue/80">
                      Grade {stat.gradeLevel}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-blue/10 rounded">
                        <div
                          className="h-full bg-gold rounded"
                          style={{
                            width: `${(stat._count.id / Math.max(...studentsByGrade.map((s) => s._count.id), 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-medium text-navy w-8 text-right">
                        {stat._count.id}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
