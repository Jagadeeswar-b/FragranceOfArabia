# Fragrance of Arabia

A storefront for pure oil-based perfumes imported from Dubai & the UAE.
No backend required — products and settings are stored in the browser
(`localStorage`), so it runs with a single command.

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

- Storefront: `/`
- Shop: `/shop`
- Product page: `/product/:id`
- Contact / locations: `/contact`
- Admin: `/admin`  →  **admin / arabia2026** (demo login)

## Build for production

```bash
npm run build      # output in /dist
npm run preview    # preview the production build
```

Deploy `/dist` to any static host. `vercel.json` is included so deep links
(e.g. `/admin`, `/product/...`) work after a refresh on Vercel.

## What the admin can do

Log in at `/admin`, then:

- **Products tab** — add / edit / delete products; upload an image (auto-resized);
  set type (Perfume / Perfumed Oil / Roll-on / Combo), category, price, and
  description. Perfumes use Top / Middle / Base notes and a size of **30ml, 50ml,
  or 100ml**; other types use a single notes line. Toggle **Bestseller** and
  **Out of stock** (or use "Mark out / Mark in stock" in the list). Out-of-stock
  items show a badge and hide the WhatsApp button.
- **Settings tab** — set the WhatsApp number (digits only, country code first,
  no `+`), contact email, tagline, and the store locations shown on the Contact
  page and footer.
- **Reset to defaults** restores the original sample catalogue and settings.

## Important notes on this no-backend build

- All data lives in **this browser only**. Admin edits are not visible to
  customers on other devices, and clearing browser data wipes the catalogue.
  This is the trade-off for "runs instantly with no setup." If you need edits to
  go live for every visitor, use a backend (e.g. the Supabase version).
- Change the demo credentials in `src/store/useStore.jsx` (`ADMIN_USERNAME`,
  `ADMIN_PASSWORD`) before sharing the site. Client-side login keeps casual
  visitors out but is not strong security.
- Images are resized/compressed before storage to stay within the ~5 MB
  `localStorage` budget. Very many large photos can still fill it up.

## File map

```
index.html                 entry + fonts + favicon
public/favicon.svg         gold attar-bottle favicon
vercel.json                SPA rewrite for deep links
src/
  main.jsx                 React entry
  App.jsx                  routes + layout + admin guard
  index.css                design tokens + base styles
  data/seed.js             sample products, default settings, option lists
  lib/image.js             upload resizer (-> data URL)
  store/useStore.jsx       localStorage-backed state + auth
  components/
    Navbar.jsx
    Footer.jsx
    ProductImage.jsx       photo or elegant placeholder
    ProductCard.jsx
    ProductGrid.jsx        responsive 1 / 2 / 3–4 per row
  pages/
    Home.jsx
    Shop.jsx
    ProductDetail.jsx      notes pyramid for perfumes; single notes otherwise
    Contact.jsx            three store locations
    AdminLogin.jsx
    AdminDashboard.jsx     product CRUD + settings
```
