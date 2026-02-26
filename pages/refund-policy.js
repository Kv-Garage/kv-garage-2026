export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20 text-gray-800">

      <h1 className="text-4xl font-bold text-royal mb-10">
        Refund Policy
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        Effective Date: January 1, 2026 <br />
        KV Garage LLC <br />
        Email: kvgarage@kvgarage.com <br />
        Phone: 616-404-0751
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Digital Products & Trading Education</h2>
        <p>
          All digital education products, mentorship programs, trading materials,
          downloadable content, and online access products are final sale.
          Access to digital materials constitutes delivery of service.
          No refunds will be issued for dissatisfaction, change of mind,
          or lack of results.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Wholesale & Physical Products</h2>
        <p>
          Refund requests for physical products must be submitted in writing
          within 7 days of delivery. Products must be unused, in original
          condition, and subject to inspection upon return.
        </p>
        <p className="mt-4">
          Items that show signs of wear, damage, resizing, alteration,
          or misuse may be denied refund eligibility.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Shipping Policy</h2>
        <p>
          Shipping windows begin only after full payment authorization and clearance.
          Delivery timeframes are estimates and are not guaranteed.
          KV Garage LLC is not responsible for delays caused by carriers,
          customs processing, supply chain disruptions, weather conditions,
          or incorrect address information provided by the customer.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Late Shipments & Store Credit</h2>
        <p>
          In cases of significant delay, compensation may be offered at the sole discretion
          of KV Garage LLC. Remedies, if granted, may be issued in the form of store credit.
        </p>
        <p className="mt-4">
          Store credit has no cash value, is non-transferable, and may be subject
          to expiration terms. Store credit cannot be converted to cash refunds.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Chargebacks & Payment Disputes</h2>
        <p>
          Customers agree to contact kvgarage@kvgarage.com before initiating
          a chargeback or payment dispute.
        </p>
        <p className="mt-4">
          Fraudulent or unjustified chargebacks may result in:
        </p>
        <ul className="list-disc ml-6 mt-4 space-y-2">
          <li>Account suspension</li>
          <li>Permanent service ban</li>
          <li>Collection efforts for recovered funds</li>
          <li>Submission of documentation to payment processors</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
        <p>
          This Refund Policy is governed by the laws of the State of Michigan.
        </p>
      </section>

    </div>
  );
}