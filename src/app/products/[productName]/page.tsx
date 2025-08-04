"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useParams, notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCart } from '../../cart-context';
import { useWishlist } from '../../wishlist-context';
import { useAuth } from '../../auth-context';
import { ProductImage, ThumbnailImage } from '@/components/ui/optimized-image';
import {
  Heart,
  Share2,
  ShoppingCart,
  Shield,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Clock
} from 'lucide-react';
import { ProductDetailSkeleton } from '@/components/ui/skeleton';

async function fetchProductByName(productName: string) {
  const { data, error } = await supabase
        .from('products')
        .select('*')
    .ilike('name', productName.replace(/-/g, ' '))
        .single();
  if (error || !data) return null;
  return data;
}

export default function ProductPage() {
  const params = useParams();
  const productName = useMemo(() => {
    if (!params || typeof params.productName !== 'string') return '';
    return params.productName;
  }, [params]);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productName],
    queryFn: () => fetchProductByName(productName),
    enabled: !!productName,
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    if (!user) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    setWishlistLoading(true);
    
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
    
    setWishlistLoading(false);
  };

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto py-12 px-4 dark:bg-[#0C0A09] min-h-screen">
        <ProductDetailSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto py-12 px-4 dark:bg-[#0C0A09] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 dark:text-red-400 mb-2">Sorry, we couldn&apos;t load this product.</p>
          <p className="text-gray-600 dark:text-gray-400">This could be a temporary issue or the product may no longer be available. Please try again later or return to the product list.</p>
          <p className="text-xs text-gray-400 mt-4">Error details: {error.message || 'Unknown error.'}</p>
        </div>
      </main>
    );
  }

  if (!product) {
        notFound();
    }

    return (
    <main className="max-w-7xl mx-auto py-8 px-4 dark:bg-[#0C0A09] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="space-y-6">
          {/* Main Product Image */}
          <div className="relative group">
            <div className="aspect-square bg-gray-50 dark:bg-black rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
              <ProductImage
                src={product.image_url || '/placeholder.png'}
                alt={product.name}
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-2xl transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Wishlist and Share buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${isInWishlist(product.id)
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-md'
                    }`}
                  aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-full bg-white/80 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 backdrop-blur-sm shadow-md transition-all duration-200" aria-label="Share product">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-4 justify-center">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${index === 0 ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                }`}>
                <ThumbnailImage
                  src={product.image_url || '/placeholder.png'}
                  alt={`${product.name} view ${index + 1}`}
                  width={80}
                  height={80}
                  style={{ objectFit: 'contain' }}
                  className="w-full h-full bg-gray-50"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-4 text-gray-900 dark:text-white">{product.name}</h1>
            <span className="text-2xl font-bold mb-4 block text-gray-900 dark:text-white">EGP {product.price}</span>
            {/* Product description with darker background */}
            <div className="mt-2 mb-4 p-4 rounded-lg bg-gray-300 dark:bg-black text-base text-gray-700 dark:text-gray-300">
              {product.description}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center text-black dark:text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className={`flex-1 py-4 text-lg font-semibold rounded-xl transition-all duration-200 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl`}
                onClick={() => {
                  if (!product) return;
                  window.location.href = `/checkout?productId=${product.id}&quantity=${quantity}`;
                }}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-6 py-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all duration-200 text-black dark:text-white"
                onClick={() => {
                  if (!product) return;
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                  }, quantity);
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Stock and Availability */}
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 dark:text-green-400 font-medium text-sm">In Stock • Ready to ship</span>
          </div>

          {/* Product Information Accordion */}
          <Accordion type="single" collapsible className="w-full mt-2">
            <AccordionItem value="details">
              <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-white px-0 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                Product Details
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 text-sm px-0 pb-2 pt-0">
                {product.details || 'No additional details provided.'}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-white px-0 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                Free Delivery & Returns
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-2 px-0 pb-2 pt-0">
                <Truck className="inline w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                Free delivery on all orders. 30-day hassle-free returns.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-shop">
              <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-white px-0 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                Why Shop With Us?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 dark:text-gray-300 text-sm space-y-1 px-0 pb-2 pt-0">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Secure checkout</div>
                <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Easy returns</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Fast shipping</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
        </main>
    );
}