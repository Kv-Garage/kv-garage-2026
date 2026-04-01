import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About KV Garage | From Garage to Global Supply Empire</title>
        <meta
          name="description"
          content="The KV Garage story — built from flipping AirPods in a garage, now a multi-division supply empire serving 7,800+ operators worldwide."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#0B0F19] text-white">

        {/* HERO SECTION */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <span className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-6 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
              THE STORY
            </span>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-[#D4AF37] to-white bg-clip-text text-transparent">
                Built From Nothing
              </span>
              <br />
              <span className="text-gray-300">Scaled Into Everything</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              KV Garage started with $500, a garage, and a refusal to accept the traditional path.
              What began as flipping AirPods has grown into a multi-division supply empire serving 7,800+ operators worldwide.
            </p>
          </div>
        </section>

        {/* FOUNDER SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
              <img
                src="/founder.jpg"
                alt="Kavion Steele - Founder"
                className="rounded-2xl shadow-2xl object-cover w-full h-[550px] border border-white/20"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-[#D4AF37] mb-6">Kavion Steele</h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  What started as a side hustle in a cramped garage became a blueprint for 
                  independent operators who refuse to play by someone else's rules.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The AirPods Era</h3>
                    <p className="text-gray-400">
                      Started with $500 and a case of AirPods. Bought low, sold high, learned faster. 
                      Every flip taught something new about margins, demand, and the art of the deal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Pallet & Pop-Up Era</h3>
                    <p className="text-gray-400">
                      Scaled from individual flips to buying entire pallets. Then came clothing, 
                      case cords, and pop-up shops. What was once a side hustle became a real business 
                      with real inventory, real customers, and real systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">The Empire</h3>
                    <p className="text-gray-400">
                      Four divisions now operate under one roof: retail inventory, wholesale supply, 
                      capital allocation, and operator education. 7,800+ graduates trained. Global reach. 
                      From garage flips to global supply chains.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE SYSTEM SECTION */}
        <section className="py-20 px-6 bg-gradient-to-br from-white/5 to-transparent border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">The KV Garage System</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                What looks like overnight success is actually a decade of systems, discipline, 
                and relentless iteration. Here's how it works.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-4xl mb-6">🏭</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Sourcing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Direct relationships with manufacturers and distributors. No middlemen. 
                  No markup layers. Just clean supply chains with verified quality.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-4xl mb-6">📊</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Pricing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Volume-based and cart-total discounts that reward scale. The more you buy, 
                  the more you save. Transparent tiers. No hidden fees.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-4xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Distribution</h3>
                <p className="text-gray-300 leading-relaxed">
                  Side-by-side control and help from order to delivery. 
                  1-week delivery time with results showing in 72 hours. 
                  Real-time tracking. Your success is our success.
                </p>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/20 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500">
                <div className="text-4xl mb-6">🎓</div>
                <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Education</h3>
                <p className="text-gray-300 leading-relaxed">
                  7,800+ operators trained. From first sale to scaled operations. 
                  Mentorship, systems, and a community that wins together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-6xl font-bold text-[#D4AF37] mb-4">4,800+</div>
                <p className="text-xl text-gray-300">Businesses Served</p>
              </div>
              <div>
                <div className="text-6xl font-bold text-[#D4AF37] mb-4">1 Week</div>
                <p className="text-xl text-gray-300">Delivery Time</p>
              </div>
              <div>
                <div className="text-6xl font-bold text-[#D4AF37] mb-4">72 Hours</div>
                <p className="text-xl text-gray-300">Showing Results</p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES SECTION */}
        <section className="py-20 px-6 bg-gradient-to-br from-white/5 to-transparent border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6">What We Stand For</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                These aren't just words on a wall. They're the principles that built 
                this company and the standards we hold ourselves to every day.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold mb-4">Speed Over Perfection</h3>
                <p className="text-gray-300 leading-relaxed">
                  Move fast, learn faster. Perfection is the enemy of profit. 
                  We ship, measure, iterate, and win.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold mb-4">Partnerships Over Transactions</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every customer is a long-term partner. We don't do one-and-done. 
                  Your success is our success — literally.
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4">Systems Over Hustle</h3>
                <p className="text-gray-300 leading-relaxed">
                  Hustle gets you started. Systems get you scaled. We build 
                  repeatable, measurable, scalable processes for everything.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="py-28 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-8">Ready to Join the System?</h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Whether you're starting your first resale business or scaling an existing operation, 
              KV Garage provides the supply, systems, and support to win.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/signup">
                <button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-black px-12 py-5 rounded-xl font-bold text-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105">
                  Create Account
                </button>
              </Link>
              <Link href="/wholesale">
                <button className="border border-white/30 text-white px-12 py-5 rounded-xl font-semibold text-xl hover:bg-white hover:text-black transition-all duration-300">
                  Explore Wholesale
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}