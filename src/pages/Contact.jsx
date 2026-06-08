import { useStore, whatsappLink } from "../store/useStore";

export default function Contact() {
  const { settings } = useStore();

  return (
    <div className="container reveal" style={{ padding: "56px 24px 0" }}>
      <p className="kicker">Come Say Hello</p>
      <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", margin: "10px 0 6px" }}>
        Visit Us
      </h1>
      <p style={{ color: "var(--text-dim)", maxWidth: 560, marginBottom: 36 }}>
        Find us at any of our three locations, or reach out on WhatsApp to ask
        about a fragrance before you stop by.
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
          <div
            key={loc.id}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 28,
            }}
          >
            <p style={{ fontFamily: "var(--display)", fontSize: "1.35rem", color: "var(--gold-bright)", fontWeight: 400 }}>
              {loc.name}
            </p>
            <p style={{ color: "var(--text-soft)", marginTop: 8 }}>{loc.address}</p>
          </div>
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
    </div>
  );
}
