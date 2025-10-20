"use client";

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Icon from "@/../public/favicon.svg";
import Loading from "../loading";
import { RotateCw } from 'lucide-react';
import { CommandCenter } from "./CommandCenter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Performance optimizations
      gcTime: 1000 * 60 * 60 * 24, // 24 hours default garbage collection
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Prevent unnecessary refetches on window focus
      refetchOnReconnect: true, // Refetch when connection is restored
      refetchOnMount: true, // Refetch on component mount - IMPORTANT for initial data loading
      networkMode: 'online', // Only run queries when online
    },
    mutations: {
      retry: 1, // Retry mutations once
      networkMode: 'online', // Only run mutations when online
    },
  },
});

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== "undefined") {
      const localStoragePersister = createAsyncStoragePersister({
        storage: window.localStorage,
      });

      persistQueryClient({
        persister: localStoragePersister,
        queryClient,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        buster: "v1.0.2",
      });
    }
  }, []);

  if (!isClient) return <Loading />;

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
  const queryClient = useQueryClient();

let lastReloadTime = 0; // store last reload timestamp in ms

const onReload = () => {
  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in ms

  if (now - lastReloadTime >= FIVE_MINUTES) {
    queryClient.invalidateQueries();
    lastReloadTime = now; // update last reload time
    console.log("Data reloaded!");
  } else {
    console.log("Please wait before reloading again.");
  }
};

 return (
  <div className="flex justify-between  w-full text-lg px-5">
    {/* Left side: Title + Sync status */}
      
     <div className=" ">
    <a href="https://www.linkedin.com/in/jeevan-baabu-97a19125b/"></a>
        <Image
          loading="lazy"
          src={Icon}
          width={25}
          height={25}
          alt="Acadia OS Logo"
        />
             
       
      </div>
    <div className="text-center hidden md:block">
      <span className="uppercase text-lg md:lg:xl:text-lg   tracking-widest font-sans font-extrabold  ">
        {path[path.length - 1]}
      </span>

     
    </div>
   

     <div className="flex flex-col justify-center items-center" >
      <button
      onClick={onReload}
      className=" flex rounded-full tag tag-error text-center p-1.5 gap-1    text-sm hover:scale-105 transition-transform duration-200"
    >
      <span className=" flex text-center justify-center items-center">Reload</span>
      <RotateCw size={20}/>
    </button></div>
    
  </div>
);

};



