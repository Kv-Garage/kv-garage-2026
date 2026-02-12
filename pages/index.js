import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>
            Structured Supply Systems for Serious Buyers
          </h1>

          <p style={{ maxWidth: "700px", margin: "0 auto 2rem auto" }}>
            Bulk inventory. Verified demand. Protected margin.
            Built for store owners, distributors, and long-term operators.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/wholesale" className="gold-btn">
              Apply for Wholesale Access
            </Link>

            <Link href="/shop" className="gold-btn">
              Shop Retail
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ margin: "5rem 0", height: "1px", backgroundColor: "#222" }} />

        {/* DIRECTORY SECTION */}
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
          Choose Your Path
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}
        >
          {/* Store Owners */}
          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Store Owners</h3>
            <p style={{ margin: "1rem 0" }}>
              Cords, cases, charger blocks, glass products, trays,
              candles, crystals and more.
            </p>
            <Link href="/wholesale" className="gold-btn">
              Start Wholesale Application
            </Link>
          </div>

          {/* Bulk Buyers */}
          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Bulk Buyers</h3>
            <p style={{ margin: "1rem 0" }}>
              Volume purchasing with minimum order commitments.
              Wholesale pricing structured for margin protection.
            </p>
            <Link href="/private-preview" className="gold-btn">
              View Bulk Opportunities
            </Link>
          </div>

          {/* Retail Buyers */}
          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Retail Buyers</h3>
            <p style={{ margin: "1rem 0" }}>
              Watches and jewelry available for individual purchase.
              Wholesale pricing begins at 4 units.
            </p>
            <Link href="/shop" className="gold-btn">
              Shop Retail Inventory
            </Link>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ margin: "5rem 0", height: "1px", backgroundColor: "#222" }} />

        {/* CATEGORY PREVIEW */}
        <h2 style={{ textAlign: "center", marginBottom: "3rem" }}>
          Product Categories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}
        >
          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Tech Accessories</h3>
            <p>Cords, Cases, Charger Blocks</p>
          </div>

          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Glass & Lifestyle</h3>
            <p>Glass pieces, trays, candles, crystals</p>
          </div>

          <div style={{ border: "1px solid #222", padding: "2rem" }}>
            <h3>Watches & Jewelry</h3>
            <p>Retail available. MOQ 4 for wholesale pricing.</p>
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ margin: "5rem 0", height: "1px", backgroundColor: "#222" }} />

        {/* FOUNDER STRIP */}
        <div style={{ textAlign: "center" }}>
          <h2>Built on Systems. Earned Through Execution.</h2>

          <p style={{ maxWidth: "700px", margin: "1.5rem auto" }}>
            KV Garage was developed to create structured supply,
            scalable distribution, and real opportunity for
            serious operators.
          </p>

          <Link href="/about" className="gold-btn">
            About The Founder
          </Link>
        </div>

      </section>
    </Layout>
  );
}
