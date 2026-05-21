import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@daracademy/auth";
import { redirect } from "next/navigation";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guardian Dashboard | DarAcademy",
  description:
    "Parent/Guardian dashboard for monitoring student progress on DarAcademy",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  // Redirect to signin if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ivory`}
      >
        <DashboardLayout session={session}>{children}</DashboardLayout>
      </body>
    </html>
  );
}
