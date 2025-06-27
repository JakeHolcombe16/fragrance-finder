import { useEffect, useState } from 'react'
import FragranceCard from '@/components/FragranceCard'

export default function Home() {
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/fragrance')
      .then(res => res.json())
      .then(data => {
        console.log('API fragrance data:', data) // ✅ see if brandLogoUrl is there
        setFragrances(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load fragrances:', err)
        setLoading(false)
      })
  }, [])

  return (
    <main className="min-h-screen p-4 bg-black">
      <h1 className="text-4xl font-bold text-center mb-2">Fragrance Finder</h1>
      <p className="text-center text-gray-600 mb-8">
        🔥 Recommended Deals Today
      </p>

      {loading ? (
        <p className="text-center">Loading fragrances...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center text-black">
          {fragrances.map((fragrance) => (
            <FragranceCard key={fragrance._id} fragrance={fragrance} />
          ))}
        </div>
      )}
    </main>
  )
}
