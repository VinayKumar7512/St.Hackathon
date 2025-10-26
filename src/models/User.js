import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google', 'github', 'reddit', 'twitter', 'instagram'],
    index: true
  },
  providerId: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  username: {
    type: String,
    required: false,
    trim: true
  },
  profilePicture: {
    type: String,
    required: false
  },
  accessToken: {
    type: String,
    required: true,
    select: false // Don't include in queries by default for security
  },
  refreshToken: {
    type: String,
    required: false,
    select: false
  },
  tokenType: {
    type: String,
    default: 'Bearer'
  },
  expiresIn: {
    type: Number,
    required: false
  },
  scope: {
    type: String,
    required: false
  },
  rawUserData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    select: false // Don't include by default
  },
  rawTokenData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    select: false
  },
  loginCount: {
    type: Number,
    default: 1,
    min: 1
  },
  lastLogin: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.accessToken;
      delete ret.refreshToken;
      delete ret.rawUserData;
      delete ret.rawTokenData;
      return ret;
    }
  }
});

// Compound index for unique provider + providerId combination
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

// Index for efficient queries
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Instance methods
userSchema.methods.updateLoginInfo = function() {
  this.loginCount += 1;
  this.lastLogin = new Date();
  return this.save();
};

userSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// Static methods
userSchema.statics.findByProvider = function(provider, providerId) {
  return this.findOne({ provider, providerId, isActive: true });
};

userSchema.statics.getActiveUsers = function() {
  return this.find({ isActive: true }).sort({ lastLogin: -1 });
};

userSchema.statics.getUserStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$provider', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

const User = mongoose.model('User', userSchema);

export { User };
