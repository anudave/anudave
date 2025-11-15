import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAndUnlockAchievements } from '../utils/achievementUtils';
import { useAchievementsStore } from '../store/useAchievementsStore';

export const useProgressStore = create(
  persist(
    (set, get) => ({
      // Store completed challenges: { 'category-day': true }
      completedChallenges: {},
      
      // User's current streak
      currentStreak: 0,
      
      // Last completed date
      lastCompletedDate: null,
      
      // Mark a challenge as completed
      completeChallenge: (categoryId, day) => {
        const challengeKey = `${categoryId}-${day}`;
        const currentDate = new Date().toDateString();
        
        set((state) => ({
          completedChallenges: {
            ...state.completedChallenges,
            [challengeKey]: true,
          },
          lastCompletedDate: currentDate,
        }));
        
        // Update streak
        get().updateStreak();
        
        // Check for achievements after completing a challenge
        setTimeout(() => {
          const progressData = {
            totalCompleted: get().getTotalCompleted(),
            currentStreak: get().currentStreak,
            getCategoryProgress: get().getCategoryProgress,
            completedChallenges: get().completedChallenges,
          };
          
          const achievementsToUnlock = checkAndUnlockAchievements(progressData);
          
          // Unlock the achievements
          if (achievementsToUnlock.length > 0) {
            const { unlockAchievement } = useAchievementsStore.getState();
            achievementsToUnlock.forEach(achievementId => {
              unlockAchievement(achievementId);
            });
            
            // Show notification for new achievements
            if (achievementsToUnlock.length === 1) {
              alert(`🎉 Achievement Unlocked! Check your achievements screen.`);
            } else {
              alert(`🎉 ${achievementsToUnlock.length} achievements unlocked!`);
            }
          }
        }, 100);
      },
      
      // Check if a challenge is completed
      isChallengeCompleted: (categoryId, day) => {
        const challengeKey = `${categoryId}-${day}`;
        return get().completedChallenges[challengeKey] || false;
      },
      
      // Get completion count for a category
      getCategoryProgress: (categoryId) => {
        const challenges = get().completedChallenges;
        const categoryChallenges = Object.keys(challenges).filter(key => 
          key.startsWith(`${categoryId}-`)
        );
        return categoryChallenges.length;
      },
      
      // Update streak logic
      updateStreak: () => {
        const { lastCompletedDate } = get();
        if (!lastCompletedDate) {
          set({ currentStreak: 1 });
          return;
        }
        
        const lastDate = new Date(lastCompletedDate);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          // Consecutive day
          set((state) => ({ currentStreak: state.currentStreak + 1 }));
        } else if (lastDate.toDateString() !== today.toDateString()) {
          // Broken streak
          set({ currentStreak: 1 });
        }
      },
      
      // Get total completed challenges
      getTotalCompleted: () => {
        return Object.keys(get().completedChallenges).length;
      },
      
      // Reset progress (for testing)
      resetProgress: () => {
        set({
          completedChallenges: {},
          currentStreak: 0,
          lastCompletedDate: null,
        });
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);