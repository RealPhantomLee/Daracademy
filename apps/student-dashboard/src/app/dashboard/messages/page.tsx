"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@daracademy/ui";
import { MessageThread } from "@/components/widgets/MessageThread";
import { apiGet, getErrorMessage, isAuthError } from "@daracademy/api-schema";
import type { ApiResponse } from "@daracademy/api-schema";

interface MessageThreadData {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead: boolean;
  unreadCount: number;
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThreadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet<MessageThreadData[]>("/api/messages");

      if (!response.success) {
        const errorMessage = getErrorMessage(response);
        setError(errorMessage);

        if (isAuthError(response)) {
          window.location.href = "/auth/signin";
        }
        return;
      }

      setThreads(response.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch messages";
      setError(message);
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredThreads =
    filter === "UNREAD" ? threads.filter((t) => t.unreadCount > 0) : threads;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Messages</h1>
        <p className="text-slate-blue/70">
          Communicate with your tutors and guardians.
        </p>
      </section>

      {/* Error State */}
      {error && (
        <section>
          <Card className="p-4 bg-red-50 border border-red-200">
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-red-700 text-white rounded text-sm font-medium hover:bg-red-800 transition-colors"
            >
              Try Again
            </button>
          </Card>
        </section>
      )}

      {/* Filter */}
      {!error && (
        <section className="flex gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "ALL"
                ? "bg-navy text-ivory"
                : "bg-slate-blue/10 text-navy hover:bg-slate-blue/20"
            }`}
          >
            All Messages ({threads.length})
          </button>
          <button
            onClick={() => setFilter("UNREAD")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "UNREAD"
                ? "bg-navy text-ivory"
                : "bg-slate-blue/10 text-navy hover:bg-slate-blue/20"
            }`}
          >
            Unread ({threads.filter((t) => t.unreadCount > 0).length})
          </button>
        </section>
      )}

      {/* Messages List */}
      {!error && (
        <section>
          {loading ? (
            <Card className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
              </div>
              <p className="text-slate-blue/60">Loading messages...</p>
            </Card>
          ) : filteredThreads.length > 0 ? (
            <div className="space-y-3 max-w-2xl">
              {filteredThreads.map((thread) => (
                <div key={thread.id} className="relative">
                  <MessageThread
                    id={thread.id}
                    senderName={thread.senderName}
                    senderImage={thread.senderImage}
                    lastMessage={thread.lastMessage}
                    lastMessageTime={new Date(thread.lastMessageTime)}
                    isRead={thread.isRead}
                    unreadCount={thread.unreadCount}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-slate-blue/60">
                {filter === "UNREAD"
                  ? "No unread messages."
                  : "No messages yet. Start a conversation with your tutor!"}
              </p>
            </Card>
          )}
        </section>
      )}
    </div>
  );
}
