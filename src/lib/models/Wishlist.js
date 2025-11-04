// src/lib/models/Wishlist.js
import mongoose from 'mongoose'

const WishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fragrance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fragrance',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Ensure a user can only add a fragrance once (unique combination)
WishlistSchema.index({ user: 1, fragrance: 1 }, { unique: true })

export default mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema)

