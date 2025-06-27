import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FragranceCard from '@/components/FragranceCard'

export default function BrandPage() {
  const router = useRouter()
  const { brand } = router.query
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)
  const [concentration, setConcentration] = useState('All')


  useEffect(() => {
  if (!brand) return

  fetch('/api/fragrance')
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(f =>
        f.brand.toLowerCase() === brand.toLowerCase()
      )
      if (concentration !== 'All') {
        filtered = filtered.filter(f => f.concetration === concentration)
        }

      filtered.sort((a, b) => {
        const aPrice = Math.min(...a.prices.map(p => p.price))
        const bPrice = Math.min(...b.prices.map(p => p.price))
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice
      })

      setFragrances(filtered)
      setLoading(false)
    })
}, [brand, sortOrder]) // ✅ Now includes sortOrder


  return (
    <main className="min-h-screen p-4 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">
        {brand} Fragrances
      </h1>
        <div className="flex justify-center gap-4 mb-6">
  <button
    onClick={() => setSortOrder('asc')}
    className={`px-4 py-2 rounded ${
      sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    }`}
  >
    Sort by Lowest Price
  </button>
  <button
    onClick={() => setSortOrder('desc')}
    className={`px-4 py-2 rounded ${
      sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    }`}
  >
    Sort by Highest Price
  </button>
</div>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {fragrances.map(f => (
            <FragranceCard key={f._id} fragrance={f} />
          ))}
        </div>
      )}
    </main>
  )
}
