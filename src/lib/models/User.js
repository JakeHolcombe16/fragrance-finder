// src/lib/models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  name: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

// Index for faster queries
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

// Ensure email is unique (additional check)
UserSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)

