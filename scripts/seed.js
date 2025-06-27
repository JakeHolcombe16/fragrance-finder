import dotenv from 'dotenv'
dotenv.config()

import Fragrance from '../src/lib/models/Fragrance.js'
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
    await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'fragrancefinder',
    })

    let brandLogos = {
        'Chanel': 'https://1000logos.net/wp-content/uploads/2016/11/Chanel-logo.png',
        'Dior': 'https://kreafolk.com/cdn/shop/articles/dior-logo-design-history-and-evolution-kreafolk_637ca925-15a9-4a0f-8b46-ee73ee0236eb.jpg?v=1717725054&width=2048',
    }

    console.log('Connected to MongoDB')

    await Fragrance.deleteMany({}) // Clear existing data

    const sampleFragrances = [
    {
        name: 'Bleu de Chanel',
        brand: 'Chanel',
        slug: 'bleu-de-chanel',
        imageUrl: 'https://www.chanel.com/images//t_one/t_fragrance//q_auto:good,f_auto,fl_lossy,dpr_1.1/w_1920/bleu-de-chanel-eau-de-toilette-spray-3-4fl-oz--packshot-default-107460-9564920184862.jpg',
        brandLogoUrl: brandLogos['Chanel'],
        prices: [
        {
            store: 'FragranceNet',
            url: 'https://www.fragrancenet.com',
            price: 89.99,
            inStock: true,
            lastChecked: new Date(),
        },
        {
            store: 'FragranceX',
            url: 'https://www.fragrancex.com',
            price: 92.49,
            inStock: true,
            lastChecked: new Date(),
        },
    ],
    },
    {
    name: 'Chanel Allure Homme Sport',
    brand: 'Chanel',
    concentration: 'Eau de Toilette',
    slug: 'chanel-allure-homme-sport',
    imageUrl: 'https://www.chanel.com/images//t_one/t_fragrance//q_auto:good,f_auto,fl_lossy,dpr_1.1/w_1920/allure-homme-sport-eau-de-toilette-spray-3-4fl-oz--packshot-default-123630-9564892856350.jpg',
    brandLogoUrl: brandLogos['Chanel'],
    notes: {
      top: ['Aldehydes', 'Orange'],
      middle: ['Neroli', 'Pepper'],
      base: ['Tonka Bean', 'Cedar']
    },
    prices: [
      { store: 'FragranceX', url: 'https://fragrancex.com', price: 76.49, inStock: true, lastChecked: new Date() }
    ]
  },
    {
        name: 'Dior Sauvage',
        brand: 'Dior',
        slug: 'dior-sauvage',
        brandLogoUrl:  brandLogos['Dior'],
        imageUrl: 'https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dwb57d0b59/Y0685240/Y0685240_F068524009_E01_GHC.jpg?sw=800',
        prices: [
        {
            store: 'FragranceNet',
            url: 'https://www.fragrancenet.com',
            price: 84.50,
            inStock: true,
            lastChecked: new Date(),
        },
        ],
    },
    {
    name: 'Dior Homme Intense',
    brand: 'Dior',
    concentration: 'Eau de Parfum',
    slug: 'dior-homme-intense',
    imageUrl: 'https://www.lojaglamourosa.com/resources/medias/shop/products/thumbnails/shop-brand-large/shop-pf-00108-02-dior-homme-intense-edp-vap---100-ml--1.jpg',
    brandLogoUrl: brandLogos['Dior'],
    notes: {
      top: ['Lavender'],
      middle: ['Iris', 'Amber'],
      base: ['Vetiver', 'Cedar']
    },
    prices: [
      { store: 'FragranceX', url: 'https://fragrancex.com', price: 98.00, inStock: true, lastChecked: new Date() }
    ]
  }
    
]

    await Fragrance.insertMany(sampleFragrances)
    console.log('Fragrances seeded!')
    mongoose.connection.close()
}

seed().catch(err => {
    console.error(err)
    mongoose.connection.close()
})