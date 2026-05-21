"use client";

import React from "react";
import { Card, Badge } from "@daracademy/ui";
import { PaymentStatus } from "@daracademy/database";

interface PaymentRecord {
  id: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  description?: string;
}

interface PaymentHistoryTableProps {
  payments: PaymentRecord[];
}

const statusColors: Record<
  PaymentStatus,
  "success" | "warning" | "error" | "default"
> = {
  PENDING: "warning",
  COMPLETED: "success",
  FAILED: "error",
  REFUNDED: "default",
};

const statusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  payments,
}) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-blue/10">
              <th className="text-left py-3 px-4 font-semibold text-navy">
                Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-navy">
                Description
              </th>
              <th className="text-right py-3 px-4 font-semibold text-navy">
                Amount
              </th>
              <th className="text-center py-3 px-4 font-semibold text-navy">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => {
                const date = new Date(payment.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-blue/5 hover:bg-slate-blue/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-slate-blue/70">{date}</td>
                    <td className="py-3 px-4 text-slate-blue/70">
                      {payment.description || "Tutoring Session"}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-navy">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={statusColors[payment.status]} size="sm">
                        {statusLabels[payment.status]}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 px-4 text-center text-slate-blue/60"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
