export default function Psychology() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* HERO */}
      <section className="py-24 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-6 text-[#D4AF37]">
          Sales & Psychology
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Execution, discipline, communication, and emotional control
          determine outcomes in business, markets, and leadership.
        </p>
      </section>

      {/* STRUCTURED GUIDE */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 text-gray-300">

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Decision Making Under Pressure
            </h2>
            <p>
              High-performance environments require calm,
              structured thinking during uncertainty.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Discipline & Habit Formation
            </h2>
            <p>
              Long-term results are built through repeatable behaviors,
              not isolated motivation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Sales & Communication
            </h2>
            <p>
              Clear communication, listening skills, and value delivery
              create trust and sustainable relationships.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Emotional Regulation
            </h2>
            <p>
              Understanding cognitive bias and emotional triggers
              improves execution in trading and business.
            </p>
          </div>

        </div>
      </section>

      {/* MEDIA SECTION */}
      <section className="bg-[#111827] py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Performance Mindset
        </h2>

        <div className="max-w-4xl mx-auto">
          <iframe
            className="w-full h-[400px] rounded-xl"
            src="https://www.youtube.com/embed/8jPQjjsBbIc"
            title="Psychology & Performance"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-gray-400 mt-6">
          Execution separates potential from outcome.
        </p>
      </section>

      {/* SOURCES */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-[#D4AF37]">
          Research & Resources
        </h2>

        <ul className="space-y-3 text-gray-400">
          <li>
            <a
              href="https://www.apa.org/topics/decision-making"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              American Psychological Association – Decision Making
            </a>
          </li>

          <li>
            <a
              href="https://hbr.org/topic/emotional-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Harvard Business Review – Emotional Intelligence
            </a>
          </li>

          <li>
            <a
              href="https://positivepsychology.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Positive Psychology Research
            </a>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-black py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Apply Structured Execution
        </h2>

        <a href="/mentorship">
          <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-semibold">
            Explore Mentorship
          </button>
        </a>
      </section>

    </div>
  );
}
