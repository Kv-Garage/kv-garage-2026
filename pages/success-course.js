import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SuccessCourse() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Add email submission logic here
      // For now, just show success message
      setSubmitted(true);
    } catch (error) {
      console.error('Email submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Course Access - KV Garage</title>
        <meta name="description" content="You're in! Enter your email to receive course access." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 text-white">
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="mb-12">
              <div className="text-6xl mb-6">🎓</div>
              <h1 className="text-4xl font-bold mb-4 text-emerald-400">
                You're in!
              </h1>
              <p className="text-xl text-blue-200 mb-2">
                Enter your email to receive access.
              </p>
            </div>

            {/* Email Form */}
            <div className="bg-blue-900/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-xl border border-emerald-500/20 max-w-md mx-auto">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-semibold text-emerald-400 mb-4">
                    Get Course Access
                  </h2>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-blue-800/50 border border-blue-600 rounded-lg text-white placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
                  >
                    {loading ? "Sending..." : "Get Access"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                    Check Your Email!
                  </h3>
                  <p className="text-blue-200 mb-6">
                    We've sent your course access instructions to {email}
                  </p>
                  <p className="text-sm text-blue-300">
                    If you don't see it within 5 minutes, check your spam folder.
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <button
                onClick={() => router.push('/')}
                className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
