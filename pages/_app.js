import '../styles/globals.css'
import '../styles/mobile-optimization.css'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { useDevice } from '../hooks/useDevice'
import MobileLayout from '../components/layout/MobileLayout'
import DesktopLayout from '../components/layout/DesktopLayout'
import dynamic from 'next/dynamic'

const KVGarageAssist = dynamic(() => import('../components/KVGarageAssist'), {
  ssr: false,
  loading: () => null,
})

export default function MyApp({ Component, pageProps }) {
  const device = useDevice();

  // Show loading state while determining device type
  if (typeof window !== 'undefined' && device.width === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Use mobile layout for mobile devices, desktop layout for desktop
  const Layout = device.isMobile ? MobileLayout : DesktopLayout;

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
