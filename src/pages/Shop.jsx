import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";
import { TYPES, AUDIENCES } from "../data/seed";
import ProductGrid from "../components/ProductGrid";

// Small reusable pill-filter row.
function FilterRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <span
        style={{
          display: "block",
          fontSize: "0.66rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          marginBottom: 10,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                cursor: "pointer",
                background: active ? "rgba(201,154,75,0.12)" : "transparent",
                border: `1px solid ${active ? "var(--gold)" : "var(--line-2)"}`,
                color: active ? "var(--gold-bright)" : "var(--text-soft)",
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: "0.74rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                transition: "all 0.18s ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Shop() {
  const { products } = useStore();
  const [type, setType] = useState("All");
  const [audience, setAudience] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const typeOk = type === "All" || p.type === type;
      const audienceOk = audience === "All" || p.audience === audience;
      return typeOk && audienceOk;
    });
  }, [products, type, audience]);

  return (
    <div className="container reveal" style={{ padding: "56px 24px 0" }}>
      <p className="kicker">The Collection</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", margin: "10px 0 6px" }}>Shop</h1>
      <p style={{ color: "var(--text-dim)", maxWidth: 560, marginBottom: 30 }}>
        Pure oil-based perfumes, perfumed oils, roll-ons, and gift combos. Tap any
        product to ask about availability on WhatsApp.
      </p>

      <FilterRow label="For" options={["All", ...AUDIENCES]} value={audience} onChange={setAudience} />
      <FilterRow label="Type" options={["All", ...TYPES]} value={type} onChange={setType} />

      <div style={{ marginTop: 16 }}>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
