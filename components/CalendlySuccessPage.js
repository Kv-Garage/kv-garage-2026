import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function appendCalendlyScript(onReady) {
  const existing = document.querySelector('script[data-calendly-widget="true"]');

  if (existing && window.Calendly) {
    onReady();
    return () => {};
  }

  const script = document.createElement("script");
  script.src = "https://assets.calendly.com/assets/external/widget.js";
  script.async = true;
  script.dataset.calendlyWidget = "true";
  script.onload = onReady;
  document.body.appendChild(script);

  return () => {
    script.onload = null;
  };
}

export default function CalendlySuccessPage({
  title,
  description,
  icon,
  heading,
  body,
  calendlyUrl,
  buttonLabel,
}) {
  const [popupReady, setPopupReady] = useState(false);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    const cleanup = appendCalendlyScript(() => setPopupReady(true));
    return cleanup;
  }, []);

  useEffect(() => {
    if (!popupReady || hasOpenedRef.current || !window.Calendly) return;
    hasOpenedRef.current = true;
    window.Calendly.initPopupWidget({ url: calendlyUrl });
  }, [popupReady, calendlyUrl]);

  const reopenPopup = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: calendlyUrl });
    } else {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-[#04111d] via-[#0c1b2f] to-[#0d3b3a] px-6 py-24 text-white">
        <section className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-black/30 p-8 text-center shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-4xl text-[#C9A84C]">
            {icon}
          </div>
          <h1 className="mt-8 text-4xl font-semibold text-[#F6F2E8] md:text-5xl">{heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#B9C6D3]">{body}</p>

          <div className="mt-10 rounded-[24px] border border-[#C9A84C]/25 bg-[#0A111C] p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-[#C9A84C]">Next Step</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Choose your time on Calendly</h2>
            <p className="mt-3 text-sm leading-7 text-[#91A3B8]">
              Your scheduling popup should open automatically. If it does not, use the button below.
            </p>
            <button
              type="button"
              onClick={reopenPopup}
              className="mt-8 inline-flex min-w-[220px] items-center justify-center rounded-full bg-[#C9A84C] px-8 py-4 text-sm font-semibold text-[#060606] transition hover:brightness-105"
            >
              {buttonLabel}
            </button>
            <p className="mt-4 text-xs text-[#6D7D90]">
              Prefer a new tab?{" "}
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#C9A84C] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
              >
                Open Calendly directly
              </a>
            </p>
          </div>

          <div className="mt-10">
            <Link href="/" className="text-sm text-[#C9A84C] underline decoration-transparent underline-offset-4 transition hover:decoration-current">
              Return to homepage
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
