export default function AI() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6 text-[#D4AF37]">
          AI & Technology
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Artificial intelligence and automation create digital leverage.
          Understanding how systems work allows individuals to build,
          scale, and operate more efficiently.
        </p>
      </section>

      {/* STRUCTURED GUIDE */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 text-gray-300">

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              What Is Artificial Intelligence?
            </h2>
            <p>
              AI refers to systems capable of performing tasks that
              normally require human intelligence, including analysis,
              prediction, and decision support.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Automation & APIs
            </h2>
            <p>
              APIs and automation tools allow systems to communicate,
              transfer data, and execute processes without manual effort.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Building Digital Leverage
            </h2>
            <p>
              Digital leverage means creating systems that operate
              continuously and scale without proportional time input.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              AI in Markets & Business
            </h2>
            <p>
              AI can analyze data, detect patterns, and assist decision-making
              in both trading environments and operational businesses.
            </p>
          </div>

        </div>
      </section>

      {/* MEDIA SECTION */}
      <section className="bg-[#111827] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          AI In Action
        </h2>

        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src="https://www.youtube.com/embed/2ePf9rue1Ao"
            title="AI Explained"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-400 mt-6">
          Technology compounds when structured correctly.
        </p>
      </section>

      {/* SOURCES */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">
          Primary Resources
        </h2>

        <ul className="space-y-3 text-gray-400">
          <li>
            <a
              href="https://openai.com/research"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              OpenAI Research
            </a>
          </li>

          <li>
            <a
              href="https://ai.mit.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              MIT Artificial Intelligence
            </a>
          </li>

          <li>
            <a
              href="https://www.ibm.com/topics/artificial-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              IBM AI Overview
            </a>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Explore Applied Infrastructure
        </h2>

        <a href="/edgepilot">
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
            Discover EdgePilot
          </button>
        </a>
      </section>

    </div>
  );
}
