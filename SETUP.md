# OAuth Test App Setup

## 1. Install Dependencies

```bash
cd oauth-test
npm install
```

## 2. Get OAuth Credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API or Google Identity Services
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set redirect URI: `http://localhost:3000/callback/google`
6. Copy Client ID and Client Secret

### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL: `http://localhost:3000/callback/github`
4. Copy Client ID and Client Secret

### LinkedIn OAuth Setup
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a new app
3. Add redirect URL: `http://localhost:3000/callback/linkedin`
4. Copy Client ID and Client Secret

## 3. Configure Environment

Edit `.env` file with your credentials:

```bash
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret

LINKEDIN_CLIENT_ID=your_actual_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_actual_linkedin_client_secret
```

## 4. Run the Test App

```bash
npm start
```

Visit http://localhost:3000 to test OAuth flows!
