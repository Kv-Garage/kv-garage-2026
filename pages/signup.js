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
    website: "",
    // New affiliate fields
    want_affiliate: false,
    affiliate_platform: "",
    affiliate_following: "",
    affiliate_experience: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate affiliate fields if they want to be an affiliate
    if (form.want_affiliate) {
      if (!form.affiliate_platform.trim()) {
        setError("Please tell us about your platform");
        setLoading(false);
        return;
      }
    }

    // Prepare user metadata for the database trigger
    const userMetadata = {
      full_name: form.full_name,
      phone: form.phone,
      company: form.company,
      role: form.want_affiliate ? 'affiliate_pending' : form.role,
      partner: form.partner,
      reseller: form.reseller,
      monthly_volume: form.monthly_volume,
      has_license: form.has_license,
    };

    // Sign up without sending confirmation email to avoid rate limits
    // Use signUp with emailConfirm: false if your Supabase allows it
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://kvgarage.com"}/login`,
        data: userMetadata,
      },
    });

    // If rate limit error, provide a clearer message
    if (authError && authError.message.includes('rate limit')) {
      setError("Too many attempts. Please wait a minute before trying again, or use a different email address.");
      setLoading(false);
      return;
    }

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setError("Failed to create account. Please try again.");
      setLoading(false);
      return;
    }

    // Determine the role for the profile
    let profileRole = form.role;
    let isPending = false;

    // If they want to be an affiliate, set role to affiliate_pending
    if (form.want_affiliate) {
      profileRole = 'affiliate_pending';
      isPending = true;

      // Create affiliate application
      const affiliateReason = `${form.affiliate_platform}\n\nFollowing: ${form.affiliate_following}\n\nExperience: ${form.affiliate_experience}`;
      
      const { error: affiliateError } = await supabase.from("affiliate_applications").insert([
        {
          name: form.full_name,
          email: form.email,
          reason: affiliateReason,
          status: "pending",
        },
      ]);

      if (affiliateError) {
        console.error("Affiliate application error:", affiliateError);
        // Don't fail the whole signup, just log the error
      }
    }

    setLoading(false);

    if (isPending) {
      router.push("/login?message=affiliate_pending");
    } else {
      router.push("/login?message=check_email");
    }
  };

  return (
    <>
      <Head>
        <title>Apply for Supply Access | KV Garage</title>
        <meta
          name="description"
          content="Apply for access to KV Garage's verified supply network. Built for IP Value students, resellers, and wholesale buyers looking to scale."
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
              <h3 className="text-[#D4AF37] font-semibold mb-2">What You're Getting Access To</h3>
              <p>
                Access to real supply chains, not random products. You'll be connected to inventory that is actively being
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
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* Basic Info Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <input name="full_name" placeholder="Full Name" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full" required />
              <input name="email" placeholder="Email" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full" required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full" required />
              <input name="phone" placeholder="Phone Number" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full" />
              <input name="company" placeholder="Business / Brand Name" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full" />

              <select name="role" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full">
                <option value="retail">Retail Buyer</option>
                <option value="student">IP Value Student</option>
                <option value="wholesale">Wholesale Buyer</option>
              </select>

              <select name="partner" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full">
                <option value="ipvalue">IP Value Management</option>
                <option value="direct">Direct</option>
                <option value="other">Other</option>
              </select>

              <select name="reseller" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full">
                <option value="no">Not Yet Selling</option>
                <option value="yes">Currently Reselling</option>
              </select>

              <select name="monthly_volume" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full">
                <option value="beginner">Beginner</option>
                <option value="1k">$1k+/month</option>
                <option value="5k">$5k+/month</option>
                <option value="10k">$10k+/month</option>
              </select>

              <select name="has_license" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full">
                <option value="no">No Resale License</option>
                <option value="yes">Have Resale License</option>
              </select>

              <input name="website" placeholder="Website / Instagram (Proof)" onChange={handleChange} className="p-3 rounded bg-[#111827] w-full md:col-span-2" />
            </div>

            {/* Affiliate Section */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-6">
                <input 
                  type="checkbox" 
                  name="want_affiliate" 
                  checked={form.want_affiliate}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-[#111827] border-gray-600 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <label className="text-lg font-semibold text-[#D4AF37]">
                  I want to become an affiliate and earn commissions
                </label>
              </div>

              {form.want_affiliate && (
                <div className="bg-[#111827] rounded-lg p-6 space-y-6 animate-fade-in">
                  <h3 className="text-xl font-semibold text-white mb-4">Affiliate Application</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Where will you promote our products? *
                    </label>
                    <input 
                      name="affiliate_platform" 
                      placeholder="Instagram, TikTok, YouTube, Blog, Email list, etc." 
                      onChange={handleChange} 
                      className="p-3 rounded bg-[#05070D] w-full text-white placeholder-gray-500"
                      required={form.want_affiliate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      How many followers/subscribers do you have?
                    </label>
                    <input 
                      name="affiliate_following" 
                      placeholder="e.g., 10k Instagram followers, 5k email subscribers" 
                      onChange={handleChange} 
                      className="p-3 rounded bg-[#05070D] w-full text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Tell us about your experience with affiliate marketing or sales
                    </label>
                    <textarea 
                      name="affiliate_experience" 
                      placeholder="Any previous experience, successes, or why you'd be a great affiliate..." 
                      onChange={handleChange} 
                      rows="4"
                      className="p-3 rounded bg-[#05070D] w-full text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black py-4 rounded font-semibold hover:bg-[#E5C04A] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <p className="text-sm text-gray-500 text-center">
              By submitting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

        </div>
      </div>
    </>
  );
}