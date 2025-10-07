import React from "react";
import { Metadata } from "next";
import QueryProvider from "./components/provider";
export const runtime = "edge";
export const metadata: Metadata = {
  title: "App",
  description: "App Route",
};

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="max-w-7xl mx-auto w-full px-2 lg:px-5 py-4">
        {children}
      </div>
    </QueryProvider>
  );
}
