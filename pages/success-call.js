import CalendlySuccessPage from "../components/CalendlySuccessPage";

export default function SuccessCall() {
  return (
    <CalendlySuccessPage
      title="Strategy Call Confirmed | KV Garage"
      description="Your strategy call payment is confirmed. Open Calendly to book your session."
      icon="01"
      heading="Payment confirmed."
      body="Your strategy session is unlocked. Pick the time that works best for you and we will take it from there."
      calendlyUrl="https://calendly.com/kv-garage/strategy-call?hide_gdpr_banner=1"
      buttonLabel="Open Strategy Call Scheduler"
    />
  );
}
