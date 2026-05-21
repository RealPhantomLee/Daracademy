"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@daracademy/ui";

export const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-slate-blue/10 px-8 flex items-center justify-between">
      <div>
        <h2 className="text-sm text-slate-blue/60">Welcome</h2>
        <p className="text-lg font-medium text-navy">
          {session?.user?.name || "Guardian"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-blue/60">
          {session?.user?.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
};
