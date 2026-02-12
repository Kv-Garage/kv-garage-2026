import Layout from '../components/Layout';
import products from '../data/products.json';

export default function Shop() {
  return (
    <Layout>
      <section className="container" style={{ padding: "6rem 2rem" }}>
        <h1>Shop</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginTop: "3rem"
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              style={{
                border: "1px solid #222",
                padding: "2rem"
              }}
            >
              <h3>{product.name}</h3>
              <p style={{ margin: "1rem 0" }}>${product.price}</p>

              <a
                href={product.stripeLink}
                className="gold-btn"
              >
                Buy Now
              </a>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
