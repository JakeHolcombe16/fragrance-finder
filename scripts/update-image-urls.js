import dotenv from 'dotenv'
dotenv.config()

import Fragrance from '../src/lib/models/Fragrance.js'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function updateImageUrls() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'fragrancefinder',
  })

  console.log('Connected to MongoDB\n')

  try {
    // Update all fragrances to use /team1.jpg
    // Note: In Next.js, files in public folder are served from root, so use /team1.jpg not /public/team1.jpg
    const result = await Fragrance.updateMany(
      {}, // Match all documents
      { $set: { imageUrl: '/team1.jpg' } }
    )

    console.log(`✅ Successfully updated ${result.modifiedCount} fragrances`)
    console.log(`   Total fragrances matched: ${result.matchedCount}`)
    
    mongoose.connection.close()
  } catch (error) {
    console.error('Error updating image URLs:', error)
    mongoose.connection.close()
    process.exit(1)
  }
}

updateImageUrls().catch(err => {
  console.error(err)
  mongoose.connection.close()
  process.exit(1)
})

