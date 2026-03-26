import CalendlySuccessPage from "../components/CalendlySuccessPage";

export default function SuccessMentorship() {
  return (
    <CalendlySuccessPage
      title="Mentorship Confirmed | KV Garage"
      description="Your mentorship payment is confirmed. Open Calendly to schedule your onboarding session."
      icon="02"
      heading="Mentorship unlocked."
      body="Your access is live. Use the scheduling popup to book your onboarding call and we will map out your next moves together."
      calendlyUrl="https://calendly.com/kvgarage-kvgarage/60min?hide_event_type_details=1&hide_gdpr_banner=1"
      buttonLabel="Open Onboarding Scheduler"
    />
  );
}
