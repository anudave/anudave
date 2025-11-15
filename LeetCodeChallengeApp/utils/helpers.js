// Remove this line:
// import { COLORS } from '../constants/colors';

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return '#10B981';
    case 'intermediate': return '#F59E0B';
    case 'advanced': return '#EF4444';
    default: return '#6366F1'; // Use a default color instead of COLORS.primary
  }
};

// ... rest of the file remains the same
export const formatPercentage = (value, total) => {
  return Math.round((value / total) * 100);
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const isToday = (dateString) => {
  const today = getCurrentDate();
  return dateString === today;
};

export const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const searchChallenges = (challenges, searchQuery) => {
  if (!searchQuery.trim()) {
    return challenges;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return challenges.filter(challenge => {
    const searchableText = `
      ${challenge.title || ''}
      ${challenge.description || ''}
      ${challenge.category || ''}
      ${challenge.difficulty || ''}
      ${challenge.objectives ? challenge.objectives.join(' ') : ''}
      ${challenge.tips ? challenge.tips.join(' ') : ''}
    `.toLowerCase();

    return searchableText.includes(query);
  });
};

export const filterChallengesByCategory = (challenges, categoryId) => {
  if (!categoryId) return challenges;
  return challenges.filter(challenge => challenge.category === categoryId);
};

export const filterChallengesByDifficulty = (challenges, difficulty) => {
  if (!difficulty) return challenges;
  return challenges.filter(challenge => 
    challenge.difficulty?.toLowerCase() === difficulty.toLowerCase()
  );
};