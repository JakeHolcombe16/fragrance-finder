import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <>
      <header className="bg-black text-white px-6 py-4 shadow-md">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-bold">
            Fragrance Finder
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/brands" className="hover:underline">Brands</Link>
          </div>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </>
  )
}
