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

## 🚀 TODO: Improvements & Features

### 🔥 High Priority (Core Functionality)

#### Authentication & User Management
- [x] **Supabase Auth Integration**
  - [x] User registration/login forms
  - [x] Password reset functionality
  - [x] Email verification
  - [x] Social login (Google, GitHub)
- [x] **User Profile & Account Management**
  - [x] User dashboard page
  - [x] Profile editing (name, email, avatar)
  - [x] Password change functionality
  - [x] Account deletion

#### E-commerce Core Features
- [x] **Wishlist Implementation**
  - [x] Database schema for wishlists
  - [x] Add/remove from wishlist functionality
  - [x] Wishlist page with saved items
  - [x] Heart button functionality (currently does nothing)
- [x] **Order Management**
  - [x] Order history page
  - [x] Order tracking
  - [x] Order details view
  - [x] Order status updates
- [x] **Address Management**
  - [x] Saved addresses functionality
  - [x] Address validation
  - [x] Default shipping/billing addresses

### 🎨 UI/UX Enhancements

#### Typography & Design
- [x] **Custom Font Integration**
  - [x] Replace default font with premium typography (Geist + Inter)
  - [x] Add font loading optimization (display: swap, preload)
  - [x] Implement font fallbacks
  - [x] Consider fonts: Inter, Poppins, or custom brand font

#### Loading & Performance
- [x] **Skeleton Loading States**
  - [x] Product card skeletons
  - [x] Product detail page skeletons
  - [x] Cart loading states
  - [x] Search results skeletons
- [x] **Image Optimization**
  - [x] Implement blur placeholders
  - [x] Add multiple image sizes (responsive)
  - [x] Optimize image lazy loading
  - [x] Add WebP/AVIF format support
  - [x] Implement image compression

#### Search & Filtering
- [ ] **Advanced Search**
  - [ ] Autocomplete functionality
  - [ ] Search suggestions
  - [ ] Search history
  - [ ] Voice search capability
- [ ] **Enhanced Filters**
  - [ ] Price range slider
  - [ ] Brand filter dropdown
  - [ ] Category filters
  - [ ] Sort by popularity, newest, price
  - [ ] Filter persistence in URL

### ⚡ Performance & Technical

#### Caching & CDN
- [ ] **Redis Caching**
  - [ ] Product data caching
  - [ ] User session caching
  - [ ] Search results caching
  - [ ] Cache invalidation strategies
- [ ] **CDN Integration**
  - [ ] Image CDN setup
  - [ ] Static asset CDN
  - [ ] Edge caching configuration
- [ ] **Service Worker**
  - [ ] Offline functionality
  - [ ] Background sync
  - [ ] Push notifications
  - [ ] App-like experience

#### SEO & Meta
- [ ] **Structured Data**
  - [ ] Product schema markup
  - [ ] Organization schema
  - [ ] Breadcrumb schema
  - [ ] Review schema (when implemented)
- [ ] **SEO Optimization**
  - [ ] Generate sitemap.xml
  - [ ] Create robots.txt
  - [ ] Open Graph images for social sharing
  - [ ] Meta description optimization
  - [ ] Canonical URLs

#### Error Handling & Validation
- [x] **Error Boundaries**
  - [x] Global error boundary
  - [x] Route-level error boundaries
  - [x] Component error boundaries
- [x] **Retry Mechanisms**
  - [x] API call retries
  - [x] Network error handling
  - [x] Graceful degradation
- [x] **Form Validation**
  - [x] Install and configure Zod
  - [x] Contact form validation
  - [x] Checkout form validation
  - [x] User registration validation
  - [x] Real-time validation feedback

### 🛡️ Security & Compliance

#### Security Headers
- [ ] **CSP Headers**
  - [ ] Content Security Policy implementation
  - [ ] XSS protection
  - [ ] Clickjacking protection
- [ ] **Rate Limiting**
  - [ ] API rate limiting
  - [ ] Login attempt limiting
  - [ ] Search rate limiting
- [ ] **Input Sanitization**
  - [ ] XSS prevention
  - [ ] SQL injection prevention
  - [ ] Input validation middleware

#### Privacy & Compliance
- [ ] **Cookie Consent**
  - [ ] GDPR-compliant cookie banner
  - [ ] Cookie preferences management
  - [ ] Analytics consent
- [ ] **Data Management**
  - [ ] Data deletion functionality
  - [ ] Data export functionality
  - [ ] Privacy policy page
  - [ ] Terms of service page
- [ ] **WCAG Compliance**
  - [ ] Full WCAG 2.1 AA compliance
  - [ ] Keyboard navigation support
  - [ ] Screen reader optimization
  - [ ] Color contrast improvements
  - [ ] Focus management
  - [ ] ARIA labels and roles

### 📱 Mobile & PWA

#### Progressive Web App
- [ ] **PWA Features**
  - [ ] Service worker for offline support
  - [ ] App manifest configuration
  - [ ] Install prompt
  - [ ] Background sync
- [ ] **Mobile Optimization**
  - [ ] Touch gesture support
  - [ ] Mobile-specific interactions
  - [ ] Performance optimization for mobile
  - [ ] Mobile-first design improvements

### 🧪 Testing & Quality

#### Testing Strategy
- [ ] **Unit Tests**
  - [ ] Component testing with React Testing Library
  - [ ] Utility function testing
  - [ ] Cart context testing (expand existing)
- [ ] **Integration Tests**
  - [ ] API integration testing
  - [ ] User flow testing
  - [ ] Authentication flow testing
- [ ] **E2E Tests**
  - [ ] Playwright setup
  - [ ] Critical user journey tests
  - [ ] Cross-browser testing

#### Code Quality
- [ ] **Linting & Formatting**
  - [ ] Enhanced ESLint configuration
  - [ ] Prettier integration
  - [ ] Husky pre-commit hooks
  - [ ] TypeScript strict mode
- [ ] **Documentation**
  - [ ] Component documentation
  - [ ] API documentation
  - [ ] Setup instructions
  - [ ] Contributing guidelines

### 📊 Analytics & Monitoring

#### Analytics
- [ ] **User Analytics**
  - [ ] Google Analytics 4 integration
  - [ ] Conversion tracking
  - [ ] User behavior analysis
  - [ ] A/B testing setup
- [ ] **Performance Monitoring**
  - [ ] Core Web Vitals tracking
  - [ ] Error tracking (Sentry)
  - [ ] Performance monitoring
  - [ ] Uptime monitoring

## Implementation Priority

### Phase 1 (Foundation) ✅
1. ✅ Supabase Auth Integration
2. ✅ Custom Font Integration
3. ✅ Skeleton Loading States
4. ✅ Form Validation with Zod
5. ✅ Error Boundaries
6. ✅ User Profile & Account Management
7. ✅ Wishlist Implementation
8. ✅ Order Management
9. ✅ Address Management

### Phase 2 (Core Features)
1. Wishlist Implementation
2. Advanced Search & Filters
3. Image Optimization
4. SEO Improvements
5. WCAG Compliance

### Phase 3 (Performance & Security)
1. Redis Caching
2. CDN Integration
3. Service Worker
4. Security Headers
5. Cookie Consent

### Phase 4 (Advanced Features)
1. PWA Features
2. Analytics & Monitoring
3. Testing Coverage
4. Documentation
5. Performance Optimization

---

Chronos is a work in progress. Feedback and contributions are welcome!
