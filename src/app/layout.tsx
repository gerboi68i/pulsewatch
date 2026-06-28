import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://pulsewatch-five.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PulseWatch - Uptime and Status Monitoring",
    template: "%s - PulseWatch",
  },
  description:
    "Monitor your websites and APIs around the clock, detect incidents instantly, and share a status page your users can trust.",
  keywords: ["uptime monitoring", "status page", "incident tracking", "response time", "website monitoring", "open source", "Next.js"],
  applicationName: "PulseWatch",
  openGraph: {
    type: "website",
    siteName: "PulseWatch",
    url: SITE_URL,
    title: "PulseWatch - Uptime and Status Monitoring",
    description:
      "Monitor your websites and APIs around the clock, detect incidents instantly, and share a status page your users can trust.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseWatch - Uptime and Status Monitoring",
    description: "Open-source uptime and status monitoring for developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
