import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/colors';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      
      toggleTheme: () => {
        const newIsDarkMode = !get().isDarkMode;
        set({
          isDarkMode: newIsDarkMode,
        });
      },
      
      setTheme: (isDark) => {
        set({
          isDarkMode: isDark,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to get colors based on current theme
export const useColors = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? DARK_COLORS : LIGHT_COLORS;
};