// ---------------------------------------------------------------------------
// Static option lists used across the storefront and admin form.
// ---------------------------------------------------------------------------
export const TYPES = ["Perfume", "Perfumed Oil", "Roll-on", "Combo"];

// Perfumes are sold only in these three sizes — no other options.
export const PERFUME_SIZES = ["30ml", "50ml", "100ml"];

export const CATEGORIES = ["Oud", "Floral", "Musk", "Amber", "Citrus", "Spice"];

// Who the fragrance is intended for.
export const AUDIENCES = ["Men", "Women", "Unisex"];

// ---------------------------------------------------------------------------
// Default store settings. Editable from the admin Settings tab; persisted to
// localStorage after the first load.
// ---------------------------------------------------------------------------
export const DEFAULT_SETTINGS = {
  whatsapp: "12025550123", // digits only, country code first (no +)
  email: "hello@fragranceofarabia.com",
  tagline:
    "Pure oil-based perfumes imported from Dubai & the UAE — long-lasting, alcohol-free, and made to last.",
  locations: [
    {
      id: "loc-pg",
      name: "Mall at Prince George's",
      address: "3500 East-West Hwy, Hyattsville, MD 20782",
    },
    {
      id: "loc-am",
      name: "Arundel Mills",
      address: "7000 Arundel Mills Cir, Hanover, MD 21076",
    },
    {
      id: "loc-pm",
      name: "Pentagon Mall",
      address: "1100 S Hayes St, Arlington, VA 22202",
    },
    {
      id: "loc-pom",
      name: "Potomac Mills",
      address: "2700 Potomac Mills Cir, Woodbridge, VA 22192",
    },
  ],
};

// ---------------------------------------------------------------------------
// Sample catalogue. Images are left empty so they fall back to the elegant
// placeholder; the admin can upload real photos per product.
// ---------------------------------------------------------------------------
export const SEED_PRODUCTS = [
  {
    id: "p-royal-oud",
    name: "Royal Oud",
    type: "Perfume",
    category: "Oud",
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
    id: "p-amber-noir",
    name: "Amber Noir",
    type: "Perfume",
    category: "Amber",
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
    id: "o-white-musk",
    name: "White Musk Oil",
    type: "Perfumed Oil",
    category: "Musk",
    audience: "Women",
    price: 42,
    description:
      "Clean, powdery white musk in a pure oil base. Skin-soft and intimate, it layers under anything and never overwhelms.",
    notes: "White Musk, Powder, Soft Florals",
    image: "",
    topSeller: false,
    outOfStock: false,
  },
  {
    id: "r-rose-attar",
    name: "Rose Attar Roll-on",
    type: "Roll-on",
    category: "Floral",
    audience: "Women",
    price: 28,
    description:
      "A travel-ready glass roll-on of dewy Taif rose in oil. Glide it on the pulse points for an all-day veil of rose.",
    notes: "Taif Rose, Green Leaves, Honey",
    image: "",
    topSeller: false,
    outOfStock: false,
  },
  {
    id: "c-discovery",
    name: "Discovery Trio Combo",
    type: "Combo",
    category: "Oud",
    audience: "Unisex",
    price: 65,
    description:
      "Three of our bestselling oils in roll-on format — Royal Oud, Amber Noir, and White Musk. The perfect way to find your signature.",
    notes: "Royal Oud · Amber Noir · White Musk",
    image: "",
    topSeller: true,
    outOfStock: false,
  },
  {
    id: "o-saffron-amber",
    name: "Saffron & Amber Oil",
    type: "Perfumed Oil",
    category: "Spice",
    audience: "Men",
    price: 48,
    description:
      "Golden saffron threaded through warm amber and a hint of honey. Rich, radiant, and quietly addictive.",
    notes: "Saffron, Amber, Honey, Sandalwood",
    image: "",
    topSeller: false,
    outOfStock: true,
  },
];
