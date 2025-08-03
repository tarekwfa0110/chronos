"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingCart, Zap } from 'lucide-react';
import Spinner from '../components/ui/spinner';
import ProductCard from '../components/ui/ProductCard';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';
import { useCart } from './cart-context';

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

async function fetchProducts() {
  const { data } = await supabase.from('products').select('*');
  return data || [];
}

export default function HomePage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  const { addToCart } = useCart();
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const categories = CATEGORIES;

  const filteredProducts = (products as Product[] | undefined)?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 dark:bg-[#0C0A09] min-h-screen">
      <h1 className="text-5xl font-extrabold mb-12 tracking-tight text-black dark:text-white text-center">
        Featured Products
      </h1>
      
      {/* Category Filter Buttons */}
      <div className="mb-10 flex flex-wrap gap-4 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-8 py-4 rounded-2xl border-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer
              ${category === cat.value
                ? 'bg-red-500 border-red-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}
            `}
            style={{ minWidth: 180 }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="sports">Sports</option>
        </select>
        <select 
          className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size={48} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-2">Oops! We couldn't load the products.</p>
          <p className="text-gray-600 dark:text-gray-400">This might be a temporary issue with our store. Please check your internet connection or try refreshing the page in a moment.</p>
          <p className="text-xs text-gray-400 mt-4">Error details: {error.message || 'Unknown error.'}</p>
        </div>
      )}

      {/* No Products Message */}
      {products && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-black dark:text-white mb-2">No products found.</p>
          <p className="text-gray-600 dark:text-gray-400">If you just added products, check your RLS policies or refresh the page.</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => {
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
              });
            }}
            onBuyNow={() => {
              // Navigate to checkout with this product
              window.location.href = `/checkout?productId=${product.id}&quantity=1`;
            }}
          />
        ))}
      </div>
    </main>
  );
}