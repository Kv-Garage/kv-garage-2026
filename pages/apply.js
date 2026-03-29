import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { buildCanonicalUrl } from "../lib/seo";

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    business_type: "",
    volume: "",
    sales_channel: "",
    experience: "",
    company_name: "",
    tax_id: "",
    website: "",
    additional_info: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("✅ Application submitted. We will review within 24–48 hours.");
        setStep(3);
      }

    } catch (err) {
      setMessage("❌ Submission failed");
    }

    setLoading(false);
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return form.name && form.email && form.business_type && form.volume;
    }
    if (step === 2) {
      return form.company_name && form.tax_id;
    }
    return true;
  };

  const progress = (step / 2) * 100;

  return (
    <>
      <Head>
        <title>Wholesale Application | Premium Supply Network Access — KV Garage</title>
        <meta
          name="description"
          content="Apply for exclusive access to our premium wholesale supply network. Designed for verified businesses and serious operators with volume purchasing capability."
        />
        <meta name="keywords" content="wholesale application, B2B supply network, verified suppliers, business verification, volume pricing" />
        <link rel="canonical" href={buildCanonicalUrl("/apply")} />
        <meta property="og:title" content="Wholesale Application | Premium Supply Network Access — KV Garage" />
        <meta property="og:description" content="Apply for exclusive access to our premium wholesale supply network. Limited capacity available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/apply")} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER BANNER */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-3 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">LIMITED CAPACITY</span>
              </div>
              <span className="text-sm">Only 15 spots remaining for Q2 wholesale access</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono bg-black/30 px-3 py-1 rounded-full">
              <span className="text-red-300">APPLICATION TIME:</span>
              <span className="text-white font-bold">3 MINUTES</span>
            </div>
          </div>
        </div>

        {/* 🔥 HERO SECTION */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold">INSTITUTIONAL GRADE</span>
                <span className="text-gray-400 text-sm">ESTABLISHED 2022</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  Wholesale Access
                </span>
                <br />
                <span className="text-gray-300">Application</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                This is not a retail or dropshipping opportunity. We require serious business operators 
                with volume purchasing capability and professional business practices. 
                Applications are reviewed within 24-48 hours.
              </p>

              {/* 🔥 PROGRESS INDICATOR */}
              <div className="bg-white/10 rounded-full h-3 max-w-md mx-auto mb-8">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-center gap-8 text-sm text-gray-400">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white font-semibold' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-[#D4AF37]' : 'bg-gray-500'}`}></div>
                  Business Information
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white font-semibold' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-gray-500'}`}></div>
                  Verification Details
                </div>
              </div>
            </div>

            {/* 🔥 APPLICATION FORM */}
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                      <input
                        name="name"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Business Type *</label>
                      <select
                        name="business_type"
                        value={form.business_type}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Business Type</option>
                        <option>Reseller</option>
                        <option>Retail Store Owner</option>
                        <option>E-commerce Seller</option>
                        <option>Distributor</option>
                        <option>Wholesaler</option>
                        <option>Manufacturer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Monthly Purchase Volume *</label>
                      <select
                        name="volume"
                        value={form.volume}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Volume Range</option>
                        <option>Under $1,000</option>
                        <option>$1,000 – $5,000</option>
                        <option>$5,000 – $25,000</option>
                        <option>$25,000 – $100,000</option>
                        <option>$100,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Primary Sales Channel</label>
                      <select
                        name="sales_channel"
                        value={form.sales_channel}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Sales Channel</option>
                        <option>Shopify / Website</option>
                        <option>Amazon</option>
                        <option>eBay</option>
                        <option>Retail Store</option>
                        <option>Wholesale Distribution</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Experience Level</label>
                      <select
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Experience Level</option>
                        <option>Beginner (0-1 years)</option>
                        <option>Intermediate (1-3 years)</option>
                        <option>Advanced (3+ years)</option>
                        <option>Expert (5+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Company Website (Optional)</label>
                    <input
                      name="website"
                      placeholder="https://yourcompany.com"
                      value={form.website}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Information</label>
                    <textarea
                      name="additional_info"
                      placeholder="Tell us about your business, goals, and what you're looking for in a wholesale partner..."
                      value={form.additional_info}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 font-semibold">BUSINESS VERIFICATION REQUIRED</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      To maintain the integrity of our network, we require business verification for all wholesale partners. 
                      This information is kept confidential and used solely for verification purposes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Company Name *</label>
                      <input
                        name="company_name"
                        placeholder="Your Company LLC"
                        value={form.company_name}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Business Tax ID / EIN *</label>
                      <input
                        name="tax_id"
                        placeholder="XX-XXXXXXX"
                        value={form.tax_id}
                        onChange={handleChange}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-red-400 font-semibold">IMPORTANT</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      All information provided will be verified. False information will result in immediate disqualification. 
                      We may request additional documentation during the review process.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Application Submitted Successfully</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Thank you for your application. Our team will review your submission within 24-48 hours.
                    <br />
                    You will receive an email notification regarding your application status.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37]">24-48 Hours</div>
                      <div className="text-sm text-gray-400">Review Time</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37]">Email</div>
                      <div className="text-sm text-gray-400">Notification</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37]">Secure</div>
                      <div className="text-sm text-gray-400">Process</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                        Return to Home
                      </button>
                    </Link>
                    <Link href="/wholesale">
                      <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
                        View Inventory
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* 🔥 FORM ACTIONS */}
              {step < 3 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Step {step} of 2 • All fields marked with * are required
                  </div>
                  
                  <div className="flex gap-4">
                    {step > 1 && (
                      <button
                        onClick={prevStep}
                        className="border border-white/30 text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
                      >
                        Previous
                      </button>
                    )}
                    
                    {step === 1 && (
                      <button
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          isStepValid() 
                            ? 'bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black hover:shadow-lg hover:shadow-[#D4AF37]/30' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Continue
                      </button>
                    )}
                    
                    {step === 2 && (
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Submitting..." : "Submit Application"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {message && (
                <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-lg">
                  <p className="text-sm">{message}</p>
                </div>
              )}
            </div>

            {/* 🔥 TRUST INDICATORS */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/20 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">🔒</div>
                <div className="font-semibold mb-2">Secure & Confidential</div>
                <div className="text-sm text-gray-400">All information is encrypted and kept strictly confidential</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">⚡</div>
                <div className="font-semibold mb-2">Fast Review Process</div>
                <div className="text-sm text-gray-400">Applications reviewed within 24-48 hours</div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[#D4AF37] mb-2">📈</div>
                <div className="font-semibold mb-2">Professional Network</div>
                <div className="text-sm text-gray-400">Join verified businesses and industry leaders</div>
              </div>
            </div>

            {/* 🔥 FINAL CTA */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                <h3 className="text-3xl font-bold mb-4">Ready to Scale Your Business?</h3>
                <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                  Our wholesale network is designed for serious operators who are ready to build sustainable, 
                  scalable businesses with verified suppliers and institutional-grade support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/wholesale">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                      View Inventory Preview
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Create Account
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}