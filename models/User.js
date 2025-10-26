import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['google', 'github', 'reddit']
  },
  providerId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  profilePicture: {
    type: String,
    required: false
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: false
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
    required: true
  },
  rawTokenData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  loginCount: {
    type: Number,
    default: 1
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
