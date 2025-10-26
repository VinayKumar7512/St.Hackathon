import { oauthService } from '../services/oauthService.js';
import { renderSuccessPage, renderErrorPage } from '../utils/htmlRenderer.js';

class AuthController {
  async initiateAuth(req, res) {
    const { provider } = req.params;
    
    try {
      if (!oauthService.isProviderAvailable(provider)) {
        return res.status(400).json({
          error: 'Invalid OAuth provider',
          availableProviders: oauthService.getAvailableProviders()
        });
      }

      const authUrl = oauthService.generateAuthUrl(provider);
      console.log(`🔗 ${provider.toUpperCase()} Auth URL:`, authUrl);
      
      res.redirect(authUrl);
    } catch (error) {
      console.error(`❌ ${provider} Auth URL Error:`, error);
      res.status(500).send(renderErrorPage(
        `${provider} OAuth Error`,
        error.message,
        'Failed to generate authorization URL'
      ));
    }
  }

  async handleCallback(req, res) {
    const { provider } = req.params;
    const { code, error, state } = req.query;
    
    console.log(`🔄 ${provider.toUpperCase()} Callback - Code:`, code ? 'Present' : 'Missing');
    console.log(`🔄 ${provider.toUpperCase()} Callback - Error:`, error);
    console.log(`🔄 ${provider.toUpperCase()} Callback - State:`, state);
    
    if (error) {
      console.error(`❌ ${provider} OAuth Error:`, error);
      return res.status(400).send(renderErrorPage(
        `${provider} OAuth Error`,
        error,
        'Authorization was denied or failed'
      ));
    }
    
    if (!code) {
      console.error(`❌ ${provider} OAuth: No authorization code received`);
      return res.status(400).send(renderErrorPage(
        `${provider} OAuth Error`,
        'No authorization code received',
        'The OAuth flow was incomplete'
      ));
    }
    
    try {
      console.log(`🔄 Attempting to exchange ${provider} code for token...`);
      const tokens = await oauthService.exchangeCodeForToken(provider, code);
      console.log(`✅ ${provider} token exchange successful`);
      
      console.log(`🔄 Attempting to get ${provider} user info...`);
      const user = await oauthService.getUserInfo(provider, tokens.accessToken);
      console.log(`✅ ${provider} user info received`);
      
      const savedUser = await oauthService.saveOrUpdateUser(provider, tokens, user);
      
      res.send(renderSuccessPage(provider, user, tokens, savedUser));
      
    } catch (error) {
      console.error(`❌ ${provider} OAuth Full Error:`, error);
      console.error(`❌ Error Stack:`, error.stack);
      
      let errorMessage = `${provider} OAuth Error: ${error.message}`;
      let debugInfo = [];
      
      if (error.response) {
        console.error(`❌ Error Response Status:`, error.response.status);
        console.error(`❌ Error Response Data:`, error.response.data);
        errorMessage += ` (Status: ${error.response.status})`;
        debugInfo.push(`Response Status: ${error.response.status}`);
        debugInfo.push(`Response Data: ${JSON.stringify(error.response.data)}`);
      }
      
      res.status(500).send(renderErrorPage(
        `${provider} OAuth Error`,
        errorMessage,
        'Failed during token exchange or user info retrieval',
        debugInfo
      ));
    }
  }
}

export const authController = new AuthController();
