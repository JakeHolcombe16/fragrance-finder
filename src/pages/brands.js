import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function BrandsPage() {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)

   
    useEffect(() => {
  fetch('/api/fragrance')
    .then(res => res.json())
    .then(data => {
      const brandMap = new Map()
      data.forEach(f => {
        if (!brandMap.has(f.brand)) {
          brandMap.set(f.brand, f.brandLogoUrl || null)
        }
      })

      const sorted = Array.from(brandMap.entries()).sort((a, b) =>
        a[0].toLowerCase().localeCompare(b[0].toLowerCase())
      )

      setBrands(sorted)
      setLoading(false)
    })
}, [])



    return (
    <main className="min-h-screen p-4 bg-black">
        <h1 className="text-3xl font-bold text-center mb-8">All Brands</h1>

        {loading ? (
        <p className="text-center">Loading brands...</p>
    ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
            {brands.map(([brand, logo]) => (
  <Link
    href={`/brands/${encodeURIComponent(brand.toLowerCase())}`}
    key={brand}
    className="w-full max-w-xs p-4 border rounded-xl shadow hover:shadow-md transition bg-gray-50 text-center flex flex-col items-center space-y-2"
  >
    {logo && (
      <img
        src={logo}
        alt={`${brand} logo`}
        className="h-12 object-contain"
      />
    )}
    <span className="text-lg font-medium text-gray-800">{brand}</span>
  </Link>
))}

        </div>
        )}
    </main>
    )
}
