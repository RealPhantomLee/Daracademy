import React from "react";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TitleTable } from "@/components/tables/TitleTable";
import { requireAdminSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function TitlesPage() {
  const session = await requireAdminSession();

  const titles = await prisma.title.findMany({
    include: {
      _count: {
        select: { users: true },
      },
    },
    orderBy: { tier: "desc" },
  });

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Achievement Titles</h1>
            <p className="text-slate-blue/70 mt-1">
              Manage the achievement title system
            </p>
          </div>
          <Link href="/dashboard/titles/create">
            <Button variant="primary">Create Title</Button>
          </Link>
        </section>

        <Card>
          <TitleTable titles={titles} />
        </Card>
      </div>
    </DashboardLayout>
  );
}
