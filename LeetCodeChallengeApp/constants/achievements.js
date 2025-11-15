export const ACHIEVEMENTS = {
  // Completion Achievements
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps 🚶‍♂️',
    description: 'Complete your first challenge',
    icon: '🚶‍♂️',
    type: 'completion',
    requirement: 1,
    color: '#10B981',
  },
  DEDICATED_LEARNER: {
    id: 'dedicated_learner',
    name: 'Dedicated Learner 📚',
    description: 'Complete 10 challenges',
    icon: '📚',
    type: 'completion',
    requirement: 10,
    color: '#3B82F6',
  },
  CHALLENGE_MASTER: {
    id: 'challenge_master',
    name: 'Challenge Master 🏆',
    description: 'Complete 50 challenges',
    icon: '🏆',
    type: 'completion',
    requirement: 50,
    color: '#F59E0B',
  },
  ULTIMATE_CODER: {
    id: 'ultimate_coder',
    name: 'Ultimate Coder 💻',
    description: 'Complete 100 challenges',
    icon: '💻',
    type: 'completion',
    requirement: 100,
    color: '#8B5CF6',
  },
  
  // Streak Achievements
  CONSISTENT_CODER: {
    id: 'consistent_coder',
    name: 'Consistent Coder 🔥',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    type: 'streak',
    requirement: 7,
    color: '#EF4444',
  },
  STREAK_CHAMPION: {
    id: 'streak_champion',
    name: 'Streak Champion ⚡',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    type: 'streak',
    requirement: 30,
    color: '#F59E0B',
  },
  
  // Category Mastery
  FULLSTACK_NOVICE: {
    id: 'fullstack_novice',
    name: 'Full Stack Novice 🌐',
    description: 'Complete 5 Full Stack challenges',
    icon: '🌐',
    type: 'category',
    category: 'fullstack',
    requirement: 5,
    color: '#45B7D1',
  },
  BACKEND_PRO: {
    id: 'backend_pro',
    name: 'Backend Pro ⚙️',
    description: 'Complete 5 Backend challenges',
    icon: '⚙️',
    type: 'category',
    category: 'backend',
    requirement: 5,
    color: '#4ECDC4',
  },
  AI_EXPLORER: {
    id: 'ai_explorer',
    name: 'AI Explorer 🤖',
    description: 'Complete 5 AI challenges',
    icon: '🤖',
    type: 'category',
    category: 'ai',
    requirement: 5,
    color: '#FF6B6B',
  },
  SECURITY_GUARD: {
    id: 'security_guard',
    name: 'Security Guard 🔒',
    description: 'Complete 5 Cybersecurity challenges',
    icon: '🔒',
    type: 'category',
    category: 'cybersecurity',
    requirement: 5,
    color: '#A78BFA',
  },
  
  // Special Achievements
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird 🌅',
    description: 'Complete a challenge before 8 AM',
    icon: '🌅',
    type: 'special',
    requirement: 1,
    color: '#F59E0B',
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl 🌙',
    description: 'Complete a challenge after 10 PM',
    icon: '🌙',
    type: 'special',
    requirement: 1,
    color: '#6366F1',
  },
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior',
    name: 'Weekend Warrior 🎯',
    description: 'Complete challenges on both Saturday and Sunday',
    icon: '🎯',
    type: 'special',
    requirement: 1,
    color: '#10B981',
  },
};

// Helper to get all achievements
export const getAllAchievements = () => Object.values(ACHIEVEMENTS);

// Helper to get achievements by type
export const getAchievementsByType = (type) => 
  Object.values(ACHIEVEMENTS).filter(achievement => achievement.type === type);

// Helper to get category achievements
export const getCategoryAchievements = () => getAchievementsByType('category');