import { supabase } from '../../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

type Props = {
  params: { productName: string }
};

export default async function ProductPage({ params }: Props) {
  const { productName } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', productName.replace(/-/g, ' '))
    .single();

  if (!product || error) {
    notFound();
  }

  return (
    <main className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
      {/* Left: Image and thumbnails */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            className="rounded-2xl"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={true}
          />
        </div>
        {/* Single thumbnail for now */}
        <div className="flex flex-col gap-4 w-20">
          <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-black">
            <Image
              src={product.image_url || '/placeholder.png'}
              alt={product.name}
              width={80}
              height={80}
              style={{ objectFit: 'contain' }}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-2">{product.name}</h1>
        <span className="text-2xl font-bold mb-2">EGP {product.price}</span>
        <p className="mb-4 text-base text-muted-foreground">{product.description}</p>
        {/* Quantity selector (static for now) */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            min={1}
            defaultValue={1}
            className="w-16 border rounded px-2 py-1 text-center"
            aria-label="Quantity"
          />
        </div>
        <Button size="lg" className="w-full text-lg font-semibold py-6 rounded-xl mb-4">Add to Cart</Button>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="details">
            <AccordionTrigger className="text-base font-bold uppercase">More Details</AccordionTrigger>
            <AccordionContent>
              More details about the product will go here.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sizefit">
            <AccordionTrigger className="text-base font-bold uppercase">Size & Fit</AccordionTrigger>
            <AccordionContent>
              Size and fit information will go here.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger className="text-base font-bold uppercase">Quality Guarantee & Returns</AccordionTrigger>
            <AccordionContent>
              Quality guarantee and returns policy will go here.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
