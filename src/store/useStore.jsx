import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, IMAGE_BUCKET } from "../lib/supabase";
import { DEFAULT_SETTINGS, SEED_PRODUCTS } from "../data/seed";
import { resizeToBlob } from "../lib/image";

// ---------------------------------------------------------------------------
// Map between the database row shape (snake_case) and the app shape (camelCase).
// ---------------------------------------------------------------------------
function fromRow(r) {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    audience: r.audience,
    price: Number(r.price),
    size: r.size || undefined,
    description: r.description || "",
    notes: r.notes,
    image: r.image || "",
    topSeller: !!r.top_seller,
    outOfStock: !!r.out_of_stock,
  };
}

// Build a DB row from a (possibly partial) product object.
function toRow(p) {
  const row = {};
  if ("name" in p) row.name = p.name;
  if ("type" in p) row.type = p.type;
  if ("audience" in p) row.audience = p.audience;
  if ("price" in p) row.price = p.price;
  if ("size" in p) row.size = p.size ?? null;
  if ("description" in p) row.description = p.description;
  if ("notes" in p) row.notes = p.notes;
  if ("image" in p) row.image = p.image;
  if ("topSeller" in p) row.top_seller = p.topSeller;
  if ("outOfStock" in p) row.out_of_stock = p.outOfStock;
  return row;
}

function settingsFromRow(r) {
  return {
    whatsapp: r.whatsapp || "",
    email: r.email || "",
    tagline: r.tagline || "",
    locations: Array.isArray(r.locations) ? r.locations : [],
  };
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pull the latest catalogue + settings from the database.
  async function refresh() {
    const [{ data: prods }, { data: sett }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    if (prods) setProducts(prods.map(fromRow));
    if (sett) setSettings(settingsFromRow(sett));
  }

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        await refresh();
      } finally {
        if (active) setLoading(false);
      }
    })();

    // Track admin auth session.
    supabase.auth.getSession().then(({ data }) => active && setSession(data.session));
    const { data: authSub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );

    // Live updates: when the admin changes the data, every open storefront
    // refetches automatically — no manual refresh needed.
    const channel = supabase
      .channel("foa-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, refresh)
      .subscribe();

    return () => {
      active = false;
      authSub.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const api = useMemo(() => {
    return {
      products,
      settings,
      loading,
      isAdmin: !!session,

      // ---- auth (Supabase email/password) ----
      async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        return { ok: !error, error: error?.message };
      },
      async logout() {
        await supabase.auth.signOut();
      },

      // ---- products ----
      getProduct(id) {
        return products.find((p) => p.id === id) || null;
      },
      async addProduct(product) {
        const { data, error } = await supabase
          .from("products")
          .insert(toRow(product))
          .select()
          .single();
        if (error) {
          alert("Could not add product: " + error.message);
          return null;
        }
        setProducts((prev) => [fromRow(data), ...prev]);
        return data.id;
      },
      async updateProduct(id, patch) {
        const { data, error } = await supabase
          .from("products")
          .update(toRow(patch))
          .eq("id", id)
          .select()
          .single();
        if (error) {
          alert("Could not save changes: " + error.message);
          return;
        }
        setProducts((prev) => prev.map((p) => (p.id === id ? fromRow(data) : p)));
      },
      async deleteProduct(id) {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
          alert("Could not delete: " + error.message);
          return;
        }
        setProducts((prev) => prev.filter((p) => p.id !== id));
      },
      async toggleStock(id) {
        const current = products.find((p) => p.id === id);
        if (!current) return;
        await api.updateProduct(id, { outOfStock: !current.outOfStock });
      },

      // ---- images (Supabase Storage) ----
      async uploadImage(file) {
        const blob = await resizeToBlob(file);
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const { error } = await supabase.storage
          .from(IMAGE_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
        return data.publicUrl;
      },

      // ---- settings ----
      async updateSettings(patch) {
        const next = { ...settings, ...patch };
        const { error } = await supabase
          .from("settings")
          .upsert({ id: 1, ...next });
        if (error) {
          alert("Could not save settings: " + error.message);
          return;
        }
        setSettings(next);
      },

      // ---- first-run helper: insert the sample catalogue ----
      async loadSamples() {
        const { error } = await supabase.from("products").insert(SEED_PRODUCTS.map(toRow));
        if (error) {
          alert("Could not load samples: " + error.message);
          return;
        }
        await refresh();
      },

      refresh,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, settings, loading, session]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

// Build a WhatsApp deep link asking about a specific product.
export function whatsappLink(number, productName) {
  const text = encodeURIComponent(
    `Hello! Is "${productName}" available? I'd like to know more.`
  );
  return `https://wa.me/${number}?text=${text}`;
}
