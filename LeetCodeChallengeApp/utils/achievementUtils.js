import { ACHIEVEMENTS } from '../constants/achievements';

// Check and unlock achievements based on user progress
// This function now takes progress data as parameters instead of importing stores
export const checkAndUnlockAchievements = (progressData) => {
  const { 
    totalCompleted, 
    currentStreak, 
    getCategoryProgress,
    completedChallenges 
  } = progressData;

  // We'll return the achievements that should be unlocked
  const achievementsToUnlock = [];

  // Check completion achievements
  const completionAchievements = checkCompletionAchievements(totalCompleted);
  achievementsToUnlock.push(...completionAchievements);
  
  // Check streak achievements
  const streakAchievements = checkStreakAchievements(currentStreak);
  achievementsToUnlock.push(...streakAchievements);
  
  // Check category achievements
  const categoryAchievements = checkCategoryAchievements(getCategoryProgress);
  achievementsToUnlock.push(...categoryAchievements);
  
  // Check special achievements
  const specialAchievements = checkSpecialAchievements(completedChallenges);
  achievementsToUnlock.push(...specialAchievements);
  
  return achievementsToUnlock;
};

const checkCompletionAchievements = (totalCompleted) => {
  const completionAchievements = Object.values(ACHIEVEMENTS).filter(a => a.type === 'completion');
  const unlocked = [];
  
  completionAchievements.forEach(achievement => {
    if (totalCompleted >= achievement.requirement) {
      unlocked.push(achievement.id);
    }
  });
  
  return unlocked;
};

const checkStreakAchievements = (currentStreak) => {
  const streakAchievements = Object.values(ACHIEVEMENTS).filter(a => a.type === 'streak');
  const unlocked = [];
  
  streakAchievements.forEach(achievement => {
    if (currentStreak >= achievement.requirement) {
      unlocked.push(achievement.id);
    }
  });
  
  return unlocked;
};

const checkCategoryAchievements = (getCategoryProgress) => {
  const categoryAchievements = Object.values(ACHIEVEMENTS).filter(a => a.type === 'category');
  const unlocked = [];
  
  categoryAchievements.forEach(achievement => {
    const categoryProgress = getCategoryProgress(achievement.category);
    if (categoryProgress >= achievement.requirement) {
      unlocked.push(achievement.id);
    }
  });
  
  return unlocked;
};

const checkSpecialAchievements = (completedChallenges) => {
  const unlocked = [];
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const today = new Date();
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  // Early Bird achievement (before 8 AM)
  if (currentHour < 8) {
    unlocked.push('early_bird');
  }
  
  // Night Owl achievement (after 10 PM)
  if (currentHour >= 22) {
    unlocked.push('night_owl');
  }
  
  // Weekend Warrior achievement
  if (isWeekend && Object.keys(completedChallenges).length > 0) {
    unlocked.push('weekend_warrior');
  }
  
  return unlocked;
};

// Get achievement progress percentage (now takes current progress as parameter)
export const getAchievementProgress = (achievementId, currentProgress, isUnlocked) => {
  const achievement = ACHIEVEMENTS[achievementId];
  
  if (!achievement) return 0;
  
  if (isUnlocked) {
    return 100;
  }
  
  const progress = currentProgress || 0;
  return Math.min((progress / achievement.requirement) * 100, 100);
};

// Get unlocked achievements count by type
export const getUnlockedCountByType = (unlockedAchievements, type) => {
  const typeAchievements = Object.values(ACHIEVEMENTS).filter(a => a.type === type);
  return typeAchievements.filter(achievement => unlockedAchievements[achievement.id]).length;
};