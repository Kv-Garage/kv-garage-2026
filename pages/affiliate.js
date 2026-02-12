import Layout from '../components/Layout';

export default function Affiliate() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <h1>Affiliate & Distribution Partners</h1>

        <p style={{ marginTop: "1.5rem", maxWidth: "750px" }}>
          We collaborate with operators, influencers, distributors,
          and retail connectors who can expand product reach and
          drive verified demand.
        </p>

        <div
          style={{
            marginTop: "3rem",
            maxWidth: "750px",
            lineHeight: "1.8"
          }}
        >
          <h2>Partnership Focus</h2>

          <ul style={{ marginTop: "1.5rem", paddingLeft: "1.2rem" }}>
            <li>Retail placement partnerships</li>
            <li>Online distribution channels</li>
            <li>Strategic brand collaborations</li>
            <li>Performance-based commission models</li>
            <li>Long-term revenue sharing structures</li>
          </ul>

          <p style={{ marginTop: "2rem" }}>
            We prioritize long-term operators who value structure,
            transparency, and sustainable growth.
          </p>
        </div>

        <div
          style={{
            marginTop: "4rem",
            border: "1px solid #222",
            padding: "2rem",
            textAlign: "center"
          }}
        >
          <h2>Become a Partner</h2>

          <p style={{ marginTop: "1rem" }}>
            Submit your interest and partnership background.
          </p>

          <div style={{ marginTop: "2rem" }}>
            <a
              href="mailto:kvgarage@kvgarage.com"
              className="gold-btn"
            >
              Apply as Affiliate
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
