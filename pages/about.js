export default function About() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* TOP SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20 items-center">

        {/* LEFT — FOUNDER IMAGE */}
        <div>
          <img
            src="/founder.jpg"
            alt="Founder"
            className="rounded-2xl shadow-2xl object-cover w-full h-[550px]"
          />
        </div>

        {/* RIGHT — INFORMATION */}
        <div>
          <h1 className="text-4xl font-bold mb-8 text-[#D4AF37]">
            Kavion Steele
          </h1>

          <p className="text-gray-400 leading-relaxed mb-6">
            KV Garage operates through structured sourcing, controlled
            margin management, and disciplined operational oversight.
            Every division — retail, wholesale, capital allocation,
            and education — is aligned under measurable performance
            standards.
          </p>

          <p className="text-gray-400 leading-relaxed mb-6">
            Growth is pursued through positioning and execution,
            not impulse. Supplier relationships are built with
            long-term stability in mind. Capital deployment is
            structured with defined risk parameters.
          </p>

          <p className="text-gray-400 leading-relaxed">
            The objective is sustained operational clarity,
            scalable systems, and disciplined expansion.
          </p>
        </div>

      </section>

      {/* CONTACT SECTION */}
      <section className="border-t border-gray-800 py-28 text-center px-6">

        <h2 className="text-3xl font-semibold mb-6 text-[#D4AF37]">
          Direct Contact
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          For wholesale partnerships, capital discussions,
          strategic alignment, or executive consultation,
          contact directly through the primary communication channel.
        </p>

        <div className="space-y-6">

          <a href="mailto:your@email.com">
            <button className="bg-[#D4AF37] text-black px-10 py-4 rounded-xl font-semibold hover:opacity-90 transition">
              Email Directly
            </button>
          </a>

          <div>
            <a href="/contact" className="text-gray-400 hover:text-[#D4AF37] transition">
              Or Schedule A Meeting
            </a>
          </div>

        </div>

      </section>

    </div>
  );
}
