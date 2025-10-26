import { User } from '../models/User.js';
import { renderUsersPage } from '../utils/htmlRenderer.js';

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await User.getActiveUsers();
      const stats = await User.getUserStats();
      
      res.send(renderUsersPage(users, stats));
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      res.status(500).json({
        error: 'Failed to fetch users',
        message: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      res.status(500).json({
        error: 'Failed to fetch user',
        message: error.message
      });
    }
  }

  async getUserStats(req, res) {
    try {
      const stats = await User.getUserStats();
      const totalUsers = await User.countDocuments({ isActive: true });
      
      res.json({
        totalUsers,
        providerStats: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      res.status(500).json({
        error: 'Failed to fetch user statistics',
        message: error.message
      });
    }
  }

  async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
      
      await user.deactivate();
      
      res.json({
        message: 'User deactivated successfully',
        user: user
      });
    } catch (error) {
      console.error('❌ Error deactivating user:', error);
      res.status(500).json({
        error: 'Failed to deactivate user',
        message: error.message
      });
    }
  }
}

export const userController = new UserController();
