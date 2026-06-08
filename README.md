# Fragrance of Arabia

A storefront for pure oil-based perfumes imported from Dubai & the UAE.
Now backed by **Supabase**, so when the admin adds or edits a product it goes
**live for every customer** — and updates appear without a page refresh.

## What changed from the local version

- Products, settings, and store locations live in a Supabase database (not the
  browser). Admin edits are shared with everyone.
- Product images are uploaded to Supabase Storage (proper hosting), not stored
  in the browser.
- Admin login uses real Supabase Authentication (email + password).
- The **Category** field was removed — products are organised by **Type**
  (Perfume / Perfumed Oil / Roll-on / Combo) and **For** (Men / Women / Unisex).

## One-time setup

1. **Create a project** at https://supabase.com (free tier is fine).
2. **Run the schema.** In the Supabase dashboard → SQL Editor → paste the
   contents of `supabase/schema.sql` → Run. This creates the tables, the public
   `product-images` storage bucket, security rules, and live updates.
3. **Create the admin user.** Dashboard → Authentication → Users → Add user →
   enter an email + password and tick "Auto confirm". This is your admin login.
4. **Add your keys.** Dashboard → Project Settings → API. Copy `.env.example`
   to `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
   ```
   (The anon key is safe to expose — writes are protected by the login + rules.)

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173).

- Storefront: `/`  ·  Shop: `/shop`  ·  Contact: `/contact`
- Admin (not linked publicly): `/admin` — sign in with the user you created.
  Once logged in, a "Dashboard" link appears in the menu.

First time in, the catalogue is empty — click **Load sample products** in the
dashboard to populate the six samples, or just add your own.

## Deploy (Vercel)

```bash
npm run build      # output in /dist
```

Push to Vercel and add the same two environment variables
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel project settings.
`vercel.json` is included so deep links work after a refresh.

## How security works

- Anyone can **read** the catalogue (it's a public shop).
- Only a **signed-in admin** can add, edit, or delete products and settings, or
  upload images. This is enforced by Supabase Row Level Security in
  `schema.sql`, so it holds even though the storefront code is public.

## File map

```
.env.example               Supabase keys template (copy to .env)
index.html                 entry + fonts + favicon
public/favicon.svg         gold attar-bottle favicon
vercel.json                SPA rewrite for deep links
supabase/schema.sql        tables, security rules, storage bucket, realtime
src/
  main.jsx                 React entry
  App.jsx                  routes + layout + loading gate + admin guard
  index.css                design tokens + base styles
  data/seed.js             option lists, default settings, sample products
  lib/
    supabase.js            Supabase client + image bucket name
    image.js               resizes uploads before they go to Storage
  store/useStore.jsx       Supabase data, auth, image upload, live updates
  components/
    Navbar.jsx             hamburger menu on mobile; admin hidden from public
    Footer.jsx             stacks on tablet + mobile
    ProductImage.jsx       photo or elegant placeholder
    ProductCard.jsx
    ProductGrid.jsx        responsive 1 / 2 / 3–4 per row
  pages/
    Home.jsx
    Shop.jsx               filter by For (audience) and Type
    ProductDetail.jsx      notes pyramid for perfumes; single notes otherwise
    Contact.jsx            three store locations
    AdminLogin.jsx         Supabase email/password
    AdminDashboard.jsx     product CRUD + settings (live to all customers)
```
