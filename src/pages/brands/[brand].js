import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import FragranceCard from '@/components/FragranceCard'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faFilter } from '@fortawesome/free-solid-svg-icons'

import {AnimatePresence, motion } from 'framer-motion'

export default function BrandPage() {
  const router = useRouter()
  const { brand } = router.query
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [concentration, setConcentration] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)


  
  useEffect(() => {
  if (!brand) return

  fetch('/api/fragrance')
    .then(res => res.json())
    .then(data => {
      let filtered = data.filter(f =>
        f.brand.toLowerCase() === brand.toLowerCase()
      )
      if (concentration !== 'All') {
        filtered = filtered.filter(f => f.concentration === concentration)
      }
      
      if (inStockOnly) {
        filtered = filtered.filter(f =>
          f.prices.some(p => p.inStock)
        )
      }
      
      if (minPrice) {
        filtered = filtered.filter(f =>
          f.prices.some(p => p.price >= parseFloat(minPrice))
        )
      }
      
      if (maxPrice) {
        filtered = filtered.filter(f =>
          f.prices.some(p => p.price <= parseFloat(maxPrice))
        )
}

      filtered.sort((a, b) => {
        const aPrice = Math.min(...a.prices.map(p => p.price))
        const bPrice = Math.min(...b.prices.map(p => p.price))
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice
      })
      
      setFragrances(filtered)
      setLoading(false)
    })
}, [brand, sortOrder, concentration])
const filterRef = useRef()
const filterButtonRef = useRef()

const isFiltered =
  concentration !== 'All' ||
  minPrice !== '' ||
  maxPrice !== '' ||
  inStockOnly
useEffect(() => {
  function handleClickOutside(event) {
    if (
      filterRef.current &&
      !filterRef.current.contains(event.target) &&
      !filterButtonRef.current.contains(event.target)
    ) {
      setFilterOpen(false)
    }
  }

  document.addEventListener('pointerdown', handleClickOutside)
  return () => document.removeEventListener('pointerdown', handleClickOutside)
}, [])



  return (
    <main className="min-h-screen p-4 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">
        {brand} Fragrances
      </h1>
        <div className="flex justify-center gap-4 mb-6">
</div>
<div className="relative mb-6 text-right">
  {/* Filter Button */}
  <button
  ref={filterButtonRef}
  onClick={() => setFilterOpen(prev => !prev)}
  className={`px-4 py-2 rounded transition-all duration-200 ease-in-out transform ${
    isFiltered
      ? 'bg-blue-600 text-white hover:bg-blue-700 scale-105 shadow-lg'
      : 'bg-gray-200 hover:bg-gray-300'
  }`}
>
    <FontAwesomeIcon icon={faFilter} className="mr-2" />
    Filters
  </button>
   
  {/* Filter options once open */}
  <AnimatePresence>

  {filterOpen && (
    <motion.div ref={filterRef} className="absolute right-0 mt-2 w-64 bg-white border rounded shadow p-4 z-10" 
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}>
      <p className="font-semibold mb-2">Concentration</p>
      {['All', 'Eau de Toilette', 'Eau de Parfum', 'Parfum', 'Eau de Cologne', 'Extrait de Parfum'].map((option) => (
        <label key={option} className="flex items-center gap-2 mb-1 cursor-pointer">
          <input
            type="radio"
            name="concentration"
            value={option}
            checked={concentration === option}
            onChange={() => setConcentration(option)}
            className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm text-white">{option}</span>
        </label>
      ))}
      <hr className="my-3" />

  <p className="font-semibold mb-1">Price Range</p>
  <div className="flex gap-2 mb-2">
    <input
      type="number"
      placeholder="Min"
      className="w-1/2 border px-2 py-1 rounded"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      />
    <input
      type="number"
      placeholder="Max"
      className="w-1/2 border px-2 py-1 rounded"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
      />
  </div>

  <label className="block mt-2">
    <input
      type="checkbox"
      checked={inStockOnly}
      onChange={(e) => setInStockOnly(e.target.checked)}
      className="mr-2"
      />
    In Stock Only
  </label>
  <hr className="my-3" />

    <button
      onClick={() => {
        setConcentration('All')
        setMinPrice('')
        setMaxPrice('')
        setInStockOnly(false)
        setFilterOpen(false)
      }}
      className="w-full mt-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
      Reset Filters
    </button>
    <hr className="my-3" />

<p className="font-semibold mb-1">Sort by Price</p>
<div className="flex gap-2 mb-2">
  <button
    onClick={() => setSortOrder('asc')}
    className={`flex-1 px-3 py-1 rounded text-sm ${
      sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    }`}
  >
    Lowest
  </button>
  <button
    onClick={() => setSortOrder('desc')}
    className={`flex-1 px-3 py-1 rounded text-sm ${
      sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-200'
    }`}
  >
    Highest
  </button>
</div>
    </motion.div>
    
  )}
</AnimatePresence>
  

</div>
      {/* Main page */}
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
