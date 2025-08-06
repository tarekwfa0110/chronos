import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/ui/header";
import CartModal from "./cart-modal";
import { CookieConsent } from "@/components/ui/CookieConsent";

// Primary font: Geist (modern, clean)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Alternative premium font: Inter (excellent for e-commerce)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only load when needed
});

export const metadata: Metadata = {
  title: "Chronos - Modern Watch Store",
  description: "Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience.",
  keywords: ["watches", "e-commerce", "shop", "modern", "minimal", "chronos", "luxury watches"],
  authors: [{ name: "Chronos Team" }],
  creator: "Chronos",
  publisher: "Chronos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chronos.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chronos - Modern Watch Store",
    description: "Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience.",
    url: "https://chronos.example.com",
    siteName: "Chronos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chronos - Modern Watch Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronos - Modern Watch Store",
    description: "Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience.",
    images: ["/og-image.jpg"],
    creator: "@chronos",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience." />
        <meta name="keywords" content="watches, e-commerce, shop, modern, minimal, chronos" />
        <meta property="og:title" content="Chronos - Modern Watch Store" />
        <meta property="og:description" content="Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chronos.example.com" />
        <meta property="og:site_name" content="Chronos" />
        <meta property="og:image" content="/public/globe.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chronos - Modern Watch Store" />
        <meta name="twitter:description" content="Chronos is a minimal, modern e-commerce storefront for watches. Shop the latest styles with a clean, dark-mode-first design and a smooth shopping experience." />
        <meta name="twitter:image" content="/public/globe.svg" />
        <link rel="canonical" href="https://chronos.example.com/" />
        {/* Organization Structured Data */}
        <script type="application/ld+json" suppressHydrationWarning>{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Chronos",
            "url": "https://chronos.example.com",
            "logo": "https://chronos.example.com/public/globe.svg",
            "sameAs": []
          }
        `}</script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased pt-16 dark:bg-[#0C0A09]`}>
        <Providers>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <ClientOnlyHeaderAndCartModal />
          <main id="main-content">
            {children}
          </main>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

// Client-only wrapper for Header and CartModal
function ClientOnlyHeaderAndCartModal() {
  "use client";
  return (
    <>
      <Header />
      <CartModal />
    </>
  );
}
