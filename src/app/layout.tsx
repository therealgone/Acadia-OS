import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const description =
  "Acadia OS is a modern, secure, and user-friendly academic portal designed to provide students with streamlined access to their timetable, attendance, marks, courses, and calendar..";

export const metadata: Metadata = {
  title: "Acadia OS",
  description,
  authors: [{ name: "Jeevan Baabu Murugan" }],
  keywords: [
    "SRM", "Acadia OS", "SRM KTR", "Attendance", "Timetable", "Calendar", "Student Dashboard" , "academia","academia.srmist","srmist","academia.srmist.edu.in"
  ],
  openGraph: {
    title: "Acadia OS",
    description,
    url: "https://acadia-os.vercel.app",
    siteName: "Acadia OS",
    images: ["/web-app-manifest-512x512.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acadia OS",
    description,
    images: ["/web-app-manifest-512x512.png"],
  },
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
};

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={`antialiased ${inter.className}`}>
        <div>{children}</div>
      </body>
    </html>
  );
}
