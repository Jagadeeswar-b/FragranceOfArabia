import ProductCard from "./ProductCard";

// Responsive grid:
//   - phones: 1 card per row
//   - tablets: 2 per row
//   - desktop: 3, widening to 4 on large screens
// Implemented with auto-fill + minmax so it adapts to the container width.
export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <p style={{ color: "var(--text-dim)", textAlign: "center", padding: "60px 0" }}>
        No products to show yet.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 22,
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
