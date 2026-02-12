import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#000",
          borderBottom: "1px solid #111",
          padding: "1.5rem 2rem"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* Brand */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <div>
              <div
                style={{
                  fontSize: "1.2rem",
                  letterSpacing: "3px",
                  fontWeight: "600"
                }}
              >
                KV GARAGE
              </div>

              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "2px",
                  opacity: "0.6",
                  marginTop: "4px"
                }}
              >
                ESTABLISHED 2022
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav
            style={{
              display: "flex",
              gap: "2rem",
              fontSize: "0.9rem",
              letterSpacing: "1px"
            }}
          >
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/wholesale">Wholesale</Link>
            <Link href="/private-preview">Private Preview</Link>
            <Link href="/mentorship">Mentorship</Link>
            <Link href="/affiliate">Affiliate</Link>
          </nav>
        </div>

        {/* Gold Accent Line */}
        <div
          style={{
            height: "2px",
            backgroundColor: "#D4AF37",
            marginTop: "1rem"
          }}
        />
      </header>

      <main>{children}</main>

      <footer
        style={{
          borderTop: "1px solid #111",
          marginTop: "6rem",
          padding: "3rem 2rem",
          backgroundColor: "#000"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ marginBottom: "0.5rem" }}>
            KV Garage 2026
          </p>

          <p style={{ fontSize: "0.8rem", opacity: "0.6" }}>
            Established 2022
          </p>

          <div style={{ marginTop: "1rem" }}>
            <a
              href="https://www.instagram.com/kave.steele/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
