import dotenv from 'dotenv'
dotenv.config()

import User from '../src/lib/models/User.js'
import { hashPassword } from '../src/lib/auth.js'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'fragrancefinder',
  })

  console.log('Connected to MongoDB\n')

  // Get command line arguments
  const args = process.argv.slice(2)
  const email = args[0]
  const password = args[1]
  const name = args[2] || null

  if (!email) {
    console.log('Usage: node scripts/create-admin.js <email> [password] [name]')
    console.log('\nTo create a new admin user:')
    console.log('  node scripts/create-admin.js admin@example.com mypassword123 "Admin User"')
    console.log('\nTo upgrade an existing user to admin:')
    console.log('  node scripts/create-admin.js existing@example.com')
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      // Upgrade existing user to admin
      if (existingUser.role === 'admin') {
        console.log(`User ${email} is already an admin!`)
        mongoose.connection.close()
        return
      }

      existingUser.role = 'admin'
      await existingUser.save()
      console.log(`✅ Successfully upgraded ${email} to admin!`)
      mongoose.connection.close()
      return
    }

    // Create new admin user
    if (!password) {
      console.log('Error: Password is required to create a new user')
      console.log('Usage: node scripts/create-admin.js <email> <password> [name]')
      process.exit(1)
    }

    const hashedPassword = await hashPassword(password)
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || null,
      role: 'admin'
    })

    console.log(`✅ Successfully created admin user: ${email}`)
    if (name) {
      console.log(`   Name: ${name}`)
    }
    console.log(`   Role: admin`)
    mongoose.connection.close()
  } catch (error) {
    console.error('Error:', error.message)
    if (error.code === 11000) {
      console.error('User with this email already exists')
    }
    mongoose.connection.close()
    process.exit(1)
  }
}

createAdmin().catch(err => {
  console.error(err)
  mongoose.connection.close()
  process.exit(1)
})

