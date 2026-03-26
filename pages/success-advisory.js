import CalendlySuccessPage from "../components/CalendlySuccessPage";

export default function SuccessAdvisory() {
  return (
    <CalendlySuccessPage
      title="Advisory Confirmed | KV Garage"
      description="Your advisory payment is confirmed. Open Calendly to reserve your strategy session."
      icon="03"
      heading="Advisory access confirmed."
      body="Your advisory session is ready to schedule. Open the popup below to reserve your priority strategy slot."
      calendlyUrl="https://calendly.com/kv-garage/advisory-strategy?hide_gdpr_banner=1"
      buttonLabel="Open Advisory Scheduler"
    />
  );
}
