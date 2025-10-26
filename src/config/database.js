import mongoose from 'mongoose';
import { config } from './env.js';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      mongoose.set('strictQuery', false);
      
      this.connection = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log('✅ Connected to MongoDB');
      await this.cleanupOldIndexes();
      
      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async cleanupOldIndexes() {
    try {
      const { User } = await import('../models/User.js');
      
      const oldIndexes = ['googleId_1', 'githubId_1', 'facebookId_1'];
      
      for (const indexName of oldIndexes) {
        try {
          await User.collection.dropIndex(indexName);
          console.log(`🗑️ Dropped old ${indexName} index`);
        } catch (error) {
          // Index might not exist, which is fine
        }
      }
    } catch (error) {
      console.warn('⚠️ Could not cleanup old indexes:', error.message);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('📴 Disconnected from MongoDB');
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

export const database = new Database();
