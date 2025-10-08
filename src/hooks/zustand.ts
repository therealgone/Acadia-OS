import { create } from "zustand";
import { useSyncExternalStore } from "react";

// Sidebar state
type SidebarState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

// Auth state
export type UseAuthType = {
  email: {
    mail: string;
    digest: string;
    identifier: string;
  };
  setEmail: (email: {
    mail: string;
    digest: string;
    identifier: string;
  }) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
};

// Zustand store for authentication
export const useAuth = create<UseAuthType>((set) => ({
  email: {
    mail: "",
    digest: "",
    identifier: "",
  },
  setEmail: (email: { mail: string; digest: string; identifier: string }) =>
    set((state) => ({ ...state, email })),
  error: "",
  setError: (error: string) => set((state) => ({ ...state, error })),
  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),
}));

// Screen size hook
export function useScreen() {
  const isMobile = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      callback();
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    () => {
      if (typeof window === "undefined") return true;
      return window.innerWidth <= 1560;
    },
    () => true
  );
  return { isMobile };
}

// Sidebar store
export const useSidebar = create<SidebarState>((set) => ({
  isOpen: false,
  setOpen: (open: boolean) => set({ isOpen: open }),
}));


export const useOptionalClasses = create(() => ({}));
