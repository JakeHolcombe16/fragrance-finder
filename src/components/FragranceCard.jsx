export default function FragranceCard({ fragrance }) {
  const lowestPrice = fragrance.prices?.reduce((min, p) => p.price < min ? p.price : min, fragrance.prices[0]?.price || 0)

  return (
    <div className="border rounded-2xl shadow p-4 w-full max-w-sm bg-white hover:shadow-lg transition">
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