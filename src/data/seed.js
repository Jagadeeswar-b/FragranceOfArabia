// ---------------------------------------------------------------------------
// Static option lists used across the storefront and admin form.
// ---------------------------------------------------------------------------
export const TYPES = ["Perfume", "Perfumed Oil", "Roll-on", "Combo"];

// Perfumes are sold only in these three sizes — no other options.
export const PERFUME_SIZES = ["30ml", "50ml", "100ml"];

// Who the fragrance is intended for.
export const AUDIENCES = ["Men", "Women", "Unisex"];

// ---------------------------------------------------------------------------
// Default settings — used as a fallback before the database loads.
// The live values come from the `settings` row in Supabase.
// ---------------------------------------------------------------------------
export const DEFAULT_SETTINGS = {
  whatsapp: "12025550123", // digits only, country code first (no +)
  email: "hello@fragranceofarabia.com",
  tagline:
    "Pure oil-based perfumes imported from Dubai & the UAE — long-lasting, alcohol-free, and made to last.",
  locations: [
    { id: "loc-pg", name: "Mall at Prince George's", address: "3500 East-West Hwy, Hyattsville, MD-20782" },
    { id: "loc-am", name: "Arundel Mills", address: "7000 Arundel Mills Cir, Hanover, MD-21076" },
    { id: "loc-pm", name: "Pentagon Mall", address: "1100 S Hayes St, Arlington, VA-22202" },
  ],
};

// ---------------------------------------------------------------------------
// Sample catalogue. Used only by the "Load sample products" button in the
// admin dashboard (handy on a fresh, empty database). Real data lives in
// Supabase. No `id` here — the database generates a UUID on insert.
// ---------------------------------------------------------------------------
export const SEED_PRODUCTS = [
  {
    name: "Royal Oud",
    type: "Perfume",
    audience: "Men",
    price: 89,
    size: "50ml",
    description:
      "A deep, smoky oud built on aged agarwood and a whisper of rose. Opulent and unmistakably Arabian — a single drop lasts the day.",
    notes: { top: "Saffron, Rose", middle: "Agarwood, Cedar", end: "Amber, Musk" },
    image: "",
    topSeller: true,
    outOfStock: false,
  },
  {
    name: "Amber Noir",
    type: "Perfume",
    audience: "Unisex",
    price: 75,
    size: "50ml",
    description:
      "Warm amber wrapped in vanilla and soft leather. A cozy, sensual evening scent that settles beautifully on skin.",
    notes: { top: "Bergamot", middle: "Amber, Labdanum", end: "Vanilla, Leather" },
    image: "",
    topSeller: true,
    outOfStock: false,
  },
  {
    name: "White Musk Oil",
    type: "Perfumed Oil",
    audience: "Women",
    price: 42,
    size: null,
    description:
      "Clean, powdery white musk in a pure oil base. Skin-soft and intimate, it layers under anything and never overwhelms.",
    notes: "White Musk, Powder, Soft Florals",
    image: "",
    topSeller: false,
    outOfStock: false,
  },
  {
    name: "Rose Attar Roll-on",
    type: "Roll-on",
    audience: "Women",
    price: 28,
    size: null,
    description:
      "A travel-ready glass roll-on of dewy Taif rose in oil. Glide it on the pulse points for an all-day veil of rose.",
    notes: "Taif Rose, Green Leaves, Honey",
    image: "",
    topSeller: false,
    outOfStock: false,
  },
  {
    name: "Discovery Trio Combo",
    type: "Combo",
    audience: "Unisex",
    price: 65,
    size: null,
    description:
      "Three of our bestselling oils in roll-on format — Royal Oud, Amber Noir, and White Musk. The perfect way to find your signature.",
    notes: "Royal Oud · Amber Noir · White Musk",
    image: "",
    topSeller: true,
    outOfStock: false,
  },
  {
    name: "Saffron & Amber Oil",
    type: "Perfumed Oil",
    audience: "Men",
    price: 48,
    size: null,
    description:
      "Golden saffron threaded through warm amber and a hint of honey. Rich, radiant, and quietly addictive.",
    notes: "Saffron, Amber, Honey, Sandalwood",
    image: "",
    topSeller: false,
    outOfStock: true,
  },
];
