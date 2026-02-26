import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {

  const [authorized, setAuthorized] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const router = useRouter()

  const SITE_PASSWORD = "KVgarage2026!"

  useEffect(() => {
    const storedAuth = localStorage.getItem("kv_site_auth")
    if (storedAuth === "true") {
      setAuthorized(true)
    }
  }, [])

  // Allow Stripe success + cancel pages to load without block
  const publicRoutes = ["/success", "/cancel"]
  const isPublicRoute = publicRoutes.includes(router.pathname)

  if (!authorized && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md w-full text-center">

          <h1 className="text-3xl font-bold text-royal mb-6">
            Private Access
          </h1>

          <p className="text-gray-600 mb-6">
            This site is currently under development.
          </p>

          <input
            type="password"
            placeholder="Enter site password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border w-full px-4 py-3 rounded-md mb-4"
          />

          <button
            onClick={() => {
              if (passwordInput === SITE_PASSWORD) {
                localStorage.setItem("kv_site_auth", "true")
                setAuthorized(true)
              }
            }}
            className="bg-royal text-white px-6 py-3 rounded-md font-semibold w-full"
          >
            Enter
          </button>

        </div>
      </div>
    )
  }

  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  )
}