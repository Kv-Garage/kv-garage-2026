import Head from "next/head";
import Link from "next/link";

export default function Academy() {
  return (
    <>
      <Head>
        <title>KV Garage Academy | Operator Development</title>
        <meta
          name="description"
          content="Structured business education, systems training, and private mentorship for serious builders."
        />
      </Head>

      <main className="bg-white">

        {/* ================= HERO ================= */}
        <section className="py-24 border-b">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-start">

            {/* LEFT CONTENT */}
            <div className="md:col-span-2">

              <h1 className="text-5xl font-bold text-royal mb-6 leading-tight">
                KV Garage Academy
              </h1>

              <div className="w-20 h-[3px] bg-gold mb-6"></div>

              <p className="text-lg text-gray-700 mb-6">
                A structured learning environment for future operators.
              </p>

              <p className="text-gray-600 mb-6">
                This is a place you can send your son and say:
                “Learn how business really works.”
              </p>

              <p className="text-gray-600">
                Systems. Sales. AI. Infrastructure. Faith. Execution.
              </p>

            </div>

            {/* RIGHT SIDE – BOOK CALL BOX */}
            <div className="border rounded-xl p-6 bg-gray-50">

              <h3 className="font-semibold text-royal mb-3">
                Strategy Call
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                For serious builders only.
                This is not a casual conversation.
              </p>

              <p className="text-sm text-gray-500 mb-6">
                $50 — credited toward any program if accepted.
              </p>

              <Link
                href="/contact"
                className="block text-center bg-royal text-white py-3 rounded font-semibold hover:opacity-90 transition"
              >
                Book Call
              </Link>

            </div>

          </div>
        </section>


        {/* ================= LIBRARY SECTION ================= */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-royal mb-12">
              Free Operator Library
            </h2>

            <div className="grid md:grid-cols-4 gap-8">

              {[
                "Building Your First Website",
                "Using AI To Build Systems",
                "Reselling Fundamentals",
                "Understanding Markets",
                "Sales & Positioning",
                "Automation With n8n",
                "Coding With ChatGPT",
                "Faith & Discipline In Business"
              ].map((title, index) => (
                <div
                  key={index}
                  className="border bg-white rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="bg-gray-200 h-32 rounded mb-4"></div>

                  <h3 className="text-sm font-semibold mb-3">
                    {title}
                  </h3>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>YouTube</span>
                    <span>Playbook</span>
                  </div>
                </div>
              ))}

            </div>

          </div>
        </section>


        {/* ================= STRUCTURED CLASS ================= */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-royal mb-6">
              4-Week Structured Operator Class
            </h2>

            <p className="text-gray-600 mb-6">
              A guided, structured introduction to business systems.
              Designed for builders who want clarity before scale.
            </p>

            <p className="text-2xl font-bold text-royal mb-6">
              $129.99
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Includes downloadable playbooks and full system walkthroughs.
            </p>

            <button className="bg-royal text-white px-8 py-3 rounded font-semibold hover:opacity-90 transition">
              Enroll In Class
            </button>

          </div>
        </section>


        {/* ================= PRIVATE MENTORSHIP ================= */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto px-6 text-center">

            <h2 className="text-3xl font-bold text-royal mb-6">
              Private Mentorship
            </h2>

            <p className="text-gray-600 mb-6">
              This is not open enrollment.
              You must qualify.
            </p>

            <p className="text-xl font-semibold text-royal mb-6">
              $500 / Month
            </p>

            <p className="text-gray-600 mb-10">
              Twice weekly 1-on-1 sessions.
              Full system integration.
              Operational leverage.
              Cashflow structure.
            </p>

            <Link
              href="/private-preview"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition"
            >
              Apply For Mentorship
            </Link>

          </div>
        </section>


        {/* ================= ADVISORY ================= */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-4xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-royal mb-6">
              Private Advisory Partnership
            </h2>

            <p className="text-gray-600 mb-6">
              For businesses ready to scale and remove bottlenecks.
              Hiring systems. Payroll structure. Growth execution.
            </p>

            <p className="text-2xl font-bold text-royal mb-8">
              Starting at $1000
            </p>

            <Link
              href="/contact"
              className="border border-royal text-royal px-8 py-3 rounded font-semibold hover:bg-royal hover:text-white transition"
            >
              Inquire About Advisory
            </Link>

          </div>
        </section>

      </main>
    </>
  );
}
