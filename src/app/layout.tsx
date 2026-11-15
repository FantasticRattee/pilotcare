import Navigation from "@/components/Navigation";
import type { Metadata } from "next";
import { Barlow, Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

// Barlow comes from the lettering of road signs and instrument panels:
// it stays readable at a glance, which is how a pilot reads this app.
const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// The narrower cut is used for headings and for numbers.
const display = Barlow_Semi_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PilotCare - Pilot Health & Compliance Management",
  description: "Comprehensive pilot fatigue management, flight duty tracking, and health monitoring system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        <Navigation />
        {/* Phone-sized app container */}
        <main className="mx-auto min-h-screen max-w-md border-x border-line bg-surface pb-24 pt-[57px]">
          {children}
        </main>
      </body>
    </html>
  );
}
