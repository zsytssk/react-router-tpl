import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useThemeMode = create(
  persist<{
    isDark: boolean;
    updateThemeMode: (isDark: boolean) => void;
    menuCollapsed: boolean;
    updateMenuCollapsed: (collapsed: boolean) => void;
  }>(
    (set) => ({
      isDark: true,
      updateThemeMode: (isDark: boolean) => set({ isDark }),
      menuCollapsed: false,
      updateMenuCollapsed: (collapsed: boolean) =>
        set({ menuCollapsed: collapsed }),
    }),
    {
      name: 'theme-modde',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
