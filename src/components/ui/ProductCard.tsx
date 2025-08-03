import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Zap } from 'lucide-react';

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
  return (
    <div className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 transform hover:-translate-y-2">
      <Link href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full">
        <div className="w-full aspect-square relative overflow-hidden">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
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