import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import FragranceCard from '@/components/FragranceCard'

export default function WishlistPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { wishlist, loading } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || loading) {
    return (
      <main className="min-h-screen p-4 bg-black">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">My Wishlist</h1>
        <p className="text-center text-gray-400">Loading wishlist...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <main className="min-h-screen p-4 bg-black">
      <h1 className="text-4xl font-bold text-center mb-2 text-white">My Wishlist</h1>
      <p className="text-center text-gray-400 mb-8">
        {wishlist.length === 0 
          ? 'Your wishlist is empty. Add fragrances to your wishlist to see them here!'
          : `${wishlist.length} ${wishlist.length === 1 ? 'fragrance' : 'fragrances'} in your wishlist`
        }
      </p>

      {wishlist.length === 0 ? (
        <div className="text-center mt-12">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
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
          <p className="mt-4 text-gray-400">Start adding fragrances to your wishlist!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center text-black">
          {wishlist.map((fragrance) => (
            <FragranceCard key={fragrance._id} fragrance={fragrance} />
          ))}
        </div>
      )}
    </main>
  )
}

