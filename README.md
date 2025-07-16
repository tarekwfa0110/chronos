# Chronos

Chronos is a minimal, modern e-commerce storefront built with Next.js, Supabase, shadcn/ui, and TanStack Query. It features a clean, dark-mode-first design and a focus on simplicity and performance.

## Tech Stack
- **Next.js (App Router)**
- **Supabase** (Postgres, Auth, Storage)
- **shadcn/ui** (UI components)
- **TanStack Query** (data fetching/caching)
- **Tailwind CSS** (utility-first styling)

## Current Features
- Product listing grid (homepage)
- Product details page with image gallery, description, and info accordions
- Add to cart, quantity selector, and cart drawer (global, with localStorage persistence)
- Minimal, responsive header with dark mode toggle and cart icon
- Fully responsive and mobile-friendly
- Dark mode with custom color palette
- Error/loading states for all data fetching
- "You May Also Like" product suggestions in cart

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd chronos
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure
- `src/app/` — Next.js app directory (pages, layout, providers)
- `src/components/ui/` — shadcn/ui components
- `src/app/cart-context.tsx` — Cart state/context
- `src/app/cart-modal.tsx` — Cart drawer/modal
- `src/lib/supabaseClient.ts` — Supabase client setup

## Future Plans
- User authentication (sign in/up, orders, wishlists)
- Checkout flow and payment integration
- Order history and user dashboard
- Product categories and filtering
- Admin dashboard for product management
- Reviews and ratings
- Improved accessibility and performance
- More advanced product gallery (multiple images)
- SEO improvements

---

Chronos is a work in progress. Feedback and contributions are welcome!
