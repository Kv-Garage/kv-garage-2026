import Link from "next/link";

export default function Wholesale() {
  return (
    <div style={{
      background: "#0A0F1C",
      minHeight: "100vh",
      color: "#E6EAF2"
    }}>

      {/* HERO */}
      <section style={{
        padding: "160px 8% 100px 8%",
        borderBottom: "1px solid #1A2235"
      }}>
        <h1 style={{
          fontSize: "60px",
          fontWeight: "600",
          marginBottom: "20px"
        }}>
          Direct Wholesale Supply
        </h1>

        <p style={{ opacity: 0.75 }}>
          Built for operators. Minimum 4 units per SKU.
        </p>
      </section>

      {/* GRID */}
      <section style={{ padding: "120px 8%" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "50px"
        }}>

          {/* Tech */}
          <Link href="/wholesale/tech-accessories" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg"
                  alt="Tech Accessories"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Tech Accessories</h3>
                <p style={descStyle}>High turnover electronics</p>
              </div>
            </div>
          </Link>

          {/* Premium Glass */}
          <Link href="/wholesale/glass" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{
                height: "260px",
                background: "#0F172A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <img
                  src="/bong.webp"
                  alt="Premium Glass"
                  style={{
                    maxHeight: "220px",
                    maxWidth: "90%",
                    objectFit: "contain"
                  }}
                />
              </div>
              <div style={contentStyle}>
                <h3>Premium Glass</h3>
                <p style={descStyle}>Crystal & functional pieces</p>
              </div>
            </div>
          </Link>

          {/* Jewelry */}
          <Link href="/wholesale/jewelry" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg"
                  alt="Jewelry"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Jewelry</h3>
                <p style={descStyle}>Margin-driven accessories</p>
              </div>
            </div>
          </Link>

          {/* Essentials */}
          <Link href="/wholesale/essentials" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                 src="/febreze-vent-clip.png"
                 alt="Essentials"
                style={imgCover}
              />
              </div>
              <div style={contentStyle}>
                <h3>Essentials</h3>
                <p style={descStyle}>Daily repeat inventory</p>
              </div>
            </div>
          </Link>

          {/* Comfort */}
          <Link href="/wholesale/comfort" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg"
                  alt="Comfort"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Comfort</h3>
                <p style={descStyle}>Home & lifestyle staples</p>
              </div>
            </div>
          </Link>

          {/* Hair & Nail */}
          <Link href="/wholesale/hair-nail" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg"
                  alt="Hair & Nail"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Hair & Nail</h3>
                <p style={descStyle}>Professional supply</p>
              </div>
            </div>
          </Link>

          {/* Skincare */}
          <Link href="/wholesale/skincare" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg"
                  alt="Skincare"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Skincare</h3>
                <p style={descStyle}>Retail-ready product lines</p>
              </div>
            </div>
          </Link>

          {/* Schooling Products */}
          <Link href="/wholesale/schooling-products" style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <div style={{ height: "260px" }}>
                <img
                  src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg"
                  alt="Schooling Products"
                  style={imgCover}
                />
              </div>
              <div style={contentStyle}>
                <h3>Schooling Products</h3>
                <p style={descStyle}>Institutional demand items</p>
              </div>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}

const cardStyle = {
  background: "#111827",
  border: "1px solid #1A2235",
  borderRadius: "16px",
  overflow: "hidden"
};

const contentStyle = {
  padding: "28px"
};

const descStyle = {
  opacity: 0.6
};

const imgCover = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};
