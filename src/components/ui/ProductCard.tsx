import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Zap, Heart } from 'lucide-react';
import { useWishlist } from '@/app/wishlist-context';
import { useAuth } from '@/app/auth-context';
import { ProductImage } from '@/components/ui/optimized-image';

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    category?: string;
  };
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  showActions?: boolean;
}

export default function ProductCard({ product, onAddToCart, onBuyNow, showActions = true }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistToggle = async () => {
    console.log('Wishlist toggle clicked:', product.id, user?.id);
    
    if (!user) {
      // Show sign in prompt or redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    setWishlistLoading(true);
    
    try {
      if (isInWishlist(product.id)) {
        console.log('Removing from wishlist');
        await removeFromWishlist(product.id);
      } else {
        console.log('Adding to wishlist');
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error in wishlist toggle:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 transform hover:-translate-y-2">
      <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full">
        <div className="w-full aspect-square relative overflow-hidden">
          <ProductImage
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle();
            }}
            disabled={wishlistLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white'
            }`}
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>
      <div className="flex flex-col flex-1 p-6 items-center justify-between">
        <span className="text-xl font-extrabold text-center mb-2 uppercase tracking-wide text-black dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300">
          {product.name}
        </span>
        <span className="text-lg font-bold text-center text-black dark:text-white mb-6">
          EGP {product.price}
        </span>
        {showActions && (
          <div className="flex gap-3 w-full">
            <button
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              onClick={onAddToCart}
              aria-label="Add to Cart"
              type="button"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              onClick={onBuyNow}
              aria-label="Buy Now"
              type="button"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 