import { Link, useParams } from "react-router-dom";
import { useStore, whatsappLink } from "../store/useStore";
import ProductImage from "../components/ProductImage";

function NotesPyramid({ notes }) {
  const rows = [
    ["Top notes", notes?.top],
    ["Middle notes", notes?.middle],
    ["Base notes", notes?.end],
  ].filter(([, v]) => v);

  if (!rows.length) return null;
  return (
    <div style={{ marginTop: 26 }}>
      <p className="kicker" style={{ marginBottom: 12 }}>
        Fragrance Pyramid
      </p>
      {rows.map(([label, value]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 20,
            padding: "12px 0",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <span style={{ color: "var(--text-dim)", fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {label}
          </span>
          <span style={{ color: "var(--text)", textAlign: "right" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { getProduct, settings } = useStore();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2>Product not found</h2>
        <p style={{ color: "var(--text-dim)", margin: "12px 0 24px" }}>
          It may have been removed.
        </p>
        <Link className="btn btn-ghost" to="/shop">
          Back to shop
        </Link>
      </div>
    );
  }

  const oos = product.outOfStock;
  const isPerfume = product.type === "Perfume";

  return (
    <div className="container reveal" style={{ padding: "48px 24px 0" }}>
      <Link to="/shop" style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
        ← Back to shop
      </Link>

      <div
        style={{
          display: "grid",
          gap: 48,
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          marginTop: 24,
          alignItems: "start",
        }}
        className="pd-grid"
      >
        {/* image */}
        <div style={{ position: "relative" }}>
          <ProductImage src={product.image} name={product.name} ratio="4 / 5" />
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
            {product.topSeller && <span className="badge badge-top">Bestseller</span>}
            {oos && <span className="badge badge-oos">Out of stock</span>}
          </div>
        </div>

        {/* details */}
        <div>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
            {product.type}
            {product.audience ? ` · ${product.audience}` : ""}
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", margin: "8px 0 10px" }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "2rem", color: "var(--gold-bright)" }}>
              ${product.price}
            </span>
            {isPerfume && product.size && (
              <span className="badge">{product.size}</span>
            )}
          </div>

          <hr className="hr-gold" style={{ width: "100%" }} />

          <p style={{ color: "var(--text-soft)", fontSize: "1.05rem" }}>
            {product.description}
          </p>

          {/* notes — pyramid for perfumes, single line for everything else */}
          {isPerfume ? (
            <NotesPyramid notes={product.notes} />
          ) : (
            product.notes && (
              <div style={{ marginTop: 24 }}>
                <p className="kicker" style={{ marginBottom: 8 }}>
                  Notes
                </p>
                <p style={{ color: "var(--text)" }}>{product.notes}</p>
              </div>
            )
          )}

          {/* CTA */}
          <div style={{ marginTop: 34 }}>
            {oos ? (
              <div
                style={{
                  border: "1px solid rgba(216,113,78,0.4)",
                  background: "rgba(216,113,78,0.07)",
                  borderRadius: "var(--radius)",
                  padding: "16px 18px",
                  color: "var(--danger)",
                }}
              >
                This item is currently out of stock. Please check back soon.
              </div>
            ) : (
              <>
                <a
                  className="btn"
                  href={whatsappLink(settings.whatsapp, product.name)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "0.85rem", padding: "14px 30px" }}
                >
                  Ask availability on WhatsApp
                </a>
                <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: 12 }}>
                  Tap to message us directly — we'll confirm stock and answer any
                  questions.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* responsive: stack columns on narrow screens */}
      <style>{`
        @media (max-width: 760px) {
          .pd-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </div>
  );
}
