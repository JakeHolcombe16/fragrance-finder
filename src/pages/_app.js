import "@/styles/globals.css"
import Layout from "@/components/Layout"
import { AuthProvider } from "@/contexts/AuthContext"
import { WishlistProvider } from "@/contexts/WishlistContext"

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WishlistProvider>
    </AuthProvider>
  )
}
