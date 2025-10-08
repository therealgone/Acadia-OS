import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

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
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
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
      </head>
      <body
        className={`antialiased ${inter.className} `}
      >
        <div className="container mx-auto px-4 lg:px-6 ">{children}</div>
      </body>
    </html>
  );
}
