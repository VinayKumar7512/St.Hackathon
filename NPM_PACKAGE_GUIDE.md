# Converting OAuth Test App to NPM Package

This guide explains how to convert your OAuth test application into a publishable npm package and the technical details of the publishing process.

## Table of Contents

1. [Package Structure](#package-structure)
2. [Package Configuration](#package-configuration)
3. [Code Refactoring for Library](#code-refactoring-for-library)
4. [Build Process](#build-process)
5. [Publishing Process](#publishing-process) 
6. [Usage Examples](#usage-examples)
7. [Technical Implementation Details](#technical-implementation-details) 

## Package Structure

Transform your current application structure into a library structure:

```
oauth-test-package/
├── src/
│   ├── index.js                 # Main entry point
│   ├── lib/
│   │   ├── OAuthManager.js      # Core OAuth management class
│   │   ├── providers/           # Provider-specific implementations
│   │   ├── middleware/          # Express middleware
│   │   └── utils/               # Utility functions 
│   ├── types/
│   │   └── index.d.ts           # TypeScript definitions
│   └── templates/               # HTML templates
├── dist/                        # Built files
├── examples/                    # Usage examples
├── tests/                       # Test files
├── package.json
├── README.md
├── LICENSE
├── .npmignore
└── rollup.config.js            # Build configuration
```

## Package Configuration

### 1. Update package.json

```json
{
  "name": "@your-username/oauth-test-manager",
  "version": "1.0.0",
  "description": "Production-ready OAuth testing and management library for Node.js applications",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/types/index.d.ts",
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "rollup -c",
    "build:types": "tsc --emitDeclarationOnly --outDir dist/types",
    "dev": "rollup -c -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "prepublishOnly": "npm run build && npm run build:types && npm test",
    "prepare": "npm run build"
  },
  "keywords": [
    "oauth",
    "authentication",
    "google-oauth",
    "github-oauth",
    "reddit-oauth",
    "twitter-oauth",
    "linkedin-oauth",
    "instagram-oauth",
    "express-middleware",
    "nodejs"
  ],
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://github.com/yourusername"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/oauth-test-manager.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/oauth-test-manager/issues"
  },
  "homepage": "https://github.com/yourusername/oauth-test-manager#readme",
  "engines": {
    "node": ">=14.0.0"
  },
  "peerDependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0 || ^7.0.0 || ^8.0.0"
  },
  "dependencies": {
    "vineeth-unified-oauth": "^1.0.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^25.0.0",
    "@rollup/plugin-node-resolve": "^15.0.0",
    "@rollup/plugin-json": "^6.0.0",
    "rollup": "^3.0.0",
    "rollup-plugin-terser": "^7.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  }
}
```

### 2. Create .npmignore

```
# Development files
src/
tests/
examples/
*.test.js
*.spec.js

# Build tools
rollup.config.js
tsconfig.json
.eslintrc.js
jest.config.js

# Environment and config
.env*
.vscode/
.idea/

# Logs and temp files
logs/
*.log
npm-debug.log*
.tmp/
.cache/

# OS generated files
.DS_Store
Thumbs.db
```

## Code Refactoring for Library

### 1. Main Entry Point (src/index.js)

```javascript
// src/index.js
export { OAuthManager } from './lib/OAuthManager.js';
export { createOAuthMiddleware } from './lib/middleware/oauthMiddleware.js';
export { OAuthRoutes } from './lib/routes/OAuthRoutes.js';
export { UserManager } from './lib/UserManager.js';
export { HTMLRenderer } from './lib/utils/HTMLRenderer.js';

// Export types for TypeScript users
export * from './types/index.js';

// Export default configuration
export { defaultConfig } from './lib/config/defaults.js';
```

### 2. Core OAuth Manager Class (src/lib/OAuthManager.js)

```javascript
// src/lib/OAuthManager.js
import { GoogleOAuth, GitHubOAuth, RedditOAuth, TwitterOAuth, LinkedInOAuth, InstagramOAuth } from 'vineeth-unified-oauth';

export class OAuthManager {
  constructor(config = {}) {
    this.config = this.validateConfig(config);
    this.providers = this.initializeProviders();
  }

  validateConfig(config) {
    const required = ['providers', 'database'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required config: ${missing.join(', ')}`);
    }
    
    return {
      baseUrl: 'http://localhost:3000',
      security: {
        rateLimit: { windowMs: 15 * 60 * 1000, max: 100 },
        cors: { origin: '*' }
      },
      ...config
    };
  }

  initializeProviders() {
    const providers = {};
    const { providers: providerConfigs } = this.config;

    // Initialize each configured provider
    Object.entries(providerConfigs).forEach(([name, config]) => {
      if (!config.clientId || !config.clientSecret) {
        console.warn(`Skipping ${name}: missing credentials`);
        return;
      }

      switch (name) {
        case 'google':
          providers.google = new GoogleOAuth(config);
          break;
        case 'github':
          providers.github = new GitHubOAuth(config);
          break;
        case 'reddit':
          providers.reddit = new RedditOAuth(config, config.options);
          break;
        case 'twitter':
          providers.twitter = new TwitterOAuth(config);
          break;
        case 'linkedin':
          providers.linkedin = new LinkedInOAuth(config);
          break;
        case 'instagram':
          providers.instagram = new InstagramOAuth(config);
          break;
        default:
          console.warn(`Unknown provider: ${name}`);
      }
    });

    return providers;
  }

  getProvider(name) {
    const provider = this.providers[name];
    if (!provider) {
      throw new Error(`Provider '${name}' not configured or available`);
    }
    return provider;
  }

  getAvailableProviders() {
    return Object.keys(this.providers);
  }

  async authenticateUser(provider, code) {
    const oauthProvider = this.getProvider(provider);
    
    try {
      const tokens = await oauthProvider.exchangeCodeForToken({ code });
      const userInfo = await oauthProvider.getUserInfo(tokens.accessToken);
      
      return {
        provider,
        tokens,
        userInfo,
        success: true
      };
    } catch (error) {
      return {
        provider,
        error: error.message,
        success: false
      };
    }
  }

  generateAuthUrl(provider, options = {}) {
    const oauthProvider = this.getProvider(provider);
    const state = options.state || `${provider}-${Date.now()}`;
    
    return oauthProvider.generateAuthorizationUrl({
      state,
      ...options
    });
  }
}
```

### 3. Express Middleware (src/lib/middleware/oauthMiddleware.js)

```javascript
// src/lib/middleware/oauthMiddleware.js
import { OAuthManager } from '../OAuthManager.js';
import { UserManager } from '../UserManager.js';

export function createOAuthMiddleware(config) {
  const oauthManager = new OAuthManager(config);
  const userManager = new UserManager(config.database);

  return {
    // Initialize OAuth flow
    initAuth: (req, res, next) => {
      const { provider } = req.params;
      
      try {
        const authUrl = oauthManager.generateAuthUrl(provider, req.query);
        res.redirect(authUrl);
      } catch (error) {
        next(error);
      }
    },

    // Handle OAuth callback
    handleCallback: async (req, res, next) => {
      const { provider } = req.params;
      const { code, error } = req.query;
      
      if (error) {
        return res.status(400).json({ error, provider });
      }
      
      try {
        const result = await oauthManager.authenticateUser(provider, code);
        
        if (result.success) {
          const user = await userManager.saveUser(provider, result.tokens, result.userInfo);
          req.oauthResult = { user, tokens: result.tokens, userInfo: result.userInfo };
          next();
        } else {
          res.status(400).json({ error: result.error, provider });
        }
      } catch (error) {
        next(error);
      }
    },

    // Get available providers
    getProviders: (req, res) => {
      res.json({
        providers: oauthManager.getAvailableProviders(),
        baseUrl: config.baseUrl
      });
    }
  };
}
```

## Build Process

### 1. Rollup Configuration (rollup.config.js)

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

const external = [
  'express',
  'mongoose',
  'vineeth-unified-oauth',
  'helmet',
  'cors',
  'express-rate-limit'
];

export default [
  // ES Module build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json()
    ]
  },
  
  // CommonJS build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json()
    ]
  },
  
  // Minified build
  {
    input: 'src/index.js',
    external,
    output: {
      file: 'dist/index.min.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      terser()
    ]
  }
];
```

### 2. TypeScript Definitions (src/types/index.d.ts)

```typescript
// src/types/index.d.ts
export interface OAuthConfig {
  providers: {
    [key: string]: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      options?: any;
    };
  };
  database: {
    uri: string;
    options?: any;
  };
  baseUrl?: string;
  security?: {
    rateLimit?: {
      windowMs: number;
      max: number;
    };
    cors?: {
      origin: string | string[];
    };
  };
}

export interface AuthResult {
  provider: string;
  tokens?: any;
  userInfo?: any;
  error?: string;
  success: boolean;
}

export interface User {
  _id: string;
  provider: string;
  providerId: string;
  email?: string;
  name?: string;
  username?: string;
  profilePicture?: string;
  loginCount: number;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export declare class OAuthManager {
  constructor(config: OAuthConfig);
  getProvider(name: string): any;
  getAvailableProviders(): string[];
  authenticateUser(provider: string, code: string): Promise<AuthResult>;
  generateAuthUrl(provider: string, options?: any): string;
}

export declare function createOAuthMiddleware(config: OAuthConfig): {
  initAuth: (req: any, res: any, next: any) => void;
  handleCallback: (req: any, res: any, next: any) => Promise<void>;
  getProviders: (req: any, res: any) => void;
};
```

## Publishing Process

### 1. Pre-publish Checklist

```bash
# 1. Ensure you're logged into npm
npm whoami

# 2. If not logged in
npm login

# 3. Run tests
npm test

# 4. Build the package
npm run build

# 5. Check package contents
npm pack --dry-run

# 6. Verify package.json fields
npm pkg get name version description main types files
```

### 2. Version Management

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features, backward compatible)
npm version minor

# Major version (breaking changes)
npm version major

# Pre-release versions
npm version prerelease --preid=alpha
npm version prerelease --preid=beta
```

### 3. Publishing Commands

```bash
# Publish to npm registry
npm publish

# Publish scoped package (public)
npm publish --access public

# Publish beta version
npm publish --tag beta

# Publish to specific registry
npm publish --registry https://registry.npmjs.org/
```

## Usage Examples

### 1. Basic Express Integration

```javascript
// app.js
import express from 'express';
import { OAuthManager, createOAuthMiddleware } from '@your-username/oauth-test-manager';

const app = express();

const config = {
  providers: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/callback/google'
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      redirectUri: 'http://localhost:3000/callback/github'
    }
  },
  database: {
    uri: process.env.MONGODB_URI
  }
};

const oauthMiddleware = createOAuthMiddleware(config);

// Routes
app.get('/auth/:provider', oauthMiddleware.initAuth);
app.get('/callback/:provider', oauthMiddleware.handleCallback, (req, res) => {
  res.json({
    success: true,
    user: req.oauthResult.user,
    message: 'Authentication successful'
  });
});
app.get('/providers', oauthMiddleware.getProviders);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Custom Implementation

```javascript
// custom-oauth.js
import { OAuthManager } from '@your-username/oauth-test-manager';

const oauthManager = new OAuthManager({
  providers: {
    google: {
      clientId: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      redirectUri: 'http://localhost:3000/callback/google'
    }
  },
  database: {
    uri: 'mongodb://localhost:27017/oauth-users'
  }
});

// Generate auth URL
const authUrl = oauthManager.generateAuthUrl('google', {
  scope: ['profile', 'email']
});

// Handle authentication
async function handleAuth(provider, code) {
  try {
    const result = await oauthManager.authenticateUser(provider, code);
    
    if (result.success) {
      console.log('User authenticated:', result.userInfo);
      return result;
    } else {
      console.error('Authentication failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('OAuth error:', error);
    return null;
  }
}
```

## Technical Implementation Details

### 1. Package Publishing Process

When you run `npm publish`, the following technical process occurs:

#### a) **Pre-publish Validation**
```bash
# npm runs these automatically:
npm run prepublishOnly  # Builds and tests
npm pack               # Creates tarball
```

#### b) **Tarball Creation**
- npm creates a `.tgz` file containing only files listed in `files` field
- Excludes files in `.npmignore`
- Includes `package.json`, `README.md`, `LICENSE` by default

#### c) **Registry Upload**
```
POST https://registry.npmjs.org/@your-username/oauth-test-manager
Content-Type: application/json
Authorization: Bearer <your-npm-token>

{
  "name": "@your-username/oauth-test-manager",
  "version": "1.0.0",
  "dist": {
    "tarball": "https://registry.npmjs.org/@your-username/oauth-test-manager/-/oauth-test-manager-1.0.0.tgz",
    "shasum": "sha1-hash-of-tarball"
  },
  // ... package.json contents
}
```

#### d) **Registry Processing**
1. **Validation**: Registry validates package.json format, version constraints
2. **Security Scan**: Automated vulnerability scanning
3. **Metadata Storage**: Package metadata stored in CouchDB
4. **CDN Distribution**: Tarball distributed to global CDN nodes
5. **Search Indexing**: Package indexed for npm search

### 2. Module Resolution

When users install your package:

#### a) **Installation Process**
```bash
npm install @your-username/oauth-test-manager
```

1. **Registry Query**: npm queries registry for latest version
2. **Dependency Resolution**: Resolves peer dependencies
3. **Download**: Downloads tarball from CDN
4. **Extraction**: Extracts to `node_modules/@your-username/oauth-test-manager`
5. **Linking**: Creates symlinks for executables

#### b) **Import Resolution**
```javascript
import { OAuthManager } from '@your-username/oauth-test-manager';
```

Node.js resolution algorithm:
1. Checks `package.json` `main` field → `dist/index.js`
2. For ES modules, checks `module` field → `dist/index.esm.js`
3. TypeScript checks `types` field → `dist/types/index.d.ts`

### 3. Semantic Versioning

Your package follows semver (semantic versioning):

```
MAJOR.MINOR.PATCH
  │     │     │
  │     │     └── Bug fixes (backward compatible)
  │     └────────── New features (backward compatible)
  └──────────────── Breaking changes
```

#### Version Ranges in Dependencies:
- `^1.2.3` → `>=1.2.3 <2.0.0` (compatible changes)
- `~1.2.3` → `>=1.2.3 <1.3.0` (patch-level changes)
- `1.2.3` → exactly `1.2.3`

### 4. Package Distribution

#### a) **Build Targets**
- **CommonJS** (`dist/index.js`): For Node.js `require()`
- **ES Modules** (`dist/index.esm.js`): For `import` statements
- **TypeScript** (`dist/types/index.d.ts`): Type definitions

#### b) **Tree Shaking Support**
ES module build enables tree shaking:
```javascript
// Users can import only what they need
import { OAuthManager } from '@your-username/oauth-test-manager';
// Bundlers exclude unused exports
```

### 5. Peer Dependencies Strategy

```json
{
  "peerDependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0 || ^7.0.0 || ^8.0.0"
  }
}
```

**Why Peer Dependencies?**
- Avoids version conflicts in user's project
- Reduces bundle size (shared dependencies)
- Ensures compatibility with user's existing stack

### 6. Security Considerations

#### a) **Package Security**
- Use `npm audit` to check vulnerabilities
- Pin dependency versions in `package-lock.json`
- Use `.npmignore` to exclude sensitive files

#### b) **Publishing Security**
- Enable 2FA on npm account
- Use scoped packages (`@username/package`)
- Consider private registries for internal packages

### 7. Monitoring and Analytics

After publishing, monitor:
- **Download stats**: `npm info @your-username/oauth-test-manager`
- **Bundle size**: Use bundlephobia.com
- **Performance**: Monitor user feedback and issues

This comprehensive guide covers the complete process of converting your OAuth application into a professional npm package with proper build processes, TypeScript support, and production-ready distribution.
