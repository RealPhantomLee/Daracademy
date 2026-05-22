import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card } from "@daracademy/ui";
import { PaymentHistoryTable } from "@/components/widgets/PaymentHistoryTable";

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

export default async function PaymentsPage() {
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

  // Fetch all payments for this guardian
  const payments = await prisma.payment.findMany({
    where: {
      userId: guardian.id,
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const pendingPayments = payments.filter((p) => p.status === "PENDING");
  const failedPayments = payments.filter((p) => p.status === "FAILED");

  const totalPaid = completedPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.toString()),
    0,
  );

  const totalPending = pendingPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.toString()),
    0,
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Payment History</h1>
        <p className="text-slate-blue/70">
          View and manage your tutoring payments and invoices.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{payments.length}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Total Payments</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-gold">
            ${totalPaid.toFixed(2)}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Amount Paid</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">
            {pendingPayments.length}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Pending</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">
            ${totalPending.toFixed(2)}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Pending Amount</p>
        </Card>
      </section>

      {/* Payment Table */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">All Payments</h2>
        <PaymentHistoryTable
          payments={payments.map((p) => ({
            id: p.id,
            amount: parseFloat(p.amount.toString()),
            status: p.status,
            createdAt: p.createdAt,
            description: p.description || undefined,
          }))}
        />
      </section>

      {/* Invoice Section */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">Invoices</h2>
        <Card>
          <p className="text-slate-blue/70 mb-4">
            Invoices are automatically generated when payments are completed.
            You can download them below.
          </p>

          {completedPayments.length > 0 ? (
            <div className="space-y-2">
              {completedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-3 bg-slate-blue/5 rounded-lg border border-slate-blue/10"
                >
                  <div>
                    <p className="font-medium text-navy">
                      Invoice #{payment.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-blue/60">
                      {new Date(payment.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {" • "}${parseFloat(payment.amount.toString()).toFixed(2)}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="text-navy hover:text-slate-blue font-medium text-sm transition-colors"
                  >
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-blue/60 text-center py-6">
              No invoices available yet
            </p>
          )}
        </Card>
      </section>

      {/* Failed Payments Notice */}
      {failedPayments.length > 0 && (
        <section className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-700 mb-2">Failed Payments</h3>
          <p className="text-red-600 text-sm mb-4">
            You have {failedPayments.length} failed payment(s). Please retry or
            update your payment method.
          </p>
          <div className="space-y-2">
            {failedPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-2 bg-white rounded"
              >
                <span className="text-sm text-red-700">
                  ${parseFloat(payment.amount.toString()).toFixed(2)} on{" "}
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
                <a
                  href="#"
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Retry
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
