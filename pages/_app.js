import '../styles/globals.css'
import '../styles/mobile-optimization.css'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'

const KVGarageAssist = dynamic(() => import('../components/KVGarageAssist'), {
  ssr: false,
  loading: () => null,
})

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
          <KVGarageAssist />
        </Layout>
      </CartProvider>
    </AuthProvider>
  )
}
