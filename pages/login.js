import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/shop");
    }
  };

  return (
    <>
      <Head>
        <title>Login | KV Garage</title>
        <meta
          name="description"
          content="Access your KV Garage account to view supply pricing, inventory, and partner-level access."
        />
      </Head>

      <div className="min-h-screen bg-[#05070D] text-white flex items-center justify-center px-6">

        <div className="max-w-md w-full">

          {/* 🔥 LOGO */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" className="w-24" />
          </div>

          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3">
              Access Your Account
            </h1>

            <p className="text-gray-400 text-sm">
              Log in to access supply pricing, inventory, and your account dashboard.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-[#111827]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-[#111827]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black py-3 rounded font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* FOOTER */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Don’t have access yet?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-[#D4AF37] cursor-pointer"
            >
              Apply here
            </span>
          </div>

        </div>

      </div>
    </>
  );
}