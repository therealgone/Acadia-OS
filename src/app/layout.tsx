import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"

const description =
  "Discover a sleek and modern way to manage your academics - no clutter, just clarity.";

export const metadata: Metadata = {
  title: "Acadia OS",
  description,
  authors: [{ name: "Jeevan Baabu Murugan" }],
  keywords: ["SRM", "Academia", "Acadia OS", "Attendance", "Calendar"],
  openGraph: {
    title: "Acadia OS",
    description,
    url: "",
    siteName: "Acadia OS",
  },
  // Performance optimizations
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Cache control
  other: {
    "Cache-Control": "public, max-age=31536000, immutable",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap", // Optimize font loading
  preload: true, // Preload font for better performance
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className={`antialiased ${inter.className} `}
      >
        <div className="container mx-auto px-4 lg:px-6 ">{children}
           <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
