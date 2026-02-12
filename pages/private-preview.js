import Layout from '../components/Layout';

export default function PrivatePreview() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <h1>Private Inventory Preview</h1>

        <p style={{ marginTop: "1.5rem", maxWidth: "700px" }}>
          Our private preview access is reserved for qualified buyers,
          distributors, and strategic partners seeking exclusive inventory
          opportunities before public release.
        </p>

        <div
          style={{
            marginTop: "4rem",
            border: "1px solid #222",
            padding: "2rem"
          }}
        >
          <form
            name="private-preview"
            method="POST"
            data-netlify="true"
          >
            <input type="hidden" name="form-name" value="private-preview" />

            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                name="company"
                placeholder="Company / Operation"
                required
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <textarea
                name="request"
                placeholder="What inventory categories or volume are you seeking?"
                required
                rows="5"
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <button type="submit" className="gold-btn">
              Request Access
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
