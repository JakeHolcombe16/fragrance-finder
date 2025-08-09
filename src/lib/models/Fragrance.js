// src/lib/models/Fragrance.js
import mongoose from 'mongoose'

const PriceSchema = new mongoose.Schema({
  store: String,
  url: String,
  price: Number,
  inStock: Boolean,
  lastChecked: Date,
}, { _id: false })

const NotesSchema = new mongoose.Schema({
  top:  [String],
  middle: [String],
  base: [String],
  general: [String],      // ✅ for .nb_n cases
}, { _id: false })

const FragranceSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  brand:       { type: String, required: true },
  collectionName:  { type: String },                     // ✅ optional
  concentration: {
    type: String,
    enum: ['Eau de Toilette','Eau de Parfum','Parfum','Eau de Cologne','Extrait de Parfum'],
    default: 'Eau de Toilette'
  },
  notes:       NotesSchema,
  slug:        { type: String, required: true, unique: true },
  imageUrl:    { type: String },                     // ✅ fill later
  brandLogoUrl:{ type: String },                     // ✅ fill later
  prices:      { type: [PriceSchema], default: [] }, // ✅ fill later
  createdAt:   { type: Date, default: Date.now }
})

// Helpful secondary unique to avoid dupes if slugging ever changes
FragranceSchema.index({ brand: 1, name: 1 }, { unique: true })

export default mongoose.models.Fragrance || mongoose.model('Fragrance', FragranceSchema)


// import mongoose from 'mongoose'

// const FragranceSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     brand: { type: String, required: true },
//     collection: { type: String, required: false },
//     concentration: { type: String, enum: ['Eau de Toilette', 'Eau de Parfum', 'Parfum', 'Eau de Cologne', "Extrait de Parfum"], default: 'Eau de Toilette' },
//     notes: {
//         top: [String],
//         middle: [String],
//         base: [String],
//     },
//     slug: { type: String, required: true, unique: true }, // Dynamic route slug
//     imageUrl: String,
//     brandLogoUrl: String,
//     prices: [
//     {
//         store: String,         // e.g., "FragranceNet"
//         url: String,           // direct link to product
//         price: Number,         // price in USD
//         inStock: Boolean,
//         lastChecked: Date
//     }
// ],
//     createdAt: { type: Date, default: Date.now }
// })

// export default mongoose.models.Fragrance || mongoose.model('Fragrance', FragranceSchema)
