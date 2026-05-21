import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import GradientBackground from "@/components/background/GradientBackground";
import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import NoahWidget from "@/components/integrations/CalendlyEmbed";
import PostHog from "@/components/integrations/PostHog";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daracademy",
  description: "Daracademy - Learn with elegance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const hour = new Date().getHours();
                const theme = hour >= 20 || hour < 7 ? 'night' : 'day';
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <ThemeProvider>
          <CustomCursor />
          <GradientBackground />
          <NavBar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <NoahWidget />
          <PostHog />
        </ThemeProvider>
      </body>
    </html>
  );
}
