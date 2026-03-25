import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  )
}