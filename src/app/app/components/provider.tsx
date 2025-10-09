"use client";

import { QueryClient, QueryClientProvider, useIsFetching, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Icon from "@/../public/favicon.svg";
import { useUserInfo } from "@/hooks/query";
import Loading from "../loading";
import { CommandCenter } from "./CommandCenter";

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
  <div className="relative">
    


    {/* Main content fills entire page */}
    <div className="w-full h-full flex flex-col animate-fadeIn transition-all duration-500 m-0 p-0 relative z-0">
      
      {/* Optional Top Menu */}
      <div className="w-full flex  mt-5 md:lg:xl:mt-5 ">
         <MenuBar/> 
      </div>

      {/* Main dynamic content */}
      <div className="flex  overflow-y-auto pb-44 no-scrollbar">
        {children}
      </div>
      
      {/* Floating Command Center */}
      <div className="fixed bottom-6 right-6 z-50 ">
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
     <div className="flex gap-1 md:lg:xl:gap-4 items-center justify-center ">
        <Image
          loading="lazy"
          src={Icon}
          width={25}
          height={25}
          alt="Acadia OS Logo"
        />
        <span className="leading-none text-sm md:lg:xl:text-lg font-medium">Acadia OS</span>
      </div>
    <div className="flex items-center gap-4">
      <span className="capitalize text-lg md:lg:xl:text-lg font-extrabold text-center items-center">
        {path[path.length - 1]}
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



