'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");

  // NOTE: this login path is for admin users only.
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = (email || "").trim().toLowerCase();
    const normalizedPassword = (password || "").trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    if (role !== "admin") {
      setError("Admin login only. Please switch to the admin role.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setError("Email not confirmed. Check your email for the confirmation link.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Login failed. No user returned.");
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        setError("User profile not found. Please contact support.");
        setLoading(false);
        return;
      }

      if (profile.role !== "admin") {
        setError("Access denied. Admin account required for this portal.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070D] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#111827] rounded-xl p-8 border border-[#1C2233]">

        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Access Control Login
        </h1>

        <div className="mb-6 text-center">
          <span className="mr-2 text-gray-300">Role:</span>
          <button
            onClick={() => setRole("client")}
            className={`px-3 py-1 rounded-l ${role === "client" ? "bg-[#D4AF37] text-black" : "bg-[#1C2233] text-gray-300"}`}
            type="button"
          >
            Client
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-3 py-1 rounded-r ${role === "admin" ? "bg-[#D4AF37] text-black" : "bg-[#1C2233] text-gray-300"}`}
            type="button"
          >
            Admin
          </button>
        </div>

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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#05070D] border border-[#1C2233] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300 hover:text-white"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
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
  );
}