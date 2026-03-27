import Head from "next/head";
import Link from "next/link";

export default function Affiliate() {
  return (
    <>
      <Head>
        <title>Earn $500-5000/Month | KV Garage Affiliate Program</title>
        <meta
          name="description"
          content="Join our high-converting affiliate program. Earn 15% commissions on luxury products. No experience required. Start earning today!"
        />
        <meta name="keywords" content="affiliate program, earn money online, passive income, luxury products, commission" />
      </Head>

      <main className="bg-gradient-to-br from-orange-50 via-white to-orange-50">

        {/* ================= HERO SECTION ================= */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* LEFT: Hero Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Trusted by 10,000+ Affiliates
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Turn Your Network Into 
                  <span className="text-orange-500"> $500-5000/Month</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  Join our proven affiliate program and earn 15% commissions on every sale. 
                  No experience needed - just share our premium products with your audience.
                </p>

                {/* Social Proof */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-white flex items-center justify-center text-white font-semibold text-sm">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-700">2,147</span> affiliates joined this month
                  </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-4">
                  <Link
                    href="#join"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Start Earning Now - Free to Join
                  </Link>
                  <p className="text-sm text-gray-500">No upfront costs • Instant approval • Daily payouts</p>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Secure payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">24/7 support</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm">Real-time tracking</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Hero Image */}
              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Earning Potential</h3>
                      <p className="text-gray-600">See what our top affiliates earn</p>
                    </div>
                    
                    {/* Earning Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">$1,250</div>
                        <div className="text-sm text-gray-600">Average monthly earnings</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">15%</div>
                        <div className="text-sm text-gray-600">Commission rate</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">$250</div>
                        <div className="text-sm text-gray-600">Average order value</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">3.2%</div>
                        <div className="text-sm text-gray-600">Conversion rate</div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">
                        "I started with no experience and made $800 in my first month. 
                        The support team is amazing and the products sell themselves!"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">S</div>
                        <div>
                          <div className="font-semibold text-sm">Sarah M.</div>
                          <div className="text-xs text-gray-500">Top Affiliate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-200 rounded-full opacity-50"></div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600">Simple 3-step process to start earning</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up Free</h3>
                <p className="text-gray-600 leading-relaxed">
                  Create your affiliate account in 2 minutes. No fees, no commitments. 
                  Get instant access to marketing materials and tracking links.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share & Promote</h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your unique affiliate links on social media, email, or your website. 
                  We provide banners, product images, and ready-to-use content.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn Commissions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Earn 15% on every sale made through your links. Track your earnings 
                  in real-time and get paid weekly via PayPal or bank transfer.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= PRODUCTS SECTION ================= */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Products That Sell</h2>
              <p className="text-xl text-gray-600">Our products have proven conversion rates</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Product 1 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-2xl">⌚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Luxury Watches</h3>
                <p className="text-gray-600 text-sm mb-4">
                  High-end timepieces with exceptional craftsmanship. Average order value: $1,200
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">18% conversion rate</span>
                  <span className="text-sm text-gray-500">15% commission</span>
                </div>
              </div>

              {/* Product 2 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Designer Accessories</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Premium bags, wallets, and accessories. Perfect for gift buyers and fashion enthusiasts.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">15% conversion rate</span>
                  <span className="text-sm text-gray-500">15% commission</span>
                </div>
              </div>

              {/* Product 3 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gift Collections</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Curated gift sets perfect for holidays, birthdays, and special occasions.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">22% conversion rate</span>
                  <span className="text-sm text-gray-500">15% commission</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= JOIN SECTION ================= */}
        <section id="join" className="py-20 bg-orange-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of successful affiliates who are building real income with our program.
            </p>

            <form
              name="affiliate-application"
              method="POST"
              data-netlify="true"
              netlify
              data-netlify-honeypot="bot-field"
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <input type="hidden" name="form-name" value="affiliate-application" />
              <input type="hidden" name="bot-field" />

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your Full Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <input
                type="text"
                name="platform"
                placeholder="Where will you promote? (Social media, blog, email, etc.)"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-6"
              />

              <textarea
                name="experience"
                placeholder="Tell us about your experience (optional but helpful)"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-6"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started - It's Free!
              </button>

              <p className="text-sm text-gray-500 mt-4">
                By signing up, you agree to our terms and privacy policy. We respect your privacy.
              </p>
            </form>

            {/* Guarantee */}
            <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">🛡️</span>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900">30-Day Money-Back Guarantee</h4>
                  <p className="text-gray-600 text-sm">Not satisfied? We'll refund your investment.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">How much can I really earn?</h3>
                <p className="text-gray-600">
                  Our top affiliates earn $5,000+ per month. The average affiliate earns $800-1,200 monthly. 
                  Your earnings depend on your effort and audience size.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Do I need experience?</h3>
                <p className="text-gray-600">
                  No experience needed! We provide training, marketing materials, and 24/7 support 
                  to help you succeed from day one.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">How do I get paid?</h3>
                <p className="text-gray-600">
                  We pay weekly via PayPal or direct bank transfer. You can track your earnings 
                  in real-time through your affiliate dashboard.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Is there any cost to join?</h3>
                <p className="text-gray-600">
                  No! Our affiliate program is completely free to join. There are no hidden fees 
                  or monthly charges.
                </p>
              </div>

            </div>
          </div>
        </section>

      </main>
    </>
  );
}
