"use client";
import { useWishlist } from '../wishlist-context';
import { useAuth } from '../auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../cart-context';
import { WishlistSkeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlist, loading, clearWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8 min-h-screen">
        <WishlistSkeleton />
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <Button
              onClick={clearWishlist}
              variant="outline"
              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start exploring our collection and save your favorite items to your wishlist for later.
          </p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard
                product={item.product}
                onAddToCart={() => addToCart({
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  image_url: item.product.image_url,
                })}
                onBuyNow={() => {
                  addToCart({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    image_url: item.product.image_url,
                  });
                  router.push('/checkout');
                }}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
} 