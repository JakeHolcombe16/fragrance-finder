import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function FragranceDetail() {
    const router = useRouter()
    const { slug } = router.query
    const [fragrance, setFragrance] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        fetch(`/api/fragrance/${slug}`)
            .then(res => res.json())
            .then(data => {
                setFragrance(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load fragrance:', err)
                setLoading(false)
            })
    }, [slug])

    if (loading) return <div className="text-center p-10 text-white">Loading...</div>
    if (!fragrance || fragrance.error) return <div className="text-center p-10 text-white">Fragrance not found</div>

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10">
            <Head>
                <title>{fragrance.name} - Fragrance Finder</title>
            </Head>

            <button
                onClick={() => router.back()}
                className="mb-6 text-gray-400 hover:text-white transition"
            >
                &larr; Back
            </button>

            <div className="max-w-4xl mx-auto bg-white text-black rounded-2xl shadow-xl overflow-hidden">
                <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
                        {fragrance.imageUrl ? (
                            <img
                                src={fragrance.imageUrl}
                                alt={fragrance.name}
                                className="max-h-96 object-contain"
                            />
                        ) : (
                            <div className="h-64 w-full flex items-center justify-center text-gray-400 bg-gray-200 rounded">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-8">
                        <h1 className="text-3xl font-bold mb-2">{fragrance.name}</h1>

                        <Link href={`/brands/${encodeURIComponent(fragrance.brand.toLowerCase())}`}>
                            <p className="text-xl text-gray-600 mb-4 hover:text-blue-600 hover:underline cursor-pointer">
                                {fragrance.brand}
                            </p>
                        </Link>

                        {fragrance.concentration && (
                            <div className="mb-4">
                                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {fragrance.concentration}
                                </span>
                            </div>
                        )}

                        <div className="border-t border-gray-200 my-6 pt-6">
                            <h3 className="text-lg font-semibold mb-3">Where to Buy</h3>
                            <div className="space-y-2">
                                {/* Placeholders for now */}
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer">
                                    <span className="font-medium">Website 1 (Discounter)</span>
                                    <span className="text-green-600 font-bold">$99.99</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition cursor-pointer">
                                    <span className="font-medium">Website 2 (Discounter)</span>
                                    <span className="text-green-600 font-bold">$105.50</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-6 pt-6">
                            <h3 className="text-lg font-semibold mb-3">Price History</h3>
                            <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                                Price Graph Placeholder
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
