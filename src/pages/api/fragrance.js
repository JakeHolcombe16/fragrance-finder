import { connectToDatabase } from '@/lib/db'
import Fragrance from '@/lib/models/Fragrance'

export default async function handler(req, res) {
    await connectToDatabase()

    if (req.method === 'POST') {
    try {
        const fragrance = await Fragrance.create(req.body)
        res.status(201).json(fragrance)
    } catch (err) {
        console.error(err)
        res.status(400).json({ error: 'Failed to create fragrance.' })
    }
}

    else if (req.method === 'GET') {
    try {
        const fragrances = await Fragrance.find({})
        res.status(200).json(fragrances)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch fragrances.' })
    }
}

    else {
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
}
}
