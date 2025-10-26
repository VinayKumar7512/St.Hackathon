# OAuth Test Application

A production-ready OAuth testing application built with Node.js, Express, and MongoDB. Supports Google, GitHub, Reddit, Twitter, LinkedIn, and Instagram OAuth providers using the `vineeth-unified-oauth` package.

## Features

- 🔐 **Multi-Provider OAuth**: Google, GitHub, Reddit, Twitter, LinkedIn, Instagram
- 🛡️ **Security**: Rate limiting, CORS, security headers, input sanitization
- 📊 **User Management**: Store and view OAuth user data
- 🏗️ **Modular Architecture**: Clean separation of concerns
- 📝 **Comprehensive Logging**: Request/response logging with error tracking
- 🔄 **Graceful Shutdown**: Proper cleanup on application termination
- 📱 **Responsive UI**: Modern, mobile-friendly interface

## Project Structure

```
oauth-test/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection and setup
│   │   └── env.js           # Environment configuration
│   ├── controllers/
│   │   ├── authController.js # OAuth authentication logic
│   │   └── userController.js # User management logic
│   ├── middleware/
│   │   ├── errorHandler.js  # Error handling middleware
│   │   └── security.js      # Security middleware
│   ├── models/
│   │   └── User.js          # MongoDB user schema
│   ├── routes/
│   │   ├── authRoutes.js    # OAuth routes
│   │   ├── userRoutes.js    # User management routes
│   │   └── index.js         # Route aggregation
│   ├── services/
│   │   └── oauthService.js  # OAuth business logic
│   ├── utils/
│   │   └── htmlRenderer.js  # HTML template rendering
│   └── app.js               # Express app configuration
├── server.js                # Application entry point
├── package.json
└── .env                     # Environment variables
```

## Installation

1. **Clone and install dependencies:**
   ```bash
   cd oauth-test
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure:
   ```bash
   # Database
   MONGODB_URI=mongodb://localhost:27017/oauth_users

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/callback/google

   # GitHub OAuth
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_REDIRECT_URI=http://localhost:3000/callback/github

   # Reddit OAuth
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   REDDIT_REDIRECT_URI=http://localhost:3000/callback/reddit

   # Twitter OAuth
   TWITTER_CLIENT_ID=your_twitter_client_id
   TWITTER_CLIENT_SECRET=your_twitter_client_secret
   TWITTER_REDIRECT_URI=http://localhost:3000/callback/twitter

   # LinkedIn OAuth
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:3000/callback/linkedin

   # Instagram OAuth
   INSTAGRAM_CLIENT_ID=your_instagram_client_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
   INSTAGRAM_REDIRECT_URI=http://localhost:3000/callback/instagram

   # Optional Configuration
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=*
   RATE_LIMIT_WINDOW=900000
   RATE_LIMIT_MAX=100
   ```

## OAuth Provider Setup

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project → Enable Google+ API
3. Create OAuth 2.0 Client ID
4. Set redirect URI: `http://localhost:3000/callback/google`

### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/callback/github`

### Reddit OAuth
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Create "web app" type application
3. Set redirect URI: `http://localhost:3000/callback/reddit`

### Twitter OAuth
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create new app in your developer account
3. Generate API keys and tokens
4. Set callback URL: `http://localhost:3000/callback/twitter`
5. Enable "Request email addresses from users" if needed

### LinkedIn OAuth
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create new app → Select appropriate company page
3. Add "Sign In with LinkedIn" product
4. Set redirect URL: `http://localhost:3000/callback/linkedin`
5. Request scopes: `r_liteprofile`, `r_emailaddress`

### Instagram OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app → Select "Consumer" type
3. Add Instagram Basic Display product
4. Create Instagram App ID
5. Set redirect URI: `http://localhost:3000/callback/instagram`
6. Add test users in App Review → Roles

## Usage

### Development
```bash
npm run dev    # Start with nodemon (auto-restart)
```

### Production
```bash
npm start      # Start production server
```

### Available Endpoints

- `GET /` - Home page with OAuth login buttons
- `GET /health` - Health check endpoint
- `GET /auth/:provider` - Initiate OAuth flow
- `GET /callback/:provider` - OAuth callback handler
- `GET /users` - View all stored users
- `GET /users/stats` - User statistics API
- `GET /users/:id` - Get specific user
- `PATCH /users/:id/deactivate` - Deactivate user

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes (configurable)
- **OAuth Rate Limiting**: 10 OAuth attempts per 15 minutes
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS policies
- **Input Sanitization**: XSS protection
- **Error Handling**: Comprehensive error handling with logging

## Database Schema

Users are stored with the following structure:
- Provider information (google, github, reddit)
- User profile data (name, email, username)
- OAuth tokens (access, refresh)
- Login tracking (count, last login)
- Raw provider data for debugging

## Error Handling

- Graceful error handling with user-friendly messages
- Comprehensive logging for debugging
- Automatic retry logic for database operations
- Proper HTTP status codes

## Monitoring

- Request/response logging
- Error tracking with stack traces
- Health check endpoint for monitoring
- User statistics and analytics

## Contributing

1. Follow the modular architecture
2. Add proper error handling
3. Include logging for debugging
4. Update documentation
5. Test with all OAuth providers

## License

MIT License
