import { GoogleOAuth, GitHubOAuth, RedditOAuth, TwitterOAuth, InstagramOAuth } from 'vineeth-unified-oauth';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

class OAuthService {
  constructor() {
    this.providers = this.initializeProviders();
  }

  initializeProviders() {
    const providers = {};

    if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
      providers.google = new GoogleOAuth({
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        redirectUri: config.GOOGLE_REDIRECT_URI
      });
    }

    if (config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET) {
      providers.github = new GitHubOAuth({
        clientId: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        redirectUri: config.GITHUB_REDIRECT_URI
      });
    }

    if (config.REDDIT_CLIENT_ID && config.REDDIT_CLIENT_SECRET) {
      providers.reddit = new RedditOAuth({
        clientId: config.REDDIT_CLIENT_ID,
        clientSecret: config.REDDIT_CLIENT_SECRET,
        redirectUri: config.REDDIT_REDIRECT_URI
      }, {
        userAgent: 'oauth-test-app/1.0.0 by VinayKumar7512'
      });
    }

    if (config.TWITTER_CLIENT_ID && config.TWITTER_CLIENT_SECRET) {
      providers.twitter = new TwitterOAuth({
        clientId: config.TWITTER_CLIENT_ID,
        clientSecret: config.TWITTER_CLIENT_SECRET,
        redirectUri: config.TWITTER_REDIRECT_URI
      });
    }

    if (config.LINKEDIN_CLIENT_ID && config.LINKEDIN_CLIENT_SECRET) {
      providers.linkedin = new LinkedInOAuth({
        clientId: config.LINKEDIN_CLIENT_ID,
        clientSecret: config.LINKEDIN_CLIENT_SECRET,
        redirectUri: config.LINKEDIN_REDIRECT_URI
      });
    }

    if (config.INSTAGRAM_CLIENT_ID && config.INSTAGRAM_CLIENT_SECRET) {
      providers.instagram = new InstagramOAuth({
        clientId: config.INSTAGRAM_CLIENT_ID,
        clientSecret: config.INSTAGRAM_CLIENT_SECRET,
        redirectUri: config.INSTAGRAM_REDIRECT_URI
      });
    }

    return providers;
  }

  getProvider(providerName) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`OAuth provider '${providerName}' is not configured`);
    }
    return provider;
  }

  generateAuthUrl(providerName, state = null) {
    const provider = this.getProvider(providerName);
    const authState = state || `${providerName}-${Date.now()}`;
    
    const params = { state: authState };
    
    // Add provider-specific scopes
    if (providerName === 'reddit') {
      params.scope = ['identity', 'read'];
    }
    
    return provider.generateAuthorizationUrl(params);
  }

  async exchangeCodeForToken(providerName, code) {
    const provider = this.getProvider(providerName);
    return await provider.exchangeCodeForToken({ code });
  }

  async getUserInfo(providerName, accessToken) {
    const provider = this.getProvider(providerName);
    return await provider.getUserInfo(accessToken);
  }

  async saveOrUpdateUser(providerName, tokens, userInfo) {
    try {
      const providerId = String(userInfo.id || userInfo.login);
      
      const existingUser = await User.findByProvider(providerName, providerId);

      if (existingUser) {
        // Update existing user
        existingUser.accessToken = tokens.accessToken;
        existingUser.refreshToken = tokens.refreshToken || null;
        existingUser.tokenType = tokens.tokenType || 'Bearer';
        existingUser.expiresIn = tokens.expiresIn || null;
        existingUser.scope = tokens.scope || null;
        existingUser.rawUserData = userInfo;
        existingUser.rawTokenData = tokens;
        
        await existingUser.updateLoginInfo();
        
        console.log(`🔄 Updated existing ${providerName} user: ${userInfo.name || userInfo.login || userInfo.username}`);
        return existingUser;
      } else {
        // Create new user
        const newUser = new User({
          provider: providerName,
          providerId: providerId,
          email: userInfo.email || null,
          name: userInfo.name || null,
          username: userInfo.login || userInfo.username || null,
          profilePicture: userInfo.avatar_url || userInfo.picture || null,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || null,
          tokenType: tokens.tokenType || 'Bearer',
          expiresIn: tokens.expiresIn || null,
          scope: tokens.scope || null,
          rawUserData: userInfo,
          rawTokenData: tokens
        });

        await newUser.save();
        console.log(`✅ Saved new ${providerName} user: ${userInfo.name || userInfo.login || userInfo.username}`);
        return newUser;
      }
    } catch (error) {
      console.error(`❌ Error saving ${providerName} user:`, error.message);
      
      // Handle duplicate key errors gracefully
      if (error.code === 11000) {
        console.log(`🔄 Attempting to update existing user due to duplicate key error...`);
        try {
          const existingUser = await User.findOneAndUpdate(
            { provider: providerName, providerId: String(userInfo.id || userInfo.login) },
            {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken || null,
              tokenType: tokens.tokenType || 'Bearer',
              expiresIn: tokens.expiresIn || null,
              scope: tokens.scope || null,
              rawUserData: userInfo,
              rawTokenData: tokens,
              $inc: { loginCount: 1 },
              lastLogin: new Date()
            },
            { new: true, upsert: true }
          );
          console.log(`✅ Successfully updated user after duplicate key error`);
          return existingUser;
        } catch (updateError) {
          console.error(`❌ Failed to update user after duplicate key error:`, updateError.message);
        }
      }
      
      throw error;
    }
  }

  getAvailableProviders() {
    return Object.keys(this.providers);
  }

  isProviderAvailable(providerName) {
    return providerName in this.providers;
  }
}

export const oauthService = new OAuthService();
