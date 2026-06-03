// Renders a product photo, or an elegant gold-monogram placeholder when no
// image has been uploaded yet.
export default function ProductImage({ src, name, ratio = "1 / 1", radius = 4 }) {
  if (src) {
    return (
      <div style={{ aspectRatio: ratio, overflow: "hidden", borderRadius: radius }}>
        <img
          src={src}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        aspectRatio: ratio,
        borderRadius: radius,
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(120% 120% at 50% 0%, #1d1a13, #0d0b08)",
        border: "1px solid var(--line)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: "2.6rem",
            color: "var(--gold)",
            opacity: 0.7,
          }}
        >
          ﷼
        </div>
        <div
          style={{
            fontFamily: "var(--sans)",
            fontSize: "0.62rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--text-dim)",
            marginTop: 6,
          }}
        >
          No image yet
        </div>
      </div>
    </div>
  );
}
