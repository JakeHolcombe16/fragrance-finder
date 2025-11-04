import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/wishlist', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setWishlist(data)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Fetch wishlist on mount and when auth changes
  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  // Check if fragrance is in wishlist
  const isInWishlist = useCallback((fragranceId) => {
    if (!fragranceId) return false
    return wishlist.some(item => item._id === fragranceId.toString())
  }, [wishlist])

  // Add fragrance to wishlist
  const addToWishlist = useCallback(async (fragranceId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required' }
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ fragranceId })
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh wishlist to get the full fragrance data
        await fetchWishlist()
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to add to wishlist' }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }, [isAuthenticated, fetchWishlist])

  // Remove fragrance from wishlist
  const removeFromWishlist = useCallback(async (fragranceId) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Authentication required' }
    }

    try {
      const response = await fetch(`/api/wishlist/${fragranceId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Update local state immediately for better UX
        setWishlist(prev => prev.filter(item => item._id !== fragranceId.toString()))
        return { success: true }
      } else {
        const data = await response.json()
        return { success: false, error: data.error || 'Failed to remove from wishlist' }
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }, [isAuthenticated])

  const value = useMemo(() => ({
    wishlist,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    refreshWishlist: fetchWishlist
  }), [wishlist, loading, isInWishlist, addToWishlist, removeFromWishlist, fetchWishlist])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

