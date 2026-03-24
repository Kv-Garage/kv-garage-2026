import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SuccessMentorship() {
  const router = useRouter();

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Clean up script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Mentorship Unlocked - KV Garage</title>
        <meta name="description" content="Book your onboarding call for the mentorship program." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-emerald-900 text-white">
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="mb-12">
              <div className="text-6xl mb-6">🤝</div>
              <h1 className="text-4xl font-bold mb-4 text-emerald-400">
                Mentorship unlocked!
              </h1>
              <p className="text-xl text-blue-200 mb-2">
                Book your onboarding call.
              </p>
            </div>

            {/* Calendly Embed */}
            <div className="bg-blue-900/40 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-xl border border-emerald-500/20">
              <h2 className="text-2xl font-semibold text-emerald-400 mb-6">
                Schedule Your Onboarding Call
              </h2>
              
              <div 
                className="calendly-inline-widget"
                data-url="https://calendly.com/kv-garage/mentorship-onboarding"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <p className="text-sm text-blue-300 mb-4">
                You will receive a confirmation email with the meeting details and mentorship program information.
              </p>
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
