import Layout from '../components/Layout';

export default function Wholesale() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <h1>Wholesale Partnership</h1>

        <p style={{ marginTop: "1.5rem", maxWidth: "700px" }}>
          We work with retail operators, distributors, and store owners
          looking for structured supply systems and consistent margin.
          Complete the application below to begin evaluation.
        </p>

        <div
          style={{
            marginTop: "4rem",
            border: "1px solid #222",
            padding: "2rem"
          }}
        >
          <form
            name="wholesale"
            method="POST"
            data-netlify="true"
          >
            <input type="hidden" name="form-name" value="wholesale" />

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
                placeholder="Company / Store Name"
                required
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <textarea
                name="details"
                placeholder="Tell us about your operation, volume, and goals."
                required
                rows="5"
                style={{ width: "100%", padding: "12px" }}
              />
            </div>

            <button type="submit" className="gold-btn">
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
