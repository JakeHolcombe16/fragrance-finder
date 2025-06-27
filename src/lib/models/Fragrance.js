import mongoose from 'mongoose'

const FragranceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    concentration: { type: String, enum: ['Eau de Toillete', 'Eau de Parfum', 'Parfum', 'Eau de Cologne', "Extrait de Parfum"], default: 'Eau de Toillete' },
    notes: {
        top: [String],
        middle: [String],
        base: [String],
    },
    slug: { type: String, required: true, unique: true }, // Dynamic route slug
    imageUrl: String,
    brandLogoUrl: String,
    prices: [
    {
        store: String,         // e.g., "FragranceNet"
        url: String,           // direct link to product
        price: Number,         // price in USD
        inStock: Boolean,
        lastChecked: Date
    }
],
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Fragrance || mongoose.model('Fragrance', FragranceSchema)
