import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET', 
  'GOOGLE_REDIRECT_URI',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'GITHUB_REDIRECT_URI',
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET',
  'REDDIT_REDIRECT_URI',
  'TWITTER_CLIENT_ID',
  'TWITTER_CLIENT_SECRET',
  'TWITTER_REDIRECT_URI',
  'INSTAGRAM_CLIENT_ID',
  'INSTAGRAM_CLIENT_SECRET',
  'INSTAGRAM_REDIRECT_URI',
  'MONGODB_URI'
];

function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missing.join(', ')}`);
    console.warn('Some OAuth providers may not work properly.');
  }
}

validateEnv();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  
  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  
  // GitHub OAuth
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  
  // Reddit OAuth
  REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
  REDDIT_REDIRECT_URI: process.env.REDDIT_REDIRECT_URI,
  
  // Twitter OAuth
  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET,
  TWITTER_REDIRECT_URI: process.env.TWITTER_REDIRECT_URI,
  
  // Instagram OAuth
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI,
  
  // App Settings
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  
  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100, // requests per window
};
