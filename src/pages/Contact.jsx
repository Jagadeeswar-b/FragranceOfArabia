import { useEffect, useState } from "react";
import { useStore, whatsappLink } from "../store/useStore";

// Build map links for a location. We combine name + address for a precise pin.
function mapLinks(loc) {
  const q = encodeURIComponent(`${loc.name}, ${loc.address}`);
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
    waze: `https://waze.com/ul?q=${q}`,
  };
}

function MapsChooser({ location, onClose }) {
  const [copied, setCopied] = useState(false);
  const links = mapLinks(location);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function open(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(location.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const options = [
    ["Google Maps", links.google],
    ["Apple Maps", links.apple],
    ["Waze", links.waze],
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <p className="kicker">Open in</p>
        <h3 style={{ fontSize: "1.4rem", color: "var(--gold-bright)", margin: "6px 0 2px" }}>
          {location.name}
        </h3>
        <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: 20 }}>
          {location.address}
        </p>

        {options.map(([label, url]) => (
          <button key={label} className="map-option" onClick={() => open(url)}>
            <span>{label}</span>
            <span className="mo-arrow">↗</span>
          </button>
        ))}

        <button className="map-option" onClick={copy}>
          <span>{copied ? "Address copied" : "Copy address"}</span>
          <span className="mo-arrow">{copied ? "✓" : "⧉"}</span>
        </button>

        <button
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: 8 }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const { settings } = useStore();
  const [active, setActive] = useState(null); // the location whose chooser is open

  return (
    <div className="container reveal" style={{ padding: "56px 24px 0" }}>
      <p className="kicker">Come Say Hello</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", margin: "10px 0 6px" }}>
        Visit Us
      </h1>
      <p style={{ color: "var(--text-dim)", maxWidth: 560, marginBottom: 36 }}>
        Find us at any of our three locations, or reach out on WhatsApp to ask
        about a fragrance before you stop by. Tap a store to get directions.
      </p>

      <div
        style={{
          display: "grid",
          gap: 22,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginBottom: 48,
        }}
      >
        {settings.locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setActive(loc)}
            style={{
              textAlign: "left",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 28,
              cursor: "pointer",
              transition: "border-color 0.18s ease, transform 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--line)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <p style={{ fontFamily: "var(--display)", fontSize: "1.35rem", color: "var(--gold-bright)", fontWeight: 400 }}>
              {loc.name}
            </p>
            <p style={{ color: "var(--text-soft)", marginTop: 8 }}>{loc.address}</p>
            <p style={{ color: "var(--gold)", marginTop: 14, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Get directions →
            </p>
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <a
          className="btn"
          href={whatsappLink(settings.whatsapp, "your fragrances")}
          target="_blank"
          rel="noreferrer"
        >
          Message on WhatsApp
        </a>
        <a className="btn btn-ghost" href={`mailto:${settings.email}`}>
          {settings.email}
        </a>
      </div>

      {active && <MapsChooser location={active} onClose={() => setActive(null)} />}
    </div>
  );
}
