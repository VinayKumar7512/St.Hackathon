import { App } from './src/app.js';

// Create and start the application
const app = new App();
app.start().catch(error => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});
