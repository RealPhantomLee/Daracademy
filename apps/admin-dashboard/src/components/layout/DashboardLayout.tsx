"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { ErrorBoundary, SkipLink } from "@daracademy/ui";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NoahWidget } from "@daracademy/noah-engine";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  session,
}) => {
  return (
    <SessionProvider session={session}>
      <SkipLink />
      <ErrorBoundary>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main id="main-content" className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Noah Widget - Fixed bottom-right, z-50 */}
        <NoahWidget enabled={true} />
      </ErrorBoundary>
    </SessionProvider>
  );
};
