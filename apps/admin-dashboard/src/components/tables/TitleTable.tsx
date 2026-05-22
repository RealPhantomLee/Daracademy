"use client";

import React, { useState } from "react";
import { Button, Badge } from "@daracademy/ui";
import Link from "next/link";

interface Title {
  id: string;
  name: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  description: string | null;
  badge: string | null;
  _count?: {
    users: number;
  };
}

interface TitleTableProps {
  titles: Title[];
}

export const TitleTable: React.FC<TitleTableProps> = ({ titles }) => {
  const [sortField, setSortField] = useState<"name" | "tier">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const tierColors: Record<string, string> = {
    BRONZE: "bg-amber-100 text-amber-800",
    SILVER: "bg-gray-100 text-gray-800",
    GOLD: "bg-yellow-100 text-yellow-800",
    PLATINUM: "bg-blue-100 text-blue-800",
  };

  const sorted = [...titles].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (!aVal || !bVal) return 0;

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: "name" | "tier") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-blue/20">
        <table className="w-full text-sm">
          <thead className="bg-slate-blue/5 border-b border-slate-blue/20">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Badge
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("name")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by title name"
                  aria-pressed={sortField === "name"}
                >
                  Name{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                <button
                  onClick={() => toggleSort("tier")}
                  className="hover:text-slate-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded px-2 py-1"
                  aria-label="Sort by tier"
                  aria-pressed={sortField === "tier"}
                >
                  Tier{" "}
                  {sortField === "tier" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Description
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Earned By
              </th>
              <th className="px-6 py-3 text-left font-semibold text-navy">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-blue/10">
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-slate-blue/60"
                >
                  No titles found
                </td>
              </tr>
            ) : (
              sorted.map((title) => (
                <tr key={title.id} className="hover:bg-slate-blue/5">
                  <td className="px-6 py-4 text-center text-2xl">
                    {title.badge || "🏅"}
                  </td>
                  <td className="px-6 py-4 font-medium text-navy">
                    {title.name}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="primary"
                      size="sm"
                      className={tierColors[title.tier] || ""}
                    >
                      {title.tier}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80 text-xs max-w-xs truncate">
                    {title.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-blue/80 font-medium">
                    {title._count?.users || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/dashboard/titles/${title.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`Edit title ${title.name}`}
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-slate-blue/60">
        Total: {titles.length} titles
      </div>
    </div>
  );
};
