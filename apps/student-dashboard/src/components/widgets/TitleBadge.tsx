"use client";

import React from "react";
import { Badge } from "@daracademy/ui";

interface TitleBadgeProps {
  title: string;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  earnedAt?: Date;
  size?: "sm" | "md";
}

const tierColors: Record<string, "success" | "primary" | "gold" | "default"> = {
  BRONZE: "default",
  SILVER: "primary",
  GOLD: "gold",
  PLATINUM: "success",
};

const tierEmojis: Record<string, string> = {
  BRONZE: "🥉",
  SILVER: "🥈",
  GOLD: "🥇",
  PLATINUM: "✨",
};

export const TitleBadge: React.FC<TitleBadgeProps> = ({
  title,
  tier,
  earnedAt,
  size = "md",
}) => {
  const formattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge variant={tierColors[tier]} size={size}>
        <span className="mr-1">{tierEmojis[tier]}</span>
        {title}
      </Badge>
      {formattedDate && (
        <p className="text-xs text-slate-blue/50">Earned {formattedDate}</p>
      )}
    </div>
  );
};
