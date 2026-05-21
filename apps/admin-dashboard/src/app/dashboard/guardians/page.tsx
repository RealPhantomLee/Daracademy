import React from "react";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAdminSession } from "@/lib/auth-guard";
import Link from "next/link";

export default async function GuardiansPage() {
  const session = await requireAdminSession();

  const guardians = await prisma.user.findMany({
    where: { role: "GUARDIAN" },
    include: {
      guardianProfile: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">
              Guardian Management
            </h1>
            <p className="text-slate-blue/70 mt-1">
              Manage parent and guardian accounts
            </p>
          </div>
          <Link href="/dashboard/guardians/create">
            <Button variant="primary">Add Guardian</Button>
          </Link>
        </section>

        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-blue/20">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Relationship
                </th>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Phone
                </th>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Joined
                </th>
                <th className="px-6 py-3 text-left font-semibold text-navy">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-blue/10">
              {guardians.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-slate-blue/60"
                  >
                    No guardians found
                  </td>
                </tr>
              ) : (
                guardians.map((guardian) => (
                  <tr key={guardian.id} className="hover:bg-slate-blue/5">
                    <td className="px-6 py-4 font-medium text-navy">
                      {guardian.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-blue/80">
                      {guardian.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-blue/80">
                      {guardian.guardianProfile?.relationship || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-blue/80">
                      {guardian.guardianProfile?.emergencyPhone || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-blue/80 text-xs">
                      {new Date(guardian.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/guardians/${guardian.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
