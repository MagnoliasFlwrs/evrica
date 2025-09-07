import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
}

export const useSidebar = create<SidebarStore>()(
    persist(
        (set) => ({
            sidebarOpen: false,
            setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        {
            name: 'sidebar-storage',

        }
    )
);