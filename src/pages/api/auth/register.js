import { connectToDatabase } from '@/lib/db'
import User from '@/lib/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  await connectToDatabase()

  try {
    const { email, password, name } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || null,
      role: 'user' // Default role
    })

    // Generate token
    const token = generateToken(user._id.toString(), user.role)

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`)

    // Return user (without password)
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    }

    return res.status(201).json({
      user: userResponse,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    return res.status(500).json({ error: 'Failed to create user' })
  }
}

