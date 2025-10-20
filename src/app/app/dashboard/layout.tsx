import { Metadata } from "next";
export const runtime = "nodejs";
export const dynamic = "force-static";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Quick Insight",
   keywords: ["GPA calculator", "SRM attendance", "SRM marks", "student dashboard"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full ">{children}</div>;
}
