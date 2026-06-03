import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import ProductGrid from "../components/ProductGrid";

export default function Home() {
  const { products, settings } = useStore();
  const bestsellers = products.filter((p) => p.topSeller && !p.outOfStock).slice(0, 4);
  const featured = bestsellers.length
    ? bestsellers
    : products.filter((p) => !p.outOfStock).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="container reveal"
          style={{ padding: "110px 24px 96px", textAlign: "center", maxWidth: 860 }}
        >
          <p className="kicker">Imported from Dubai &amp; the UAE</p>
          <h1
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              margin: "20px 0 14px",
              color: "var(--text)",
            }}
          >
            The Scent of{" "}
            <span style={{ color: "var(--gold-bright)", fontStyle: "italic", fontFamily: "var(--serif)" }}>
              Arabia
            </span>
          </h1>
          <p
            style={{
              color: "var(--text-soft)",
              fontSize: "1.15rem",
              maxWidth: 620,
              margin: "0 auto 14px",
            }}
          >
            {settings.tagline}
          </p>
          <p
            style={{
              color: "var(--gold)",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              fontSize: "0.74rem",
              marginBottom: 36,
            }}
          >
            100ml · 50ml · 30ml — pure oil-based
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn" to="/shop">
              Shop the Collection
            </Link>
            <Link className="btn btn-ghost" to="/contact">
              Find a Store
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="container" style={{ padding: "64px 24px 24px" }}>
        <div
          style={{
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {[
            ["Oil-based", "Concentrated attar oils — no alcohol, no filler. A little goes a long way."],
            ["Long-lasting", "Worn on the skin, the scent unfolds slowly and lingers from morning to night."],
            ["Imported", "Sourced directly from perfumers in Dubai and across the UAE."],
          ].map(([title, body]) => (
            <div
              key={title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                padding: 28,
              }}
            >
              <h3 style={{ color: "var(--gold-bright)", fontSize: "1.3rem" }}>{title}</h3>
              <hr className="hr-gold" />
              <p style={{ color: "var(--text-dim)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container" style={{ padding: "48px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <p className="kicker">Most Loved</p>
            <h2 style={{ fontSize: "2.2rem", marginTop: 8 }}>Bestsellers</h2>
          </div>
          <Link to="/shop" style={{ color: "var(--gold)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
            View all →
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
    </div>
  );
}
