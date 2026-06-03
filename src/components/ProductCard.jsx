import { Link } from "react-router-dom";
import { useStore, whatsappLink } from "../store/useStore";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { settings } = useStore();
  const oos = product.outOfStock;

  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--line-2)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--line)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Link to={`/product/${product.id}`} style={{ position: "relative", display: "block" }}>
        <ProductImage src={product.image} name={product.name} radius={0} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
          {product.topSeller && <span className="badge badge-top">Bestseller</span>}
          {oos && <span className="badge badge-oos">Out of stock</span>}
        </div>
      </Link>

      <div style={{ padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
          {product.type}
          {product.size ? ` · ${product.size}` : ""}
          {product.audience ? ` · ${product.audience}` : ""}
        </span>

        <Link to={`/product/${product.id}`}>
          <h3 style={{ fontSize: "1.3rem", color: "var(--text)" }}>{product.name}</h3>
        </Link>

        <p style={{ color: "var(--text-dim)", fontSize: "0.92rem", flex: 1 }}>
          {product.notes && typeof product.notes === "string"
            ? product.notes
            : product.description?.slice(0, 70) + "…"}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontFamily: "var(--display)", fontSize: "1.4rem", color: "var(--gold-bright)" }}>
            ${product.price}
          </span>

          {oos ? (
            <span className="badge badge-oos">Unavailable</span>
          ) : (
            <a
              className="btn btn-sm"
              href={whatsappLink(settings.whatsapp, product.name)}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
