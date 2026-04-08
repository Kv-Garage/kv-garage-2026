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
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setError("Email not confirmed. Please check your inbox for the confirmation link.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      setError("Unable to log in. Please try again.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // Try to get profile by email instead
      const { data: profileByEmail } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();
      
      if (!profileByEmail) {
        setError("Account profile not found. Please contact support. Error: " + profileError.message);
        setLoading(false);
        return;
      }
      
      // Use the profile found by email
      const profile = profileByEmail;
      
      // Continue with the rest of the logic
      if (profile.role === "admin") {
        router.push("/admin");
        setLoading(false);
        return;
      }

      if (profile.role === "affiliate_pending" && !profile.approved) {
        await supabase.auth.signOut();
        setError("Your affiliate application is pending approval. You will receive an email once approved.");
        setLoading(false);
        return;
      }

      if (profile.role === "wholesale" && !profile.approved) {
        await supabase.auth.signOut();
        setError("Wholesale account pending approval. Please wait for confirmation.");
        setLoading(false);
        return;
      }

      // If profile exists but approved is null or undefined, treat as not approved for pending roles
      if ((profile.role === "affiliate_pending" || profile.role === "wholesale") && (profile.approved === null || profile.approved === undefined || !profile.approved)) {
        await supabase.auth.signOut();
        setError("Your account is pending approval. Please wait for confirmation.");
        setLoading(false);
        return;
      }

      router.push("/shop");
      return;
    }

    if (!profile) {
      // Most likely wholesale pending approval path
      await supabase.auth.signOut();
      setError("Your account is pending approval. You cannot log in until a manager approves your application.");
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
      setLoading(false);
      return;
    }

    // Handle pending affiliate accounts
    if (profile.role === "affiliate_pending" && !profile.approved) {
      await supabase.auth.signOut();
      setError("Your affiliate application is pending approval. You will receive an email once approved.");
      setLoading(false);
      return;
    }

    // If profile exists but approved is null or undefined, treat as not approved for pending roles
    if ((profile.role === "affiliate_pending" || profile.role === "wholesale") && (profile.approved === null || profile.approved === undefined || !profile.approved)) {
      await supabase.auth.signOut();
      setError("Your account is pending approval. Please wait for confirmation.");
      setLoading(false);
      return;
    }

    if (profile.role === "wholesale" && !profile.approved) {
      await supabase.auth.signOut();
      setError("Wholesale account pending approval. Please wait for confirmation.");
      setLoading(false);
      return;
    }

    router.push("/shop");
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 rounded bg-[#111827]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

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