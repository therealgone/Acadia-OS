"use client";

import { QueryClient, QueryClientProvider, useIsFetching, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { useScreen } from "@/hooks/zustand";
import { usePathname } from "next/navigation";
import { Loader, LogOut } from "lucide-react";
import { useUserInfo } from "@/hooks/query";
import Loading from "../loading";
import Link from "next/link";
import { CommandCenter } from "./CommandCenter";
import path from "path";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useScreen();

  if (typeof window === "undefined") return <Loading />;

  const localStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
  });

  persistQueryClient({
    persister: localStoragePersister,
    queryClient,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    buster: "v1.0.2",
  });

  return (
<QueryClientProvider client={queryClient}>
  <div className="">
    
    {/* Top-right Profile Icon */}
    <div className="fixed top-6 right-6 z-50">
      <ProfileIcon />
    </div>

    {/* Main content fills entire page */}
    <div className="w-full h-full flex flex-col animate-fadeIn transition-all duration-500 m-0 p-0">
      
      {/* Optional Top Menu */}
      <div className="w-full flex  mt-24">
         <MenuBar/> 
      </div>

      {/* Main dynamic content */}
      <div className="">
        {children}
      </div>
      
      {/* Floating Command Center */}
      <div className="fixed bottom-6 right-6 z-50">
        <CommandCenter />
      </div>
      
    </div>

    <ReactQueryDevtools initialIsOpen={false} />
  </div>
</QueryClientProvider>



  );
};

export default QueryProvider;

// ===== MenuBar Component =====
const MenuBar = () => {
  const path = usePathname().split("/");
  const isFetching = useIsFetching();
  const queryClient = useQueryClient();

  const onReload = () => {
    queryClient.invalidateQueries();
  };

 return (
  <div className="flex justify-between items-center w-full text-lg">
    {/* Left side: Title + Sync status */}
    <div className="flex items-center gap-4">
      <span className="capitalize font-extrabold">
        {path[path.length - 1]}
      </span>

      <span
        className={`tag ${
          isFetching ? "tag-success" : "tag-info"
        } flex items-center gap-2 text-xs`}
      >
        {isFetching ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 text-[color:var(--success)]"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-80"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Syncing
          </>
        ) : (
          <>Up to date</>
        )}
      </span>
    </div>

    {/* Right side: Reload button */}
    <button
      onClick={onReload}
      className="px-3 py-1 rounded-full att-red border flex items-center  text-sm hover:scale-105 transition-transform duration-200"
    >
      Reload
    </button>
  </div>
);

};

// ===== ProfileIcon Component =====
const ProfileIcon = () => {
  const [toggle, setToggle] = useState(false);
  const { data } = useUserInfo();
  const iconRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toggle) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropRef.current &&
        !dropRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggle]);

  return (
    <div
      ref={iconRef}
      className={`relative w-10 h-10 shadow-2xl flex items-center justify-center font-semibold cursor-pointer rounded-full border border-white/10 bg-white/5 hover-glow-blue transition-all duration-300 ${
        !toggle && "hover:scale-110"
      }`}
      onClick={() => setToggle((prev) => !prev)}
    >
      {data?.name
        ?.split(" ")
        .map((i) => i[0])
        .join("")
        .slice(0, 2)}
      {toggle && <ProfileDrop dropRef={dropRef as React.RefObject<HTMLDivElement>} />}
    </div>
  );
};

// ===== ProfileDrop Component =====
const ProfileDrop = ({ dropRef }: { dropRef: React.RefObject<HTMLDivElement> }) => {
  return (
    <div
      ref={dropRef}
      className="absolute top-14 right-0 w-48 bg-white/5 backdrop-blur-lg rounded-lg border border-white/5 z-50 flex flex-col shadow-2xl overflow-hidden animate-slideDown"
    >
      <a
        href="/auth/logout"
        className="w-full px-4 py-3 flex justify-between items-center font-medium text-red-400 hover:bg-white/10 transition-colors duration-200"
      >
        <span>Log Out</span>
        <LogOut className="w-5 h-5" />
      </a>
    </div>
  );
};
