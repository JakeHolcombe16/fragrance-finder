import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/models/Wishlist'
import { verifyToken } from '@/lib/auth'

export default async function handler(req, res) {
  await connectToDatabase()

  // Get user from token
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const userId = decoded.userId
  const { fragranceId } = req.query

  if (req.method === 'DELETE') {
    try {
      if (!fragranceId) {
        return res.status(400).json({ error: 'Fragrance ID is required' })
      }

      const wishlistItem = await Wishlist.findOneAndDelete({
        user: userId,
        fragrance: fragranceId
      })

      if (!wishlistItem) {
        return res.status(404).json({ error: 'Fragrance not found in wishlist' })
      }

      return res.status(200).json({ message: 'Removed from wishlist' })
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      return res.status(500).json({ error: 'Failed to remove from wishlist' })
    }
  }

  if (req.method === 'GET') {
    try {
      if (!fragranceId) {
        return res.status(400).json({ error: 'Fragrance ID is required' })
      }

      const wishlistItem = await Wishlist.findOne({
        user: userId,
        fragrance: fragranceId
      })

      return res.status(200).json({ inWishlist: !!wishlistItem })
    } catch (error) {
      console.error('Check wishlist error:', error)
      return res.status(500).json({ error: 'Failed to check wishlist' })
    }
  }

  res.setHeader('Allow', ['DELETE', 'GET'])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}

