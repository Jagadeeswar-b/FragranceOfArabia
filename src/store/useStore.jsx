import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SEED_PRODUCTS, DEFAULT_SETTINGS } from "../data/seed";

// ---------------------------------------------------------------------------
// Admin credentials (demo). CHANGE THESE before sharing the site.
// Because this build has no backend, "login" is a client-side check and the
// session is remembered in localStorage. It keeps the admin panel out of a
// casual visitor's hands, but it is not bank-grade security — if you need real
// protection for many users, use the Supabase version instead.
// ---------------------------------------------------------------------------
const ADMIN_USERNAME = "Jagadeesh";
const ADMIN_PASSWORD = "FOA@2026";

const KEYS = {
  products: "foa.products.v1",
  settings: "foa.settings.v1",
  auth: "foa.auth.v1",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Most likely the localStorage quota was exceeded (too many large images).
    console.error("Could not save to localStorage:", e);
    alert(
      "Storage is full — this usually means too many large images. Try removing a product image or uploading smaller photos."
    );
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => load(KEYS.products, SEED_PRODUCTS));
  const [settings, setSettings] = useState(() => load(KEYS.settings, DEFAULT_SETTINGS));
  const [isAdmin, setIsAdmin] = useState(() => load(KEYS.auth, false));

  useEffect(() => save(KEYS.products, products), [products]);
  useEffect(() => save(KEYS.settings, settings), [settings]);
  useEffect(() => save(KEYS.auth, isAdmin), [isAdmin]);

  const api = useMemo(
    () => ({
      products,
      settings,
      isAdmin,

      // ---- auth ----
      login(username, password) {
        const ok =
          username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
        if (ok) setIsAdmin(true);
        return ok;
      },
      logout() {
        setIsAdmin(false);
      },

      // ---- products ----
      getProduct(id) {
        return products.find((p) => p.id === id) || null;
      },
      addProduct(product) {
        const id = product.id || `p-${Date.now()}`;
        setProducts((prev) => [{ ...product, id }, ...prev]);
        return id;
      },
      updateProduct(id, patch) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
        );
      },
      deleteProduct(id) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      },
      toggleStock(id) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, outOfStock: !p.outOfStock } : p
          )
        );
      },

      // ---- settings ----
      updateSettings(patch) {
        setSettings((prev) => ({ ...prev, ...patch }));
      },

      // ---- reset ----
      resetAll() {
        setProducts(SEED_PRODUCTS);
        setSettings(DEFAULT_SETTINGS);
      },
    }),
    [products, settings, isAdmin]
  );

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
