import { connectToDatabase } from '@/lib/db'
import Wishlist from '@/lib/models/Wishlist'
import Fragrance from '@/lib/models/Fragrance'
import { requireAuth } from '@/lib/auth'

async function handler(req, res) {
  await connectToDatabase()

  // Get user from token
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const { verifyToken } = await import('@/lib/auth')
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const userId = decoded.userId

  if (req.method === 'GET') {
    try {
      // Get user's wishlist with fragrance details
      const wishlistItems = await Wishlist.find({ user: userId })
        .populate('fragrance')
        .sort({ createdAt: -1 })

      const fragrances = wishlistItems
        .filter(item => item.fragrance) // Filter out deleted fragrances
        .map(item => item.fragrance)

      return res.status(200).json(fragrances)
    } catch (error) {
      console.error('Get wishlist error:', error)
      return res.status(500).json({ error: 'Failed to fetch wishlist' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { fragranceId } = req.body

      if (!fragranceId) {
        return res.status(400).json({ error: 'Fragrance ID is required' })
      }

      // Check if fragrance exists
      const fragrance = await Fragrance.findById(fragranceId)
      if (!fragrance) {
        return res.status(404).json({ error: 'Fragrance not found' })
      }

      // Check if already in wishlist
      const existing = await Wishlist.findOne({ user: userId, fragrance: fragranceId })
      if (existing) {
        return res.status(400).json({ error: 'Fragrance already in wishlist' })
      }

      // Add to wishlist
      const wishlistItem = await Wishlist.create({
        user: userId,
        fragrance: fragranceId
      })

      await wishlistItem.populate('fragrance')
      return res.status(201).json({ message: 'Added to wishlist', fragrance: wishlistItem.fragrance })
    } catch (error) {
      console.error('Add to wishlist error:', error)
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Fragrance already in wishlist' })
      }
      return res.status(500).json({ error: 'Failed to add to wishlist' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}

export default handler

