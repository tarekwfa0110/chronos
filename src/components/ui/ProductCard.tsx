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
            aria-pressed={isInWishlist(product.id)}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-red-500">
            ${product.price.toFixed(2)}
          </p>
        </div>
        
        {showActions && (
          <div className="flex gap-3">
            <button
              onClick={onAddToCart}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              aria-label="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              aria-label="Buy Now"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 