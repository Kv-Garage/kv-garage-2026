import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Simple admin credentials (in production, use proper authentication)
  const ADMIN_EMAIL = "admin@kvgarage.com";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simple authentication check
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin auth in cookie (not localStorage)
        document.cookie = "adminAuth=true; path=/";
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>Admin Login | KV Garage</title>
      
      <div className="min-h-screen bg-[#05070D] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111827] rounded-xl p-8 border border-[#1C2233]">
          
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#05070D] border border-[#1C2233] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="admin@kvgarage.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#05070D] border border-[#1C2233] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-semibold py-3 rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Use admin credentials to access dashboard</p>
          </div>

        </div>
      </div>
    </>
  );
}