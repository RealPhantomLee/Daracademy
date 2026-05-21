import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { prisma } from "@daracademy/database";
import { Card, Button } from "@daracademy/ui";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  // Fetch guardian user
  const guardian = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!guardian) {
    return <div>Guardian not found</div>;
  }

  // Fetch received messages
  const receivedMessages = await prisma.message.findMany({
    where: {
      receiverId: guardian.id,
    },
    include: {
      sender: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch sent messages
  const sentMessages = await prisma.message.findMany({
    where: {
      senderId: guardian.id,
    },
    include: {
      receiver: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Group messages by conversation
  interface ConversationMessage {
    id: string;
    content: string;
    createdAt: Date;
    senderId: string;
    receiverId: string;
    isRead: boolean;
    senderName?: string;
    receiverName?: string;
  }

  const conversations = new Map<string, ConversationMessage[]>();

  receivedMessages.forEach((msg) => {
    const key = msg.senderId; // conversation key
    if (!conversations.has(key)) {
      conversations.set(key, []);
    }
    conversations.get(key)!.push({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      isRead: msg.isRead,
      senderName: msg.sender.name || undefined,
    });
  });

  sentMessages.forEach((msg) => {
    const key = msg.receiverId; // conversation key
    if (!conversations.has(key)) {
      conversations.set(key, []);
    }
    conversations.get(key)!.push({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      isRead: msg.isRead,
      receiverName: msg.receiver.name || undefined,
    });
  });

  // Get unique contacts
  const contacts = new Set<string>();
  receivedMessages.forEach((msg) => {
    contacts.add(msg.sender.id);
  });
  sentMessages.forEach((msg) => {
    contacts.add(msg.receiver.id);
  });

  const unreadCount = receivedMessages.filter((m) => !m.isRead).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold text-navy mb-2">Messages</h1>
        <p className="text-slate-blue/70">
          Communicate with tutors and discuss student progress.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{unreadCount}</p>
          <p className="text-slate-blue/60 text-sm mt-2">Unread Messages</p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">{contacts.size}</p>
          <p className="text-slate-blue/60 text-sm mt-2">
            Active Conversations
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-4xl font-bold text-navy">
            {receivedMessages.length + sentMessages.length}
          </p>
          <p className="text-slate-blue/60 text-sm mt-2">Total Messages</p>
        </Card>
      </section>

      {/* Message List */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy">Conversations</h2>
          <Button variant="primary" size="sm" onClick={() => {}}>
            New Message
          </Button>
        </div>

        <Card>
          {receivedMessages.length > 0 || sentMessages.length > 0 ? (
            <div className="space-y-0 divide-y divide-slate-blue/10">
              {Array.from(conversations.entries())
                .sort((a, b) => {
                  const aLatest = a[1][0];
                  const bLatest = b[1][0];
                  return (
                    new Date(bLatest.createdAt).getTime() -
                    new Date(aLatest.createdAt).getTime()
                  );
                })
                .map(([contactId, messages]) => {
                  const latestMessage = messages[0];
                  const contactName =
                    latestMessage.senderId === guardian.id
                      ? latestMessage.receiverName || "User"
                      : latestMessage.senderName || "User";
                  const isUnread =
                    latestMessage.receiverId === guardian.id &&
                    !latestMessage.isRead;

                  const truncatedContent =
                    latestMessage.content.length > 100
                      ? latestMessage.content.substring(0, 100) + "..."
                      : latestMessage.content;

                  return (
                    <div
                      key={contactId}
                      className={`p-4 hover:bg-slate-blue/5 transition-colors cursor-pointer ${
                        isUnread ? "bg-slate-blue/3" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={`font-medium ${
                            isUnread ? "text-navy font-semibold" : "text-navy"
                          }`}
                        >
                          {contactName}
                        </h3>
                        <span className="text-xs text-slate-blue/50">
                          {new Date(
                            latestMessage.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm line-clamp-2 ${
                          isUnread
                            ? "text-navy font-medium"
                            : "text-slate-blue/70"
                        }`}
                      >
                        {latestMessage.senderId === guardian.id ? "You: " : ""}
                        {truncatedContent}
                      </p>
                      {isUnread && (
                        <div className="mt-2">
                          <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-blue/60 mb-4">
                No messages yet. Start a conversation with a tutor.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mx-auto"
                onClick={() => {}}
              >
                Send First Message
              </Button>
            </div>
          )}
        </Card>
      </section>

      {/* Compose Message Section */}
      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">Send a Message</h2>
        <Card>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Recipient
              </label>
              <select className="w-full px-4 py-2 border border-slate-blue/20 rounded-lg text-slate-blue focus:outline-none focus:border-blue-500">
                <option value="">Select a tutor or student...</option>
                {/* Options would be populated from available contacts */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Message
              </label>
              <textarea
                placeholder="Type your message here..."
                rows={6}
                className="w-full px-4 py-2 border border-slate-blue/20 rounded-lg text-slate-blue focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle message submission
                }}
              >
                Send Message
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
