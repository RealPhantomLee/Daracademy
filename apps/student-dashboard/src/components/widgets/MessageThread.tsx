"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@daracademy/ui";

interface MessageThreadProps {
  id: string;
  senderName: string;
  senderImage?: string;
  lastMessage: string;
  lastMessageTime: Date;
  isRead: boolean;
  unreadCount?: number;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  id,
  senderName,
  senderImage,
  lastMessage,
  lastMessageTime,
  isRead,
  unreadCount = 0,
}) => {
  const timeAgo = new Date(lastMessageTime);
  const now = new Date();
  const diffMs = now.getTime() - timeAgo.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeLabel = "";
  if (diffMins < 1) {
    timeLabel = "now";
  } else if (diffMins < 60) {
    timeLabel = `${diffMins}m ago`;
  } else if (diffHours < 24) {
    timeLabel = `${diffHours}h ago`;
  } else {
    timeLabel = `${diffDays}d ago`;
  }

  return (
    <a
      href={`/dashboard/messages/${id}`}
      className="block no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-lg"
      aria-label={`Open conversation with ${senderName}. Last message: ${lastMessage}. ${unreadCount > 0 ? `${unreadCount} unread messages` : ""}`}
    >
      <Card
        className={`transition-all hover:shadow-md ${
          !isRead ? "border-navy border-2" : "border-slate-blue/20"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {senderImage ? (
              <Image
                src={senderImage}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
                aria-hidden="true"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full bg-slate-blue/10 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="text-navy font-semibold">
                  {senderName.charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold ${!isRead ? "text-navy" : "text-navy"}`}
              >
                {senderName}
              </h3>
              <p className="text-sm text-slate-blue/60 line-clamp-2">
                {lastMessage}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 ml-4">
            <p className="text-xs text-slate-blue/50 whitespace-nowrap">
              {timeLabel}
            </p>
            {unreadCount > 0 && (
              <span
                className="bg-navy text-ivory text-xs font-semibold px-2 py-1 rounded-full"
                aria-label={`${unreadCount} unread messages`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </div>
      </Card>
    </a>
  );
};
