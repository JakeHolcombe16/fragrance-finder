import { connectToDatabase } from '@/lib/db'
import Fragrance from '@/lib/models/Fragrance'

export default async function handler(req, res) {
    const { slug } = req.query

    await connectToDatabase()

    if (req.method === 'GET') {
        try {
            const fragrance = await Fragrance.findOne({ slug })
            if (!fragrance) {
                return res.status(404).json({ error: 'Fragrance not found' })
            }
            res.status(200).json(fragrance)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Failed to fetch fragrance' })
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
