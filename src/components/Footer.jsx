import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3 style={{ fontSize: "1.5rem", color: "var(--gold-bright)" }}>
            Fragrance of Arabia
          </h3>
          <hr className="hr-gold" />
          <p style={{ color: "var(--text-dim)", maxWidth: 320 }}>
            {settings.tagline}
          </p>
        </div>

        <div>
          <p className="kicker" style={{ marginBottom: 14 }}>
            Visit Us
          </p>
          {settings.locations.map((loc) => (
            <div key={loc.id} style={{ marginBottom: 14 }}>
              <p style={{ color: "var(--text)", fontWeight: 400 }}>{loc.name}</p>
              <p style={{ color: "var(--text-dim)", fontSize: "0.92rem" }}>
                {loc.address}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="kicker" style={{ marginBottom: 14 }}>
            Explore
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/shop" style={{ color: "var(--text-soft)" }}>
              Shop all
            </Link>
            <Link to="/contact" style={{ color: "var(--text-soft)" }}>
              Contact
            </Link>
            <a href={`mailto:${settings.email}`} style={{ color: "var(--text-soft)" }}>
              {settings.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Fragrance of Arabia</span>
        <span>Pure oil-based · Alcohol-free · Imported from Dubai & the UAE</span>
      </div>
    </footer>
  );
}
