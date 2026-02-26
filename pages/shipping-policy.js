export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-20 text-gray-800">

      <h1 className="text-4xl font-bold text-royal mb-10">
        Shipping Policy
      </h1>

      <p className="mb-8 text-sm text-gray-500">
        Effective Date: January 1, 2026 <br />
        KV Garage LLC <br />
        Email: kvgarage@kvgarage.com <br />
        Phone: 616-404-0751
      </p>

      {/* PAYMENT CLEARANCE */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          1. Payment Authorization & Clearance
        </h2>
        <p>
          Orders are not processed or shipped until full payment authorization
          and clearance has been confirmed. Payment clearance may take
          up to 3 business days depending on financial institution review,
          fraud screening, or transaction verification.
        </p>
      </section>

      {/* PROCESSING TIME */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          2. Order Processing Time
        </h2>
        <p>
          Standard retail orders are processed within 2–5 business days
          following payment clearance. Certain specialty, jewelry,
          or limited inventory products may require extended processing
          periods depending on supplier availability.
        </p>
        <p className="mt-4">
          Wholesale or bulk orders may require additional preparation time.
        </p>
      </section>

      {/* SHIPPING METHODS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          3. Shipping Methods & Carriers
        </h2>
        <p>
          Shipping carriers are selected based on speed, reliability,
          and cost efficiency. Tracking information is provided once
          an order has been dispatched.
        </p>
      </section>

      {/* DELIVERY TIME */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          4. Estimated Delivery Time
        </h2>
        <p>
          Delivery times are estimates only and are not guaranteed.
          Carrier delays, supply chain constraints, weather conditions,
          and high-volume periods may affect delivery timelines.
        </p>
      </section>

      {/* NO INTERNATIONAL */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          5. Domestic Shipping Only
        </h2>
        <p>
          KV Garage LLC currently ships within the United States only.
          International shipping is not offered at this time.
        </p>
      </section>

      {/* RISK OF LOSS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          6. Risk of Loss & Carrier Responsibility
        </h2>
        <p>
          Once an order has been transferred to the shipping carrier,
          risk of loss transfers to the customer. KV Garage LLC is not
          responsible for lost, delayed, or stolen packages after
          confirmed carrier delivery.
        </p>
        <p className="mt-4">
          Customers are responsible for ensuring accurate shipping
          address information at the time of checkout.
        </p>
      </section>

      {/* ADDRESS ERRORS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          7. Incorrect or Incomplete Addresses
        </h2>
        <p>
          Orders returned due to incorrect or incomplete address information
          may require additional shipping charges for reshipment.
          KV Garage LLC is not liable for address-related delivery failures.
        </p>
      </section>

      {/* DAMAGED ITEMS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          8. Damaged Items in Transit
        </h2>
        <p>
          Customers must report damaged items within 3 days of delivery.
          Photographic evidence is required. Upon review,
          KV Garage LLC will determine whether replacement,
          repair, or store credit is appropriate.
        </p>
      </section>

      {/* WHOLESALE */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          9. Wholesale Orders
        </h2>
        <p>
          Wholesale and bulk purchases are considered final sale.
          No refunds are issued on wholesale orders unless
          products are verified as damaged prior to shipment.
        </p>
      </section>

      {/* PRE-ORDERS */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          10. Pre-Orders & Backorders
        </h2>
        <p>
          Pre-order or backorder items may have extended fulfillment timelines.
          Estimated shipping windows are provided when available
          but are not guaranteed delivery dates.
        </p>
      </section>

      {/* FORCE MAJEURE */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          11. Force Majeure
        </h2>
        <p>
          KV Garage LLC is not responsible for shipping delays caused by
          events beyond reasonable control, including but not limited to
          natural disasters, supply chain disruptions, labor shortages,
          government actions, or transportation interruptions.
        </p>
      </section>

    </div>
  );
}