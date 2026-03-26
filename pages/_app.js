import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import dynamic from 'next/dynamic'

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
