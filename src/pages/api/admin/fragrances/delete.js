import { connectToDatabase } from '@/lib/db'
import Fragrance from '@/lib/models/Fragrance'
import { requireAdmin } from '@/lib/auth'

async function handler(req, res) {
  await connectToDatabase()

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  try {
    const { fragranceIds } = req.body

    if (!fragranceIds || !Array.isArray(fragranceIds) || fragranceIds.length === 0) {
      return res.status(400).json({ error: 'Fragrance IDs array is required' })
    }

    // Delete fragrances
    const result = await Fragrance.deleteMany({
      _id: { $in: fragranceIds }
    })

    return res.status(200).json({
      message: `Successfully deleted ${result.deletedCount} fragrance(s)`,
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return res.status(500).json({ error: 'Failed to delete fragrances' })
  }
}

export default requireAdmin(handler)

