import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { buildCanonicalUrl } from "../lib/seo";

export default function PrivatePreview() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    productLink: "",
    description: "",
    quantity: 1,
    business_type: "",
    budget: "",
    timeline: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("sourcing_requests")
      .insert([
        {
          name: form.name,
          email: form.email,
          product_link: form.productLink,
          description: form.description,
          quantity: form.quantity,
          business_type: form.business_type,
          budget: form.budget,
          timeline: form.timeline,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Request submitted successfully");
    setStep(3);

    setForm({
      name: "",
      email: "",
      productLink: "",
      description: "",
      quantity: 1,
      business_type: "",
      budget: "",
      timeline: ""
    });

    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return form.name && form.email && form.productLink;
    }
    if (step === 2) {
      return form.business_type && form.budget && form.timeline;
    }
    return true;
  };

  const progress = (step / 2) * 100;

  return (
    <>
      <Head>
        <title>Private Sourcing Desk | Global Supplier Access — KV Garage</title>
        <meta
          name="description"
          content="Submit product requests to our private sourcing desk. Direct access to verified global suppliers with under 30-minute response times for serious operators."
        />
        <meta name="keywords" content="private sourcing, global suppliers, product sourcing, wholesale sourcing, verified suppliers, B2B sourcing" />
        <link rel="canonical" href={buildCanonicalUrl("/private-preview")} />
        <meta property="og:title" content="Private Sourcing Desk | Global Supplier Access — KV Garage" />
        <meta property="og:description" content="Direct access to verified global suppliers with under 30-minute response times for serious operators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/private-preview")} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">
        {/* 🔥 URGENT HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-3 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">PRIVATE ACCESS</span>
              </div>
              <span className="text-sm">Direct sourcing for verified partners only</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono bg-black/30 px-3 py-1 rounded-full">
              <span className="text-blue-300">RESPONSE TIME:</span>
              <span className="text-white font-bold">UNDER 30 MINUTES</span>
            </div>
          </div>
        </div>

        {/* 🔥 HERO SECTION */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold">INSTITUTIONAL GRADE</span>
                <span className="text-gray-400 text-sm">ESTABLISHED 2022</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                  Private Sourcing
                </span>
                <br />
                <span className="text-gray-300">Desk</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                Submit product requests and our procurement team will source directly 
                from verified global suppliers. Designed for resellers, wholesale buyers, 
                and high-volume operators with serious sourcing needs.
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
                  Product Information
                </div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white font-semibold' : ''}`}>
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-[#D4AF37]' : 'bg-gray-500'}`}></div>
                  Business Requirements
                </div>
              </div>
            </div>

            {/* 🔥 INSTITUTION BLOCKS */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-4">30 Minutes</div>
                <div className="font-semibold mb-2">Response Time</div>
                <div className="text-sm text-gray-400">Our team responds to all requests within 30 minutes during business hours</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/20 to-transparent border border-green-500/30 p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-4">9:00 AM – 6:00 PM</div>
                <div className="font-semibold mb-2">Availability</div>
                <div className="text-sm text-gray-400">EST business hours with dedicated sourcing specialists</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-[#D4AF37] mb-4">Global</div>
                <div className="font-semibold mb-2">Supplier Network</div>
                <div className="text-sm text-gray-400">Access to 200+ verified suppliers across 45+ countries</div>
              </div>
            </div>

            {/* 🔥 FORM */}
            <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-3xl p-8 backdrop-blur-sm">
              
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name *</label>
                      <input
                        required
                        name="name"
                        placeholder="John Smith"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Product Link *</label>
                    <input
                      name="productLink"
                      placeholder="Amazon, TikTok, Supplier, etc."
                      value={form.productLink}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Product Description *</label>
                    <textarea
                      name="description"
                      placeholder="Describe the product, specifications, materials, dimensions, or sourcing requirements..."
                      rows="5"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Estimated Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      name="quantity"
                      placeholder="100"
                      value={form.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-900/20 to-transparent border border-yellow-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-yellow-400 font-semibold">BUSINESS REQUIREMENTS</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      To provide accurate sourcing quotes and supplier matches, we need to understand 
                      your business requirements and constraints.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Business Type *</label>
                      <select
                        name="business_type"
                        value={form.business_type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Business Type</option>
                        <option>Reseller</option>
                        <option>Retail Store Owner</option>
                        <option>E-commerce Seller</option>
                        <option>Distributor</option>
                        <option>Wholesaler</option>
                        <option>Manufacturer</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Budget Range *</label>
                      <select
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select Budget Range</option>
                        <option>Under $1,000</option>
                        <option>$1,000 – $5,000</option>
                        <option>$5,000 – $25,000</option>
                        <option>$25,000 – $100,000</option>
                        <option>$100,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Required Timeline *</label>
                    <select
                      name="timeline"
                      value={form.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all duration-300"
                    >
                      <option value="">Select Timeline</option>
                      <option>Urgent (1-2 weeks)</option>
                      <option>Standard (3-4 weeks)</option>
                      <option>Flexible (1-2 months)</option>
                      <option>Long-term (2+ months)</option>
                    </select>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-400 font-semibold">SOURCING PROCESS</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Our team will review your requirements, contact verified suppliers, 
                      and provide you with multiple sourcing options within 30 minutes.
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
                  <h3 className="text-2xl font-bold mb-4">Request Submitted Successfully</h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    Thank you for your sourcing request. Our procurement team will contact you 
                    within 30 minutes during business hours with sourcing options and supplier quotes.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37] mb-2">30 Minutes</div>
                      <div className="text-sm text-gray-400">Response Time</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37] mb-2">Multiple</div>
                      <div className="text-sm text-gray-400">Supplier Options</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                      <div className="text-2xl font-bold text-[#D4AF37] mb-2">Verified</div>
                      <div className="text-sm text-gray-400">Global Suppliers</div>
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
                        Explore Inventory
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
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Submitting Request..." : "Submit Request"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {success && (
                <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-lg">
                  <p className="text-sm">{success}</p>
                </div>
              )}
            </div>

            {/* 🔥 TRUST + POSITIONING */}
            <div className="mt-16 bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Why Choose Our Private Sourcing Desk?</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-[#D4AF37] mb-3">Direct Supplier Access</h4>
                  <p className="text-gray-300 text-sm">
                    We operate as a direct sourcing intermediary with access to vetted manufacturers 
                    and logistics channels. No middlemen, no markups, just direct supplier relationships.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#D4AF37] mb-3">Quality Assurance</h4>
                  <p className="text-gray-300 text-sm">
                    All suppliers in our network are thoroughly vetted for quality, reliability, 
                    and compliance. We handle the due diligence so you don't have to.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#D4AF37] mb-3">Speed & Efficiency</h4>
                  <p className="text-gray-300 text-sm">
                    With under 30-minute response times and a streamlined process, we eliminate 
                    the guesswork and delays typically associated with international sourcing.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#D4AF37] mb-3">Global Network</h4>
                  <p className="text-gray-300 text-sm">
                    Access to 200+ verified suppliers across 45+ countries, giving you options 
                    and competitive pricing you won't find elsewhere.
                  </p>
                </div>
              </div>
            </div>

            {/* 🔥 CONTACT */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Source Globally?</h3>
                <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
                  Our private sourcing desk is designed for serious operators who need reliable, 
                  cost-effective access to global suppliers. Submit your request and experience 
                  the difference of institutional-grade sourcing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/wholesale">
                    <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                      Explore Wholesale Inventory
                    </button>
                  </Link>
                  <Link href="/apply">
                    <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition-all duration-300">
                      Apply for Access
                    </button>
                  </Link>
                </div>
                <div className="mt-6 text-sm text-gray-400">
                  Contact: <span className="text-white">kvgarage@kvgarage.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}