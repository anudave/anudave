import { loadChallengesOffline, saveChallengesOffline } from './offlineStorage';
import { checkNetworkConnection } from './networkUtils';

// Check if offline mode is enabled (local function to avoid import cycle)
const isOfflineModeEnabled = async () => {
  try {
    const { isOfflineModeEnabled } = await import('./offlineStorage');
    return isOfflineModeEnabled();
  } catch (error) {
    console.error('Error checking offline mode:', error);
    return false;
  }
};

// Utility to load challenge data with offline support
export const loadChallengeData = async (category, day) => {
  try {
    const isOffline = await isOfflineModeEnabled();
    const isConnected = await checkNetworkConnection();

    console.log('Loading challenge:', { category, day, isOffline, isConnected });

    // If we're online and not forced to offline mode, try to load fresh data
    if (isConnected && !isOffline) {
      console.log('Loading fresh challenges online');
      const freshData = await loadFreshChallenges();
      if (freshData) {
        await saveChallengesOffline(freshData);
        return getChallengeFromData(freshData, category, day);
      }
    }

    // Fall back to offline data
    console.log('Loading from offline storage');
    const offlineData = await loadChallengesOffline();
    if (offlineData) {
      const challenge = getChallengeFromData(offlineData, category, day);
      console.log('Found offline challenge:', challenge ? 'Yes' : 'No');
      return challenge;
    }

    // Final fallback to mock data
    console.log('Using fallback challenge');
    return getFallbackChallenge(category, day);
  } catch (error) {
    console.error('Error loading challenge data:', error);
    return getFallbackChallenge(category, day);
  }
};

// Load fresh challenges (simulate API call)
const loadFreshChallenges = async () => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return our comprehensive mock data
    return getAllMockChallenges();
  } catch (error) {
    console.error('Error loading fresh challenges:', error);
    return null;
  }
};

// Get challenge from data structure
const getChallengeFromData = (data, category, day) => {
  const challengeKey = `${category}-${day}`;
  return data[challengeKey] || getFallbackChallenge(category, day);
};

// Enhanced mock challenges with more content
const getAllMockChallenges = () => {
  const mockChallenges = {
    // Full Stack Challenges
    'fullstack-1': {
      day: 1,
      title: "Build a Simple HTML/CSS Landing Page",
      description: "Create a responsive landing page using HTML and CSS to understand the basics of frontend development.",
      difficulty: "beginner",
      category: "fullstack",
      objectives: [
        "Create a basic HTML structure with header, main, and footer",
        "Style the page using CSS with flexbox or grid",
        "Make the page responsive for mobile devices",
        "Add basic interactivity with CSS hover effects"
      ],
      codeExample: "<!DOCTYPE html>\n<html>\n<head>\n    <title>My Landing Page</title>\n    <style>\n        body { font-family: Arial; margin: 0; }\n        .hero { background: #4ECDC4; padding: 60px; text-align: center; }\n    </style>\n</head>\n<body>\n    <header class=\"hero\">\n        <h1>Welcome to My Site</h1>\n    </header>\n</body>\n</html>",
      explanation: "This challenge introduces you to the fundamental building blocks of web development. HTML provides the structure, while CSS handles the presentation. Understanding these basics is crucial before moving to more complex frameworks.",
      resources: [
        "https://developer.mozilla.org/en-US/docs/Web/HTML",
        "https://developer.mozilla.org/en-US/docs/Web/CSS"
      ],
      tips: [
        "Start with mobile-first design approach",
        "Use semantic HTML tags for better accessibility",
        "Test your page on different screen sizes"
      ]
    },
    'fullstack-2': {
      day: 2,
      title: "Add JavaScript Interactivity",
      description: "Enhance your landing page with JavaScript to add dynamic behavior and user interactions.",
      difficulty: "beginner",
      category: "fullstack",
      objectives: [
        "Add JavaScript to handle user interactions",
        "Create a simple form with validation",
        "Implement dark/light mode toggle",
        "Add smooth scrolling navigation"
      ],
      codeExample: "// Dark mode toggle\nconst toggleButton = document.getElementById('theme-toggle');\ntoggleButton.addEventListener('click', () => {\n  document.body.classList.toggle('dark-mode');\n});",
      explanation: "JavaScript brings interactivity to your web pages. It allows you to respond to user actions, manipulate the DOM, and create dynamic content.",
      resources: [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "https://javascript.info/"
      ],
      tips: [
        "Use event delegation for better performance",
        "Always validate user input on both client and server side",
        "Use modern ES6+ features for cleaner code"
      ]
    },

    // Backend Challenges
    'backend-1': {
      day: 1,
      title: "Create a Simple Express.js Server",
      description: "Set up a basic Express.js server that responds to HTTP requests and understand the fundamentals of backend development.",
      difficulty: "beginner",
      category: "backend",
      subcategory: "expressjs",
      objectives: [
        "Initialize a new Node.js project",
        "Install and set up Express.js",
        "Create a basic server that listens on port 3000",
        "Add routes for GET requests"
      ],
      codeExample: "const express = require('express');\nconst app = express();\nconst PORT = 3000;\n\n// Basic route\napp.get('/', (req, res) => {\n  res.json({ message: 'Hello from Express Server!' });\n});\n\n// Start server\napp.listen(PORT, () => {\n  console.log(`Server running on http://localhost:${PORT}`);\n});",
      explanation: "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. This challenge helps you understand how servers handle HTTP requests and send responses.",
      resources: [
        "https://expressjs.com/",
        "https://nodejs.org/en/docs/"
      ],
      tips: [
        "Use nodemon for automatic server restarts during development",
        "Always handle errors properly",
        "Start with simple routes before adding complexity"
      ]
    },

    // AI Challenges
    'ai-1': {
      day: 1,
      title: "Introduction to Machine Learning Concepts",
      description: "Understand the basic concepts of machine learning and set up your first Python environment for AI development.",
      difficulty: "beginner",
      category: "ai",
      subcategory: "ml",
      objectives: [
        "Understand what machine learning is",
        "Set up Python environment with necessary libraries",
        "Learn about supervised vs unsupervised learning",
        "Install and import basic ML libraries"
      ],
      codeExample: "# Import essential libraries\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.model_selection import train_test_split\n\nprint(\"ML Environment Setup Complete!\")\nprint(\"NumPy version:\", np.__version__)\nprint(\"Pandas version:\", pd.__version__)",
      explanation: "Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.",
      resources: [
        "https://scikit-learn.org/stable/",
        "https://numpy.org/",
        "https://pandas.pydata.org/"
      ],
      tips: [
        "Start with understanding the problem before choosing algorithms",
        "Always split your data into training and testing sets",
        "Practice with real datasets from Kaggle"
      ]
    }
  };

  // Add more days for each category
  for (let category of ['fullstack', 'backend', 'ai', 'cybersecurity', 'frontend', 'mobile', 'database']) {
    for (let day = 3; day <= 10; day++) { // Reduced to 10 for testing
      mockChallenges[`${category}-${day}`] = getFallbackChallenge(category, day);
    }
  }

  return mockChallenges;
};

// Get all challenges for a category (for listing)
export const getChallengesForCategory = async (categoryId) => {
  try {
    const isOffline = await isOfflineModeEnabled();
    const offlineData = await loadChallengesOffline();
    
    if (offlineData) {
      // Filter challenges for this category from offline data
      const categoryChallenges = Object.values(offlineData)
        .filter(challenge => challenge.category === categoryId)
        .sort((a, b) => a.day - b.day);
      
      if (categoryChallenges.length > 0) {
        return categoryChallenges;
      }
    }
    
    // Fallback to generating challenges
    return generateChallengesForCategory(categoryId);
  } catch (error) {
    console.error('Error loading category challenges:', error);
    return generateChallengesForCategory(categoryId);
  }
};

const generateChallengesForCategory = (categoryId) => {
  const challenges = [];
  for (let day = 1; day <= 10; day++) { // Reduced to 10 for testing
    challenges.push({
      day,
      title: `${categoryId} Challenge Day ${day}`,
      difficulty: getRandomDifficulty(day),
      category: categoryId
    });
  }
  return challenges;
};

const getRandomDifficulty = (day) => {
  if (day <= 3) return 'beginner';
  if (day <= 7) return 'intermediate';
  return 'advanced';
};

const getFallbackChallenge = (category, day) => ({
  day,
  title: `${category} Challenge Day ${day}`,
  description: `This is a ${category} challenge for day ${day}. The specific content will be available when you're online, but you can still track your progress offline!`,
  difficulty: "beginner",
  category,
  objectives: [
    "Learn fundamental concepts",
    "Implement practical solution",
    "Test your understanding"
  ],
  codeExample: "// Example code will be available when online\nconsole.log('Hello, World!');",
  explanation: "Detailed explanation will be provided here when you have an internet connection. For now, focus on tracking your learning journey!",
  resources: [],
  tips: [
    "Take your time to understand the concepts",
    "Practice regularly",
    "Don't hesitate to research online when connected"
  ]
});

// Preload challenges for offline use
export const preloadChallengesForOffline = async () => {
  try {
    console.log('Starting to preload challenges for offline use...');
    const challenges = getAllMockChallenges();
    console.log('Generated challenges:', Object.keys(challenges).length);
    
    const success = await saveChallengesOffline(challenges);
    console.log('Save challenges result:', success);
    
    if (success) {
      console.log('Challenges preloaded for offline use');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error preloading challenges:', error);
    return false;
  }
};