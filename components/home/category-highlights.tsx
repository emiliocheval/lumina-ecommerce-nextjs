import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';

interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export default async function CategoryHighlights() {
  // Fetch all products
  const products = await getProducts();

  // Extract unique categories from products
  const categoryMap = new Map<string, Category>();
  for (const product of products) {
    if (!product.category?.id) continue;
    if (!categoryMap.has(product.category.id)) {
      categoryMap.set(product.category.id, {
        id: product.category.id,
        name: product.category.name,
        image: product.image, // Use the first product's image as category image
        description: product.description,
      });
    }
  }
  const categories = Array.from(categoryMap.values());

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop By Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No categories found.
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        )}
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link 
      href={`/products?category=${category.id}`}
      className="group relative overflow-hidden rounded-lg aspect-[4/5]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-6">
        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
        )}
        <Button 
          variant="outline" 
          className="w-fit bg-background/30 backdrop-blur-sm border-primary/20 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          Explore
        </Button>
      </div>
    </Link>
  );
}