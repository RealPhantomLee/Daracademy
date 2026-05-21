"use client";

import React from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@daracademy/ui";
import { Avatar } from "@daracademy/ui";

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || "";

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/signin" });
  };

  return (
    <header className="bg-ivory border-b border-slate-blue/20 px-8 py-4 flex items-center justify-between">
      {/* Left: Title */}
      <div>
        <h2 className="text-2xl font-bold text-navy">Dashboard</h2>
        <p className="text-sm text-slate-blue/60">Welcome back!</p>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-navy">{userName}</p>
            <p className="text-xs text-slate-blue/60">{userEmail}</p>
          </div>
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <Avatar size="md" initials={userName.charAt(0)} />
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
};
