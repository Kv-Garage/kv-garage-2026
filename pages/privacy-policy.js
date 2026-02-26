export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20 text-gray-800">

      <h1 className="text-4xl font-bold text-royal mb-10">
        Privacy Policy
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        Effective Date: January 1, 2026 <br />
        KV Garage LLC <br />
        Email: kvgarage@kvgarage.com <br />
        Phone: 616-404-0751
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          KV Garage LLC ("Company", "we", "our", or "us") respects your privacy and is committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, process, and protect your information when you access our website,
          purchase products, enroll in trading education, or interact with our services.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-3">
          <li>Name, email address, and phone number</li>
          <li>Billing and shipping addresses</li>
          <li>Payment confirmation data via Stripe</li>
          <li>IP address and browser/device data</li>
          <li>Course progress and login activity</li>
          <li>Appointment data via Calendly</li>
          <li>Marketing engagement and analytics data</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Payment Processing & Clearance</h2>
        <p>
          All payments must be fully authorized and cleared before digital access is granted or shipping windows begin.
          If a payment is delayed, flagged, disputed, or under review, order processing and fulfillment may be paused.
          Shipping timelines begin only after full payment clearance.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Shipping & Fulfillment</h2>
        <p>
          Estimated shipping timelines are not guarantees. Delays caused by carriers, customs,
          supply chain disruptions, weather events, or incorrect customer information are outside our control.
          Customers are responsible for providing accurate shipping details.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Late Shipments & Store Credit</h2>
        <p>
          In cases of significant delay, remedies may be offered at our discretion.
          Refunds are not automatically issued. Compensation, if granted, may be provided as store credit.
          Store credit has no cash value, is non-transferable, and may include expiration terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Refund & Chargeback Policy</h2>
        <p>
          Digital education products are final sale. Access constitutes delivery.
          Physical product refunds are subject to inspection and approval.
          Chargebacks initiated without contacting support may result in account suspension
          and recovery actions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">7. Cookies & Tracking</h2>
        <p>
          We may use cookies, analytics tools, and tracking technologies to improve performance,
          optimize marketing, and detect fraud. Users may disable cookies in browser settings,
          though some features may be limited.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">8. Third-Party Providers</h2>
        <p>
          We may share limited data with Stripe (payment processing), Calendly (scheduling),
          hosting providers, analytics services, and shipping carriers.
          We do not sell personal data.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
        <p>
          We implement SSL encryption, secure hosting environments, and access controls.
          However, no method of transmission is 100% secure.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">10. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your personal data where legally permitted.
          Requests can be submitted to kvgarage@kvgarage.com.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
        <p>
          This Privacy Policy is governed by the laws of the State of Michigan.
        </p>
      </section>

    </div>
  );
}