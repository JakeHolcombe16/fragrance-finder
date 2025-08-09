// // scripts/cleanup_bad_dior.js
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import path from 'path'
// import { fileURLToPath } from 'url'
// import Fragrance from '../src/lib/models/Fragrance.js'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// dotenv.config({ path: path.resolve(__dirname, '../.env') })

// await mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true, useUnifiedTopology: true, dbName: 'fragrancefinder'
// })

// // brand like "Dior 2015  Eau de Parfum", etc.
// const res = await Fragrance.deleteMany()
// console.log(`Deleted ${res.deletedCount} bad Dior docs.`)

// await mongoose.connection.close()
