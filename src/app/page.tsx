"use client";
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { Product } from '../types';
import { useCart } from './cart-context';
import { AdvancedSearchBar } from '../components/ui/AdvancedSearchBar';
import { CachedProductAPI } from '../lib/cached-api';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, AlertCircle, Plus, Filter, X } from 'lucide-react';

async function fetchProducts() {
  return await CachedProductAPI.getAllProducts();
}

export default function HomePage() {
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  const { addToCart } = useCart();
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(24);

  const filteredProducts = (products as Product[] | undefined)?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMoreProducts = displayedProducts.length < filteredProducts.length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 24, filteredProducts.length));
  };

  const handleFilterChange = () => {
    setDisplayCount(24);
  };

  const categories = ['All', 'Men', 'Women', 'Sports'];
  const hasActiveFilters = searchTerm || category;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our curated collection of premium products
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 space-y-6">
          {/* Advanced Search Bar */}
          <div className="max-w-2xl mx-auto">
            <AdvancedSearchBar
              products={products || []}
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                handleFilterChange();
              }}
              onCategoryChange={(value) => {
                setCategory(value);
                handleFilterChange();
              }}
              category={category}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => {
              const isActive = category === (cat === 'All' ? '' : cat);
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat === 'All' ? '' : cat);
                    handleFilterChange();
                  }}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-card text-card-foreground border border-border hover:border-border/60'
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filters & Results Summary */}
          {!isLoading && !error && products && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredProducts.length === products.length ? (
                  <span>
                    Showing <span className="font-medium text-gray-900 dark:text-white">{displayedProducts.length}</span> of{' '}
                    <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> products
                  </span>
                ) : (
                  <span>
                    <span className="font-medium text-gray-900 dark:text-white">{filteredProducts.length}</span> products found
                    {searchTerm && (
                      <span className="ml-1">
                        for `<span className="font-medium">{searchTerm}</span>`
                      </span>
                    )}
                    {category && (
                      <span className="ml-1">
                        in <span className="font-medium">{category}</span>
                      </span>
                    )}
                  </span>
                )}
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('');
                    handleFilterChange();
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="aspect-square bg-muted rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn&apos;t load the products. Please check your connection and try again.
            </p>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        )}

        {/* No Products */}
        {products && products.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Check back later or try refreshing the page.
            </p>
            <Button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              className="border-border"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        )}

        {/* No Filtered Results */}
        {!isLoading && !error && products && products.length > 0 && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setCategory('');
                handleFilterChange();
              }}
              variant="outline"
              className="border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {displayedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group"
                  style={{ 
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg dark:hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/25 transition-all duration-300 hover:-translate-y-1">
                    {/* Product Image */}
                    <div className="aspect-square p-4 bg-muted/50">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-card-foreground line-clamp-2 text-sm">
                          {product.name}
                        </h3>
                        <p className="text-lg font-bold text-card-foreground mt-1">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image_url: product.image_url,
                            });
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs border-border hover:border-border/60"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => {
                            window.location.href = `/checkout?productId=${product.id}&quantity=1`;
                          }}
                          size="sm"
                          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreProducts && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-border hover:bg-muted/50"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Load More
                  <span className="ml-2 text-sm opacity-75">
                    ({filteredProducts.length - displayedProducts.length} remaining)
                  </span>
                </Button>
              </div>
            )}

            {/* All Loaded Message */}
            {!hasMoreProducts && filteredProducts.length > 24 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  All {filteredProducts.length} products loaded
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}