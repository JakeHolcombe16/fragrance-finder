// src/lib/auth.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare a password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} - JWT token
 */
export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Middleware to require authentication for API routes
 * @param {function} handler - API route handler
 * @returns {function} - Wrapped handler with auth check
 */
export function requireAuth(handler) {
  return async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Attach user info to request object
    req.user = decoded
    return handler(req, res)
  }
}

/**
 * Middleware to require admin role for API routes
 * @param {function} handler - API route handler
 * @returns {function} - Wrapped handler with admin check
 */
export function requireAdmin(handler) {
  return async (req, res) => {
    // First check authentication
    const authHandler = requireAuth(async (req, res) => {
      // Then check admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' })
      }
      return handler(req, res)
    })

    return authHandler(req, res)
  }
}

