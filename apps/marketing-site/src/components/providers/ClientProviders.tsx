"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import GradientBackground from "@/components/background/GradientBackground";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import { NoahWidget } from "@daracademy/noah-engine";
import PostHog from "@/components/integrations/PostHog";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CustomCursor />
      <GradientBackground />
      <NavBar />
      <main className="relative z-10">{children}</main>
      <Footer />
      <NoahWidget />
      <PostHog />
    </ThemeProvider>
  );
}
