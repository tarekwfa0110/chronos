"use client";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import type { Product } from '../types';
import { CATEGORIES } from '../constants';
import { useCart } from './cart-context';
import { Typography } from '@/components/ui/font-utils';
import { ProductGridSkeleton } from '@/components/ui/skeleton';
import { AdvancedSearchBar } from '../components/ui/AdvancedSearchBar';
import { CachedProductAPI } from '../lib/cached-api';

async function fetchProducts() {
  return await CachedProductAPI.getAllProducts();
}

export default function HomePage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  const { addToCart } = useCart();
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = (products as Product[] | undefined)?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || product.category === category;
    const matchesMinPrice = minPrice === undefined || product.price >= minPrice;
    const matchesMaxPrice = maxPrice === undefined || product.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  }) || [];

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 dark:bg-[#0C0A09] min-h-screen">
      <Typography.h1 className="mb-12 text-center">
        Featured Products
      </Typography.h1>
      {/* Advanced Search Bar */}
      <div className="mb-10">
        <AdvancedSearchBar
          products={products || []}
          value={searchTerm}
          onChange={setSearchTerm}
          onCategoryChange={setCategory}
          onPriceChange={(min, max) => {
            setMinPrice(isNaN(min) ? undefined : min);
            setMaxPrice(isNaN(max) ? undefined : max);
          }}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="space-y-8">
          <ProductGridSkeleton count={6} />
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-xl text-red-600 dark:text-red-400 mb-2">Oops! We couldn&apos;t load the products.</p>
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