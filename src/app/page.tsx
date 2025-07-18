"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, ShoppingCart, Zap } from 'lucide-react';

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

async function fetchProducts() {
  const { data } = await supabase.from('products').select('*');
  return data || [];
}

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  
  const categories = [
    { label: 'All Products', value: 'all' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Sports', value: 'sports' },
  ];

  const filteredProducts = products?.filter(product => {
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
            className={`px-8 py-4 rounded-2xl border-2 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg
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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-500"></div>
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
          <div 
            key={product.id} 
            className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 transform hover:-translate-y-2"
          >
            <Link href={`/products/${slugify(product.name)}`} className="block w-full">
              <div className="w-full aspect-square relative overflow-hidden">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
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
              
              <div className="flex gap-3 w-full">
                <Link href={`/products/${slugify(product.name)}`} className="flex-1">
                  <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </Link>
                <Link href={`/checkout?productId=${product.id}`} className="flex-1">
                  <button className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}