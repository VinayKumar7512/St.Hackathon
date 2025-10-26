import { config } from '../config/env.js';

const baseStyles = `
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 20px;
    background: #f8fafc;
    color: #1a202c;
    line-height: 1.6;
  }
  .container {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
  }
  .header { 
    text-align: center; 
    margin-bottom: 40px; 
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
  }
  .header h1 {
    color: #2d3748;
    margin-bottom: 10px;
    font-size: 2.5rem;
  }
  .login-btn {
    display: block;
    width: 100%;
    padding: 16px 24px;
    margin: 16px 0;
    text-decoration: none;
    text-align: center;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  .login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  .google { background: #4285f4; color: white; }
  .github { background: #24292e; color: white; }
  .reddit { background: #ff4500; color: white; }
  .twitter { background: #1da1f2; color: white; }
  .instagram { background: #e4405f; color: white; }
  .secondary { background: #6c757d; color: white; }
  .success { 
    background: #d4edda; 
    padding: 24px; 
    border-radius: 8px; 
    border-left: 4px solid #28a745; 
    margin: 20px 0;
  }
  .error { 
    background: #f8d7da; 
    padding: 24px; 
    border-radius: 8px; 
    border-left: 4px solid #dc3545; 
    margin: 20px 0;
  }
  .info-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
    gap: 20px; 
    margin: 20px 0; 
  }
  .info-card { 
    background: #f8f9fa; 
    padding: 20px; 
    border-radius: 8px; 
    border: 1px solid #e9ecef;
  }
  .info-card h3 {
    margin-top: 0;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
    padding-bottom: 8px;
  }
  .back-btn { 
    display: inline-block; 
    margin-top: 24px; 
    padding: 12px 24px; 
    background: #007bff; 
    color: white; 
    text-decoration: none; 
    border-radius: 6px;
    font-weight: 500;
  }
  .back-btn:hover {
    background: #0056b3;
  }
  .status {
    margin-top: 30px;
    padding: 20px;
    background: #e3f2fd;
    border-radius: 8px;
    border-left: 4px solid #2196f3;
  }
  .user-card { 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 12px; 
    margin: 20px 0; 
    padding: 24px; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .provider-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    color: white;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 16px;
    text-transform: uppercase;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
  }
  .stat-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
  }
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .raw-data { 
    max-height: 300px; 
    overflow-y: auto; 
    background: #f1f3f4; 
    padding: 16px; 
    border-radius: 6px; 
    font-family: 'Monaco', 'Menlo', monospace; 
    font-size: 13px;
    border: 1px solid #dadce0;
  }
  details {
    margin: 16px 0;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
  }
  summary {
    padding: 12px 16px;
    background: #f8f9fa;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px 6px 0 0;
  }
  summary:hover {
    background: #e9ecef;
  }
  .debug-info {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 6px;
    padding: 16px;
    margin: 16px 0;
  }
  .debug-info h4 {
    margin-top: 0;
    color: #856404;
  }
  .debug-list {
    list-style: none;
    padding: 0;
  }
  .debug-list li {
    padding: 4px 0;
    border-bottom: 1px solid #ffeaa7;
  }
  .debug-list li:last-child {
    border-bottom: none;
  }
`;

export function renderHomePage(availableProviders) {
  const providerButtons = availableProviders.map(provider => {
    const icons = {
      google: '📧',
      github: '🐙', 
      reddit: '🔴',
      twitter: '🐦',
      instagram: '📷'
    };
    
    return `
      <a href="/auth/${provider}" class="login-btn ${provider}">
        ${icons[provider] || '🔗'} Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}
      </a>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OAuth Test Application</title>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 OAuth Test Application</h1>
                <p>Test your vineeth-unified-oauth package with multiple providers</p>
            </div>
            
            ${providerButtons}
            
            <a href="/health" class="login-btn secondary">
                ❤️ Health Check
            </a>
            
            <div class="status">
                <strong>Status:</strong> Ready to test OAuth flows<br>
                <small>Available providers: ${availableProviders.join(', ')}</small><br>
                <small>Environment: ${config.NODE_ENV}</small>
            </div>
        </div>
    </body>
    </html>
  `;
}

export function renderSuccessPage(provider, user, tokens, savedUser) {
  const providerColors = {
    google: '#4285f4',
    github: '#24292e',
    reddit: '#ff4500',
    twitter: '#1da1f2',
    instagram: '#e4405f'
  };

  const userFields = {
    google: ['name', 'email', 'id', 'picture'],
    github: ['login', 'name', 'email', 'id', 'avatar_url'],
    reddit: ['name', 'id', 'total_karma'],
    twitter: ['screen_name', 'name', 'id', 'profile_image_url'],
    instagram: ['id', 'username', 'account_type']
  };

  const fields = userFields[provider] || Object.keys(user);
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Success</title>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="success">
            <h2>✅ ${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Successful!</h2>
            
            <div class="info-grid">
                <div class="info-card">
                    <h3>👤 User Information</h3>
                    ${fields.map(field => 
                      `<p><strong>${field.charAt(0).toUpperCase() + field.slice(1)}:</strong> ${user[field] || 'N/A'}`
                    ).join('')}
                </div>
                
                <div class="info-card">
                    <h3>🔑 Token Information</h3>
                    <p><strong>Access Token:</strong> ${tokens.accessToken.substring(0, 20)}...</p>
                    <p><strong>Token Type:</strong> ${tokens.tokenType}</p>
                    <p><strong>Expires In:</strong> ${tokens.expiresIn || 'N/A'} seconds</p>
                    <p><strong>Scope:</strong> ${tokens.scope || 'N/A'}</p>
                    ${tokens.refreshToken ? `<p><strong>Refresh Token:</strong> ${tokens.refreshToken.substring(0, 20)}...</p>` : ''}
                </div>
                
                <div class="info-card">
                    <h3>💾 Database Info</h3>
                    <p><strong>User ID:</strong> ${savedUser._id}</p>
                    <p><strong>Login Count:</strong> ${savedUser.loginCount}</p>
                    <p><strong>Last Login:</strong> ${new Date(savedUser.lastLogin).toLocaleString()}</p>
                    <p><strong>Created:</strong> ${new Date(savedUser.createdAt).toLocaleString()}</p>
                </div>
            </div>
            
            <details>
                <summary><strong>📄 Raw User Data</strong></summary>
                <div class="raw-data">${JSON.stringify(user, null, 2)}</div>
            </details>
            
            <details>
                <summary><strong>🎫 Raw Token Data</strong></summary>
                <div class="raw-data">${JSON.stringify(tokens, null, 2)}</div>
            </details>
            
            <a href="/" class="back-btn">← Back to Home</a>
        </div>
    </body>
    </html>
  `;
}

export function renderErrorPage(title, error, description = '', debugInfo = []) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="error">
            <h2>❌ ${title}</h2>
            <p><strong>Error:</strong> ${error}</p>
            ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
            
            ${debugInfo.length > 0 ? `
              <div class="debug-info">
                <h4>🔍 Debug Information</h4>
                <ul class="debug-list">
                  ${debugInfo.map(info => `<li>${info}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            <a href="/" class="back-btn">← Back to Home</a>
        </div>
    </body>
    </html>
  `;
}

export function renderUsersPage(users, stats) {
  const totalUsers = users.length;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stored OAuth Users</title>
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Stored OAuth Users</h1>
                <a href="/" class="back-btn">← Back to Home</a>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${totalUsers}</div>
                    <div>Total Users</div>
                </div>
                ${stats.map(stat => `
                  <div class="stat-card">
                    <div class="stat-number">${stat.count}</div>
                    <div>${stat._id.charAt(0).toUpperCase() + stat._id.slice(1)} Users</div>
                  </div>
                `).join('')}
            </div>
            
            ${totalUsers === 0 ? '<p>No users found. Try logging in with OAuth providers first.</p>' : ''}
            
            ${users.map(user => `
                <div class="user-card">
                    <div class="provider-badge ${user.provider}">${user.provider}</div>
                    
                    <div class="info-grid">
                        <div>
                            <strong>Name:</strong> ${user.name || 'N/A'}<br>
                            <strong>Email:</strong> ${user.email || 'N/A'}<br>
                            <strong>Username:</strong> ${user.username || 'N/A'}
                        </div>
                        <div>
                            <strong>Provider ID:</strong> ${user.providerId}<br>
                            <strong>Login Count:</strong> ${user.loginCount}<br>
                            <strong>Last Login:</strong> ${new Date(user.lastLogin).toLocaleString()}
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <h4>🔑 Token Information</h4>
                        <p><strong>Token Type:</strong> ${user.tokenType}</p>
                        <p><strong>Expires In:</strong> ${user.expiresIn || 'N/A'} seconds</p>
                        <p><strong>Scope:</strong> ${user.scope || 'N/A'}</p>
                        <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </body>
    </html>
  `;
}
