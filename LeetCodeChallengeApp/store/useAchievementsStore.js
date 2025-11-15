import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAchievementsStore = create(
  persist(
    (set, get) => ({
      // Store unlocked achievements
      unlockedAchievements: {},
      
      // Store achievement progress
      achievementProgress: {},
      
      // Unlock an achievement
      unlockAchievement: (achievementId) => {
        set((state) => ({
          unlockedAchievements: {
            ...state.unlockedAchievements,
            [achievementId]: true,
          },
        }));
      },
      
      // Check if achievement is unlocked
      isAchievementUnlocked: (achievementId) => {
        return get().unlockedAchievements[achievementId] || false;
      },
      
      // Update achievement progress
      updateAchievementProgress: (achievementId, progress) => {
        set((state) => ({
          achievementProgress: {
            ...state.achievementProgress,
            [achievementId]: progress,
          },
        }));
      },
      
      // Get achievement progress
      getAchievementProgress: (achievementId) => {
        return get().achievementProgress[achievementId] || 0;
      },
      
      // Get all unlocked achievements count
      getUnlockedCount: () => {
        return Object.keys(get().unlockedAchievements).length;
      },
      
      // Reset all achievements (for testing)
      resetAchievements: () => {
        set({
          unlockedAchievements: {},
          achievementProgress: {},
        });
      },
    }),
    {
      name: 'achievements-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);