import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        
        <div
          style={{
            display: "flex",
            gap: "4rem",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          
          {/* Image */}
          <div style={{ flex: "1 1 300px", textAlign: "center" }}>
            <img
              src="/founder.jpg"
              alt="Kavion Steele"
              style={{
                width: "100%",
                maxWidth: "420px",
                borderRadius: "10px"
              }}
            />
          </div>

          {/* Text */}
          <div style={{ flex: "1 1 450px" }}>
            <h1>Kavion Steele</h1>

            <div
              style={{
                width: "60px",
                height: "3px",
                backgroundColor: "#D4AF37",
                margin: "1rem 0 1.5rem 0"
              }}
            />

            <p style={{ color: "#D4AF37", marginBottom: "2rem" }}>
              Founder, KV Garage
            </p>

            <h2 style={{ marginBottom: "1.5rem" }}>
              From Foster to Founder
            </h2>

            <p>
              I didn’t begin with capital, connections, or inherited leverage.
              I began in the foster system — learning early that survival
              requires structure, discipline, and emotional control.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              I have been in the battlefield of business for years — testing
              products, navigating supply chains, managing risk, building teams,
              and refining systems that produce results.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              KV Garage was not built around hype. It was built around systems.
              Systems designed to create jobs. Systems designed to supply demand.
              Systems designed so stores move product and generate profit
              consistently — not temporarily.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              Money comes from the people who support what you build. Long-term
              growth comes from knowledge — the right partnerships, disciplined
              execution, strong teams, and intelligent leverage.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              I operate with experienced teams and advanced AI infrastructure
              to analyze demand, optimize supply, and position operations for
              sustainable expansion. These systems are built to scale.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              I believe I am called to build at this level — not for short-term
              wins, but to construct something durable, structured, and
              dependable. True business is earned. Trust is built through
              execution. Value is created through strong connections.
            </p>

            <p style={{ marginTop: "1.5rem" }}>
              I am here to win — ethically, strategically, and long-term.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div
          style={{
            marginTop: "6rem",
            height: "1px",
            backgroundColor: "#222"
          }}
        />

        {/* Call To Action */}
        <div
          style={{
            marginTop: "4rem",
            textAlign: "center"
          }}
        >
          <h2>Strategic Partnerships & Direct Inquiries</h2>

          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "#D4AF37",
              margin: "1rem auto 2rem auto"
            }}
          />

          <p style={{ maxWidth: "700px", margin: "0 auto 2rem auto" }}>
            If you are a long-term operator, investor, distributor, or serious
            business owner looking to build structured supply systems that
            generate real profit — reach out directly.
          </p>

          <a
            href="mailto:kvgarage@kvgarage.com"
            className="gold-btn"
          >
            kvgarage@kvgarage.com
          </a>
        </div>

      </section>
    </Layout>
  );
}
