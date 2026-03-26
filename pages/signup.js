import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    role: "retail",
    partner: "ipvalue",
    reseller: "no",
    monthly_volume: "beginner",
    has_license: "no",
    website: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/login`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // Wholesale users are reviewed via the applications table and require manual approval
    if (form.role === "wholesale") {
      const { error: applicationError } = await supabase.from("applications").insert([
        {
          user_id: user?.id,
          name: form.full_name,
          email: form.email,
          business_type: form.role,
          volume: form.monthly_volume,
          sales_channel: form.website || "",
          experience: form.reseller,
          status: "pending",
        },
      ]);

      if (applicationError) {
        setError(applicationError.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push("/login?message=waiting_approval");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user?.id,
        email: form.email,
        full_name: form.full_name,
        phone: form.phone,
        company: form.company,
        role: form.role,
        partner: form.partner,
        reseller: form.reseller === "yes",
        monthly_volume: form.monthly_volume,
        has_license: form.has_license === "yes",
        approved: true,
      },
    ]);

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/login?message=check_email");
  };

  return (
    <>
      <Head>
        <title>Apply for Supply Access | KV Garage</title>
        <meta
          name="description"
          content="Apply for access to KV Garage’s verified supply network. Built for IP Value students, resellers, and wholesale buyers looking to scale."
        />
      </Head>

      <div className="min-h-screen bg-[#05070D] text-white px-6 py-16">

        <div className="max-w-5xl mx-auto">

          {/* 🔥 LOGO */}
          <div className="flex justify-center mb-10">
           <img src="/logo.png" className="w-28 mx-auto" />
          </div>

          {/* 🔥 HEADER */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Apply for Supply Access
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto">
              This is not a standard retail account. KV Garage provides structured access to verified inventory,
              supplier pricing, and scalable systems used by serious operators and IP Value Management students.
            </p>
          </div>

          {/* 🔥 TRUST SECTIONS */}
          <div className="grid md:grid-cols-2 gap-10 mb-16 text-sm text-gray-300">

            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-2">What You’re Getting Access To</h3>
              <p>
                Access to real supply chains, not random products. You’ll be connected to inventory that is actively being
                moved, tested, and scaled. This includes retail-ready products, pallet opportunities, and supplier relationships
                that are normally not accessible to beginners.
              </p>
            </div>

            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-2">Who This Is For</h3>
              <p>
                This is for individuals serious about selling products, building systems, and scaling revenue. Whether you are
                an IP Value student, independent reseller, or wholesale buyer, this platform is designed to support real operations.
              </p>
            </div>

            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-2">Approval Process</h3>
              <p>
                Not all applications are approved for full access. Wholesale accounts and high-volume buyers are reviewed to ensure
                legitimacy. This protects the ecosystem, maintains pricing integrity, and ensures long-term scalability.
              </p>
            </div>

            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-2">Partner Integration</h3>
              <p>
                KV Garage works alongside partners like IP Value Management to provide supply infrastructure. If you are part of a
                partner system, your access will be aligned with that ecosystem.
              </p>
            </div>

          </div>

          {/* 🔥 FORM */}
          <form onSubmit={handleSignup} className="grid md:grid-cols-2 gap-6">

            <input name="full_name" placeholder="Full Name" onChange={handleChange} className="p-3 rounded bg-[#111827]" required />
            <input name="email" placeholder="Email" onChange={handleChange} className="p-3 rounded bg-[#111827]" required />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-3 rounded bg-[#111827]" required />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} className="p-3 rounded bg-[#111827]" />

            <input name="company" placeholder="Business / Brand Name" onChange={handleChange} className="p-3 rounded bg-[#111827]" />

            <select name="role" onChange={handleChange} className="p-3 rounded bg-[#111827]">
              <option value="retail">Retail Buyer</option>
              <option value="student">IP Value Student</option>
              <option value="wholesale">Wholesale Buyer</option>
            </select>

            <select name="partner" onChange={handleChange} className="p-3 rounded bg-[#111827]">
              <option value="ipvalue">IP Value Management</option>
              <option value="direct">Direct</option>
              <option value="other">Other</option>
            </select>

            <select name="reseller" onChange={handleChange} className="p-3 rounded bg-[#111827]">
              <option value="no">Not Yet Selling</option>
              <option value="yes">Currently Reselling</option>
            </select>

            <select name="monthly_volume" onChange={handleChange} className="p-3 rounded bg-[#111827]">
              <option value="beginner">Beginner</option>
              <option value="1k">$1k+/month</option>
              <option value="5k">$5k+/month</option>
              <option value="10k">$10k+/month</option>
            </select>

            <select name="has_license" onChange={handleChange} className="p-3 rounded bg-[#111827]">
              <option value="no">No Resale License</option>
              <option value="yes">Have Resale License</option>
            </select>

            <input name="website" placeholder="Website / Instagram (Proof)" onChange={handleChange} className="p-3 rounded bg-[#111827] md:col-span-2" />

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-[#D4AF37] text-black py-4 rounded font-semibold md:col-span-2">
              {loading ? "Submitting..." : "Submit Application"}
            </button>

          </form>

        </div>
      </div>
    </>
  );
}