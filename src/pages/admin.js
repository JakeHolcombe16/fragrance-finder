import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [fragrances, setFragrances] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [showAddForm, setShowAddForm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBrand, setFilterBrand] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }
      if (!isAdmin) {
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router])

  useEffect(() => {
    if (isAdmin) {
      fetchFragrances()
    }
  }, [isAdmin])

  const fetchFragrances = async () => {
    try {
      const response = await fetch('/api/fragrance')
      if (response.ok) {
        const data = await response.json()
        setFragrances(data)
      }
    } catch (error) {
      console.error('Failed to load fragrances:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(filteredFragrances.map(f => f._id))
      setSelectedIds(allIds)
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleSelectOne = (fragranceId) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(fragranceId)) {
      newSelected.delete(fragranceId)
    } else {
      newSelected.add(fragranceId)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      alert('Please select at least one fragrance to delete')
      return
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} fragrance(s)? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch('/api/admin/fragrances/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ fragranceIds: Array.from(selectedIds) })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Successfully deleted ${data.deletedCount} fragrance(s)`)
        setSelectedIds(new Set())
        fetchFragrances()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete fragrances'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete fragrances')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Get unique brands for filter
  const brands = [...new Set(fragrances.map(f => f.brand).filter(Boolean))].sort()

  // Filter fragrances
  const filteredFragrances = fragrances.filter(f => {
    const matchesSearch = !searchTerm || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBrand = !filterBrand || f.brand === filterBrand
    return matchesSearch && matchesBrand
  })

  if (authLoading || loading) {
    return (
      <main className="min-h-screen p-4 bg-black">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Admin Dashboard</h1>
        <p className="text-center text-gray-400">Loading...</p>
      </main>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <main className="min-h-screen p-4 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            {showAddForm ? 'Cancel' : '+ Add Fragrance'}
          </button>
          
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
            >
              {deleteLoading ? 'Deleting...' : `Delete ${selectedIds.size} Selected`}
            </button>
          )}

          <div className="flex-1"></div>

          <input
            type="text"
            placeholder="Search fragrances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded text-black"
          />

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="px-4 py-2 rounded text-black"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Add Fragrance Form */}
        {showAddForm && (
          <AddFragranceForm
            onSuccess={() => {
              setShowAddForm(false)
              fetchFragrances()
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Fragrances Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredFragrances.length && filteredFragrances.length > 0}
                      onChange={handleSelectAll}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-left">Concentration</th>
                  <th className="px-4 py-3 text-left">Prices</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredFragrances.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      {fragrances.length === 0 ? 'No fragrances found' : 'No fragrances match your filters'}
                    </td>
                  </tr>
                ) : (
                  filteredFragrances.map((fragrance) => (
                    <tr key={fragrance._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(fragrance._id)}
                          onChange={() => handleSelectOne(fragrance._id)}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{fragrance.name}</td>
                      <td className="px-4 py-3">{fragrance.brand}</td>
                      <td className="px-4 py-3">{fragrance.concentration || 'N/A'}</td>
                      <td className="px-4 py-3">
                        {fragrance.prices?.length > 0 ? (
                          <span className="text-green-600 font-semibold">
                            ${Math.min(...fragrance.prices.map(p => p.price)).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">No prices</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(fragrance.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-gray-400 text-sm">
          Showing {filteredFragrances.length} of {fragrances.length} fragrances
        </div>
      </div>
    </main>
  )
}

function AddFragranceForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    collectionName: '',
    concentration: 'Eau de Toilette',
    slug: '',
    imageUrl: '',
    brandLogoUrl: '',
    notes: {
      top: [],
      middle: [],
      base: [],
      general: []
    },
    prices: []
  })
  const [noteInputs, setNoteInputs] = useState({
    top: '',
    middle: '',
    base: '',
    general: ''
  })
  const [priceInput, setPriceInput] = useState({
    store: '',
    url: '',
    price: '',
    inStock: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (name, brand) => {
    const combined = `${brand}-${name}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return combined
  }

  const handleNameBrandChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      // Auto-generate slug if name and brand are both filled
      if (updated.name && updated.brand && !prev.slug) {
        updated.slug = generateSlug(updated.name, updated.brand)
      }
      return updated
    })
  }

  const handleAddNote = (type) => {
    const note = noteInputs[type].trim()
    if (note) {
      setFormData(prev => ({
        ...prev,
        notes: {
          ...prev.notes,
          [type]: [...prev.notes[type], note]
        }
      }))
      setNoteInputs(prev => ({ ...prev, [type]: '' }))
    }
  }

  const handleRemoveNote = (type, index) => {
    setFormData(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [type]: prev.notes[type].filter((_, i) => i !== index)
      }
    }))
  }

  const handleAddPrice = () => {
    if (priceInput.store && priceInput.url && priceInput.price) {
      setFormData(prev => ({
        ...prev,
        prices: [...prev.prices, {
          store: priceInput.store,
          url: priceInput.url,
          price: parseFloat(priceInput.price),
          inStock: priceInput.inStock,
          lastChecked: new Date()
        }]
      }))
      setPriceInput({ store: '', url: '', price: '', inStock: true })
    }
  }

  const handleRemovePrice = (index) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.brand || !formData.slug) {
      setError('Name, Brand, and Slug are required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/fragrance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
        // Reset form
        setFormData({
          name: '',
          brand: '',
          collectionName: '',
          concentration: 'Eau de Toilette',
          slug: '',
          imageUrl: '',
          brandLogoUrl: '',
          notes: { top: [], middle: [], base: [], general: [] },
          prices: []
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create fragrance')
      }
    } catch (error) {
      console.error('Error creating fragrance:', error)
      setError('Failed to create fragrance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Add New Fragrance</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameBrandChange('name', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand *</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleNameBrandChange('brand', e.target.value)}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Collection Name</label>
            <input
              type="text"
              value={formData.collectionName}
              onChange={(e) => setFormData(prev => ({ ...prev, collectionName: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Concentration *</label>
            <select
              value={formData.concentration}
              onChange={(e) => setFormData(prev => ({ ...prev, concentration: e.target.value }))}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Eau de Toilette">Eau de Toilette</option>
              <option value="Eau de Parfum">Eau de Parfum</option>
              <option value="Parfum">Parfum</option>
              <option value="Eau de Cologne">Eau de Cologne</option>
              <option value="Extrait de Parfum">Extrait de Parfum</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              className="w-full px-3 py-2 border rounded"
              placeholder="Auto-generated from name and brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand Logo URL</label>
            <input
              type="url"
              value={formData.brandLogoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, brandLogoUrl: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Notes</h3>
          {['top', 'middle', 'base', 'general'].map(type => (
            <div key={type} className="mb-3">
              <label className="block text-sm font-medium mb-1 capitalize">{type} Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInputs[type]}
                  onChange={(e) => setNoteInputs(prev => ({ ...prev, [type]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote(type))}
                  placeholder={`Add ${type} note and press Enter`}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(type)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.notes[type].map((note, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1">
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(type, idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Prices */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Prices</h3>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Store"
              value={priceInput.store}
              onChange={(e) => setPriceInput(prev => ({ ...prev, store: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <input
              type="url"
              placeholder="URL"
              value={priceInput.url}
              onChange={(e) => setPriceInput(prev => ({ ...prev, url: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={priceInput.price}
              onChange={(e) => setPriceInput(prev => ({ ...prev, price: e.target.value }))}
              className="px-3 py-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={priceInput.inStock}
                  onChange={(e) => setPriceInput(prev => ({ ...prev, inStock: e.target.checked }))}
                />
                In Stock
              </label>
              <button
                type="button"
                onClick={handleAddPrice}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {formData.prices.map((price, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="flex-1">{price.store}: ${price.price.toFixed(2)} {price.inStock ? '' : '(Out of Stock)'}</span>
                <a href={price.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                  {price.url}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemovePrice(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Fragrance'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

