"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@daracademy/ui";
import { MessageThread } from "@/components/widgets/MessageThread";

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
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const data = await response.json();
        setThreads(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
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

      {/* Filter */}
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

      {/* Messages List */}
      <section>
        {loading ? (
          <Card className="text-center py-12">
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
    </div>
  );
}
