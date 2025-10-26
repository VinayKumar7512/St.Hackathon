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
