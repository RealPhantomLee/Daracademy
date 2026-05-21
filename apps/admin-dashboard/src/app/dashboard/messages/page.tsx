import React from "react";
import { prisma } from "@daracademy/database";
import { Card } from "@daracademy/ui";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAdminSession } from "@/lib/auth-guard";

export default async function MessagesPage() {
  const session = await requireAdminSession();

  const adminUser = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!adminUser) {
    return <div>User not found</div>;
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: adminUser.id }, { receiverId: adminUser.id }],
    },
    include: {
      sender: true,
      receiver: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <DashboardLayout session={session}>
      <div className="p-8 space-y-6">
        <section>
          <h1 className="text-3xl font-bold text-navy">Admin Messages</h1>
          <p className="text-slate-blue/70 mt-1">
            View and manage admin communications
          </p>
        </section>

        <Card>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-blue/60">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-blue/10">
                {messages.map((message) => {
                  const isFromAdmin = message.senderId === adminUser.id;

                  return (
                    <div key={message.id} className="py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-navy">
                              {isFromAdmin
                                ? "You"
                                : message.sender.name || message.sender.email}
                            </span>
                            <span className="text-xs text-slate-blue/60">
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-slate-blue/80">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.isRead && (
                            <span className="text-xs text-slate-blue/60">
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
