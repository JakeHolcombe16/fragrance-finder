import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/User'
import { verifyToken } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  await connectToDatabase()

  try {
    // Get token from cookie or authorization header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Find user
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return user
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }

    return res.status(200).json({ user: userResponse })
  } catch (error) {
    console.error('Get current user error:', error)
    return res.status(500).json({ error: 'Failed to get user' })
  }
}

