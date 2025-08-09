// scripts/ingest_dior.js
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Fragrance from '../src/lib/models/Fragrance.js'
import { fileURLToPath } from 'url'

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Point dotenv to the .env in your project root
dotenv.config({
  path: path.resolve(__dirname, '../.env')
})
const MONGODB_URI = process.env.MONGODB_URI
const JSON_PATH = path.resolve(__dirname, '../../dior_scraped.json')
console.log('SJKDJSAK:LDJSA' + JSON_PATH)

// simple slugify
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// optional brand logos you already use in seed.js
const brandLogos = {
  'Dior': 'https://kreafolk.com/cdn/shop/articles/dior-logo-design-history-and-evolution-kreafolk_637ca925-15a9-4a0f-8b46-ee73ee0236eb.jpg?v=1717725054&width=2048',
  'Chanel': 'https://1000logos.net/wp-content/uploads/2016/11/Chanel-logo.png',
}

async function run() {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true, useUnifiedTopology: true, dbName: 'fragrancefinder',
  })

  const raw = fs.readFileSync(JSON_PATH, 'utf-8')
  const items = JSON.parse(raw)

  let upserts = 0
  for (const it of items) {
    const { name, brand, collection = '', concentration = '', notes = {}, url } = it

    // Normalize notes from your scraper
    // if notes looks like {"notes":[...]} => move into notes.general
    let normalizedNotes = { top: [], middle: [], base: [], general: [] }
    if (Array.isArray(notes.notes)) {
      normalizedNotes.general = notes.notes
    } else {
      normalizedNotes.top = notes.top || []
      normalizedNotes.middle = notes.middle || []
      normalizedNotes.base = notes.base || []
    }

    const slug = slugify(`${brand}-${name}`)

    // placeholders; you can enrich later in separate jobs
    const imageUrl = ''         // fill later from brand site/parfumo
    const brandLogoUrl = brandLogos[brand] || ''
    const prices = []           // fill later from discounters
    const doc = {
      name, brand, collection,
      concentration: concentration || undefined,
      notes: normalizedNotes,
      slug, imageUrl, brandLogoUrl, prices,
      // keep the source url if you want
      sourceUrl: url, // optional: add to schema if you like
    }

    await Fragrance.updateOne(
      { slug },
      { $set: doc },
      { upsert: true }
    )
    upserts++
  }

  console.log(`Upserted ${upserts} Dior fragrances.`)
  await mongoose.connection.close()
}

run().catch(err => {
  console.error(err)
  mongoose.connection.close()
})
