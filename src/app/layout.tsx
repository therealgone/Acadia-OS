import type { Metadata } from "next";
// Using CSS @import for Doto with ROND per request
import "./globals.css";
import { Inter } from "next/font/google";
// import { TallyModalRoot } from "./TallyModalRoot";


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
    images: [
      {
        url: "/Landing/BigScreen.png",
        width: 1200,
        height: 630,
        alt: "Acadia OS",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "",
    title: "Acadia OS",
    description,
    creator: "",
    images: [
      {
        url: "/Landing/BigScreen.png",
        width: 1200,
        height: 630,
        alt: "Acadia OS",
        type: "image/png",
      },
    ],
  },
};

const inter = Inter({ subsets: ["latin"], weight: ["400","500","600","700","800"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Using next/font to self-host Doto */}
      </head>
      <body className={`antialiased overflow-hidden ${inter.className}`}>
        <div className="pointer-events-none fixed inset-0 -z-10" id="mouse-layer">
          <div className="mouse-gradient" id="mouse-gradient" />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var mg=document.getElementById('mouse-gradient');
                if(!mg) return;
                function onMove(e){
                  var x=e.clientX, y=e.clientY;
                  mg.style.setProperty('--mx', x+'px');
                  mg.style.setProperty('--my', y+'px');
                }
                window.addEventListener('mousemove', onMove, { passive: true });
              })();
            `,
          }}
        />
        {/* <TallyModalRoot /> */}

        {children}
      </body>
    </html>
  );
}
