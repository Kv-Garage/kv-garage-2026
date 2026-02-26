import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {

  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const SITE_PASSWORD = "KVgarage2026!"

  useEffect(() => {
    const storedAuth = localStorage.getItem("kv_site_auth")
    if (storedAuth === "true") {
      setAuthorized(true)
    }
    setLoading(false)
  }, [])

  const publicRoutes = ["/success", "/cancel"]
  const isPublicRoute = publicRoutes.includes(router.pathname)

  const handleUnlock = () => {
    if (passwordInput.trim() === SITE_PASSWORD) {
      localStorage.setItem("kv_site_auth", "true")
      setAuthorized(true)
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  if (loading) return null

  if (!authorized && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="max-w-md w-full text-center">

          <h1 className="text-3xl font-bold mb-6">
            Private Access
          </h1>

          <p className="text-gray-600 mb-6">
            This site is currently under development.
          </p>

          <input
            type="password"
            placeholder="Enter site password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value)
              setError("")
            }}
            className="border w-full px-4 py-3 rounded-md mb-4"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handleUnlock}
            className="bg-black text-white px-6 py-3 rounded-md font-semibold w-full"
          >
            Confirm Access
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