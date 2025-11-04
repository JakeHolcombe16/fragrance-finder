import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'

export default function FragranceCard({ fragrance }) {
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [loading, setLoading] = useState(false)

  const lowestPrice = fragrance.prices?.reduce((min, p) => p.price < min ? p.price : min, fragrance.prices[0]?.price || 0)
  const inWishlist = isInWishlist(fragrance._id)

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      if (inWishlist) {
        await removeFromWishlist(fragrance._id)
      } else {
        await addToWishlist(fragrance._id)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded-2xl shadow p-4 w-full max-w-sm bg-white hover:shadow-lg transition relative">
      {/* Wishlist button */}
      {isAuthenticated && (
        <button
          onClick={handleWishlistToggle}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed z-10"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? (
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
        </button>
      )}

      <img
        src={fragrance.imageUrl}
        alt={fragrance.name}
        className="w-full h-64 object-contain mb-4"
      />
      <h2 className="text-xl font-semibold">{fragrance.name}</h2>
      <p className="text-gray-600">{fragrance.brand}</p>

      <div className="mt-2">
        <span className="text-green-600 font-bold text-lg">
          ${lowestPrice?.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 ml-1"> (lowest)</span>
      </div>

      <div className="mt-3 space-y-1">
        {fragrance.prices.map((entry, idx) => (
          <a
            key={idx}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-blue-600 underline hover:text-blue-800"
          >
            {entry.store}: ${entry.price.toFixed(2)} {entry.inStock ? '' : '(Out of Stock)'}
          </a>
        ))}
      </div>
    </div>
  )
}