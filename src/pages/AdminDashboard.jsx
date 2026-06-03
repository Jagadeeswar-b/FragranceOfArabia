import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { TYPES, PERFUME_SIZES, CATEGORIES, AUDIENCES } from "../data/seed";
import { fileToResizedDataURL } from "../lib/image";
import ProductImage from "../components/ProductImage";

const EMPTY = {
  name: "",
  type: "Perfume",
  category: "Oud",
  audience: "Unisex",
  price: "",
  size: "50ml",
  description: "",
  notes: { top: "", middle: "", end: "" },
  notesLine: "",
  image: "",
  topSeller: false,
  outOfStock: false,
};

// Convert a stored product into the editable form shape.
function toForm(p) {
  const isPerfume = p.type === "Perfume";
  return {
    name: p.name || "",
    type: p.type || "Perfume",
    category: p.category || "Oud",
    audience: p.audience || "Unisex",
    price: String(p.price ?? ""),
    size: p.size || "50ml",
    description: p.description || "",
    notes: isPerfume && p.notes ? { top: p.notes.top || "", middle: p.notes.middle || "", end: p.notes.end || "" } : { top: "", middle: "", end: "" },
    notesLine: !isPerfume && typeof p.notes === "string" ? p.notes : "",
    image: p.image || "",
    topSeller: !!p.topSeller,
    outOfStock: !!p.outOfStock,
  };
}

// Convert the form back into the stored product shape.
function fromForm(form) {
  const isPerfume = form.type === "Perfume";
  return {
    name: form.name.trim(),
    type: form.type,
    category: form.category,
    audience: form.audience,
    price: Number(form.price) || 0,
    size: isPerfume ? form.size : undefined,
    description: form.description.trim(),
    notes: isPerfume ? form.notes : form.notesLine.trim(),
    image: form.image,
    topSeller: form.topSeller,
    outOfStock: form.outOfStock,
  };
}

function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const isPerfume = form.type === "Perfume";
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataURL(file);
      set({ image: dataUrl });
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!form.name.trim()) return alert("Please enter a product name.");
    if (!form.price) return alert("Please enter a price.");
    onSave(fromForm(form));
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line-2)",
        borderRadius: "var(--radius)",
        padding: 24,
        marginBottom: 28,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 24, alignItems: "start" }} className="af-grid">
        {/* image uploader */}
        <div>
          <div style={{ width: 160 }}>
            <ProductImage src={form.image} name={form.name} />
          </div>
          <label className="btn btn-ghost btn-sm" style={{ marginTop: 10, width: 160, cursor: "pointer" }}>
            {busy ? "Processing…" : form.image ? "Replace image" : "Upload image"}
            <input type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
          </label>
          {form.image && (
            <button className="btn btn-danger btn-sm" style={{ marginTop: 8, width: 160 }} onClick={() => set({ image: "" })}>
              Remove image
            </button>
          )}
        </div>

        {/* fields */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Price (USD)</label>
              <input className="input" type="number" value={form.price} onChange={(e) => set({ price: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Type</label>
              <select className="select" value={form.type} onChange={(e) => set({ type: e.target.value })}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Category</label>
              <select className="select" value={form.category} onChange={(e) => set({ category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>For</label>
              <select className="select" value={form.audience} onChange={(e) => set({ audience: e.target.value })}>
                {AUDIENCES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            {isPerfume && (
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Size</label>
                <select className="select" value={form.size} onChange={(e) => set({ size: e.target.value })}>
                  {PERFUME_SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="field" style={{ marginTop: 14 }}>
            <label>Description</label>
            <textarea className="textarea" value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </div>

          {isPerfume ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Top notes</label>
                <input className="input" value={form.notes.top} onChange={(e) => set({ notes: { ...form.notes, top: e.target.value } })} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Middle notes</label>
                <input className="input" value={form.notes.middle} onChange={(e) => set({ notes: { ...form.notes, middle: e.target.value } })} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Base notes</label>
                <input className="input" value={form.notes.end} onChange={(e) => set({ notes: { ...form.notes, end: e.target.value } })} />
              </div>
            </div>
          ) : (
            <div className="field">
              <label>Notes (single line)</label>
              <input className="input" value={form.notesLine} onChange={(e) => set({ notesLine: e.target.value })} placeholder="e.g. Taif Rose, Honey, Sandalwood" />
            </div>
          )}

          <div style={{ display: "flex", gap: 24, margin: "8px 0 18px" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", color: "var(--text-soft)" }}>
              <input type="checkbox" checked={form.topSeller} onChange={(e) => set({ topSeller: e.target.checked })} />
              Bestseller
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", color: "var(--text-soft)" }}>
              <input type="checkbox" checked={form.outOfStock} onChange={(e) => set({ outOfStock: e.target.checked })} />
              Out of stock
            </label>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn" onClick={save}>
              Save product
            </button>
            <button className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 720px){ .af-grid{ grid-template-columns:1fr !important; } }`}</style>
    </div>
  );
}

function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock } = useStore();
  const [editingId, setEditingId] = useState(null); // product id, or "new", or null
  const editing = editingId === "new" ? EMPTY : editingId ? toForm(products.find((p) => p.id === editingId)) : null;

  function handleSave(data) {
    if (editingId === "new") addProduct(data);
    else updateProduct(editingId, data);
    setEditingId(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1.6rem" }}>Products ({products.length})</h2>
        {editingId === null && (
          <button className="btn" onClick={() => setEditingId("new")}>
            + Add product
          </button>
        )}
      </div>

      {editing && (
        <ProductForm initial={editing} onSave={handleSave} onCancel={() => setEditingId(null)} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr auto",
              gap: 16,
              alignItems: "center",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: 12,
            }}
          >
            <div style={{ width: 64 }}>
              <ProductImage src={p.image} name={p.name} />
            </div>
            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ color: "var(--text)", fontFamily: "var(--display)", fontSize: "1.1rem" }}>{p.name}</span>
                {p.topSeller && <span className="badge badge-top">Bestseller</span>}
                {p.outOfStock && <span className="badge badge-oos">Out of stock</span>}
              </div>
              <span style={{ color: "var(--text-dim)", fontSize: "0.84rem" }}>
                {p.type}{p.size ? ` · ${p.size}` : ""}{p.audience ? ` · ${p.audience}` : ""} · ${p.price}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(p.id)}>
                Edit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => toggleStock(p.id)}>
                {p.outOfStock ? "Mark in stock" : "Mark out"}
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  function setLocation(id, patch) {
    set({ locations: form.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }
  function addLocation() {
    set({ locations: [...form.locations, { id: `loc-${Date.now()}`, name: "", address: "" }] });
  }
  function removeLocation(id) {
    set({ locations: form.locations.filter((l) => l.id !== id) });
  }
  function save() {
    updateSettings(form);
    alert("Settings saved.");
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 style={{ fontSize: "1.6rem", marginBottom: 20 }}>Store settings</h2>

      <div className="field">
        <label>WhatsApp number (digits only, country code first — no +)</label>
        <input className="input" value={form.whatsapp} onChange={(e) => set({ whatsapp: e.target.value.replace(/\D/g, "") })} placeholder="12025550123" />
      </div>
      <div className="field">
        <label>Contact email</label>
        <input className="input" value={form.email} onChange={(e) => set({ email: e.target.value })} />
      </div>
      <div className="field">
        <label>Tagline</label>
        <textarea className="textarea" value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "26px 0 12px" }}>
        <p className="kicker">Store Locations</p>
        <button className="btn btn-ghost btn-sm" onClick={addLocation}>
          + Add location
        </button>
      </div>

      {form.locations.map((loc) => (
        <div
          key={loc.id}
          style={{ border: "1px solid var(--line)", borderRadius: "var(--radius)", padding: 16, marginBottom: 12 }}
        >
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Name</label>
            <input className="input" value={loc.name} onChange={(e) => setLocation(loc.id, { name: e.target.value })} />
          </div>
          <div className="field" style={{ marginBottom: 10 }}>
            <label>Address</label>
            <input className="input" value={loc.address} onChange={(e) => setLocation(loc.id, { address: e.target.value })} />
          </div>
          <button className="btn btn-danger btn-sm" onClick={() => removeLocation(loc.id)}>
            Remove
          </button>
        </div>
      ))}

      <button className="btn" style={{ marginTop: 12 }} onClick={save}>
        Save settings
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { logout, resetAll } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");

  return (
    <div className="container reveal" style={{ padding: "44px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p className="kicker">Logged in as admin</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", marginTop: 6 }}>Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (confirm("Reset all products and settings to the original samples?")) resetAll();
            }}
          >
            Reset to defaults
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Log out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "26px 0 28px", borderBottom: "1px solid var(--line)" }}>
        {[
          ["products", "Products"],
          ["settings", "Settings"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === key ? "var(--gold)" : "transparent"}`,
              color: tab === key ? "var(--gold-bright)" : "var(--text-dim)",
              padding: "10px 14px",
              fontSize: "0.78rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "products" ? <ProductsTab /> : <SettingsTab />}
    </div>
  );
}
