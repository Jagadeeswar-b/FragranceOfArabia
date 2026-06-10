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

// Dual-thumb price range slider. `bounds` = [min, max] of the catalogue.
function PriceRange({ bounds, value, onChange }) {
  const [min, max] = bounds;
  const [lo, hi] = value;
  const span = Math.max(max - min, 1);
  const leftPct = ((lo - min) / span) * 100;
  const rightPct = ((hi - min) / span) * 100;

  return (
    <div style={{ maxWidth: 320 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          color: "var(--text-soft)",
          fontSize: "0.9rem",
        }}
      >
        <span>${lo}</span>
        <span>${hi}</span>
      </div>
      <div className="price-range">
        <div className="pr-track" />
        <div className="pr-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
          style={{ zIndex: lo > max - (max - min) * 0.1 ? 5 : 3 }}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
          style={{ zIndex: 4 }}
          aria-label="Maximum price"
        />
      </div>
    </div>
  );
}

const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["name", "Name: A–Z"],
];

export default function Shop() {
  const { products } = useStore();
  const [type, setType] = useState("All");
  const [audience, setAudience] = useState("All");
  const [sort, setSort] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [bestOnly, setBestOnly] = useState(false);
  const [range, setRange] = useState(null); // null = follow full bounds until adjusted

  // Price bounds from the catalogue (rounded outward to whole dollars).
  const bounds = useMemo(() => {
    if (!products.length) return [0, 100];
    const prices = products.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  const activeRange = range ?? bounds;
  const rangeTouched = range !== null;

  const visible = useMemo(() => {
    const [lo, hi] = activeRange;
    const list = products.filter((p) => {
      const typeOk = type === "All" || p.type === type;
      const audienceOk = audience === "All" || p.audience === audience;
      const priceOk = p.price >= lo && p.price <= hi;
      const stockOk = !inStockOnly || !p.outOfStock;
      const bestOk = !bestOnly || p.topSeller;
      return typeOk && audienceOk && priceOk && stockOk && bestOk;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => (b.topSeller ? 1 : 0) - (a.topSeller ? 1 : 0)); // featured
    return sorted;
  }, [products, type, audience, sort, inStockOnly, bestOnly, activeRange]);

  const filtersActive =
    type !== "All" || audience !== "All" || inStockOnly || bestOnly || rangeTouched || sort !== "featured";

  function resetAll() {
    setType("All");
    setAudience("All");
    setSort("featured");
    setInStockOnly(false);
    setBestOnly(false);
    setRange(null);
  }

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

      {/* price range + sort + stock toggle */}
      <div
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          alignItems: "flex-end",
          margin: "6px 0 26px",
        }}
      >
        <div>
          <span
            style={{
              display: "block",
              fontSize: "0.66rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--text-dim)",
              marginBottom: 12,
            }}
          >
            Price range
          </span>
          <PriceRange bounds={bounds} value={activeRange} onChange={setRange} />
        </div>

        <div>
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
            Sort by
          </span>
          <select className="select sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
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
            Show
          </span>
          <button
            onClick={() => setBestOnly((v) => !v)}
            style={{
              cursor: "pointer",
              background: bestOnly ? "rgba(201,154,75,0.12)" : "transparent",
              border: `1px solid ${bestOnly ? "var(--gold)" : "var(--line-2)"}`,
              color: bestOnly ? "var(--gold-bright)" : "var(--text-soft)",
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: "0.74rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              transition: "all 0.18s ease",
            }}
          >
            Bestsellers
          </button>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-soft)",
            cursor: "pointer",
            paddingBottom: 10,
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In stock only
        </label>
      </div>

      {/* result count + reset */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
          color: "var(--text-dim)",
          fontSize: "0.85rem",
        }}
      >
        <span>
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </span>
        {filtersActive && (
          <button
            onClick={resetAll}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "var(--gold)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: "0.74rem",
            }}
          >
            Reset filters
          </button>
        )}
      </div>

      <ProductGrid products={visible} />
    </div>
  );
}
