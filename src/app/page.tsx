import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default async function HomePage() {
  const { data: products } = await supabase.from('products').select('*');

  return (
    <main className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">Featured Products</h1>
      {products && products.length === 0 && (
        <p>No products found. If you just added products, check your RLS policies or refresh the page.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products && products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${slugify(product.name)}`}
            className="flex flex-col items-center group"
          >
            <div className="flex flex-col items-center w-full">
              <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={true}
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <span className="text-lg font-extrabold text-center mb-1 uppercase tracking-wide">
                  {product.name}
                </span>
                <span className="text-base font-semibold text-center">EGP {product.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
