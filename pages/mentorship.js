import Layout from '../components/Layout';

export default function Mentorship() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <h1>Operator Mentorship</h1>

        <p style={{ marginTop: "1.5rem", maxWidth: "750px" }}>
          This mentorship is designed for serious builders looking to
          develop structured supply systems, validate product demand,
          and scale operations with discipline.
        </p>

        <div
          style={{
            marginTop: "3rem",
            maxWidth: "750px",
            lineHeight: "1.8"
          }}
        >
          <h2>What You’ll Learn</h2>

          <ul style={{ marginTop: "1.5rem", paddingLeft: "1.2rem" }}>
            <li>Product validation & margin analysis</li>
            <li>Supply chain positioning</li>
            <li>Retail & distribution strategy</li>
            <li>System-based scaling</li>
            <li>AI tools for demand analysis</li>
            <li>Building long-term partnerships</li>
          </ul>

          <p style={{ marginTop: "2rem" }}>
            This is not hype-based coaching. This is operational structure.
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
          <h2>Apply for Mentorship</h2>

          <p style={{ marginTop: "1rem" }}>
            Serious inquiries only.
          </p>

          <div style={{ marginTop: "2rem" }}>
            <a
              href="mailto:kvgarage@kvgarage.com"
              className="gold-btn"
            >
              Request Mentorship Access
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
