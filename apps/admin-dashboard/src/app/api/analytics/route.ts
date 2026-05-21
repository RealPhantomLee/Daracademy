import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalStudents,
      totalTutors,
      totalSessions,
      completedSessions,
      totalPayments,
      averageSessionRating,
      subjectStats,
      studentsByGrade,
      sessionsLast7Days,
      paymentsLast30Days,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.tutoringSession.count(),
      prisma.tutoringSession.count({ where: { status: "COMPLETED" } }),
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
      prisma.tutoringSession.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.payment.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { amount: true },
      }),
    ]);

    const totalPaymentAmount = totalPayments._sum.amount
      ? parseFloat(totalPayments._sum.amount.toString())
      : 0;
    const paymentsLast30 = paymentsLast30Days._sum.amount
      ? parseFloat(paymentsLast30Days._sum.amount.toString())
      : 0;

    return NextResponse.json({
      totalStudents,
      totalTutors,
      totalSessions,
      completedSessions,
      completionRate:
        totalSessions > 0
          ? ((completedSessions / totalSessions) * 100).toFixed(1)
          : 0,
      totalPayments: totalPaymentAmount,
      paymentsLast30Days: paymentsLast30,
      averageRating: averageSessionRating._avg.rating || 0,
      sessionsLast7Days,
      subjectStats,
      studentsByGrade,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
