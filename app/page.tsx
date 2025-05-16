import Hero from '@/components/home/hero';
import FeaturedProducts from '@/components/home/featured-products';
import CategoryHighlights from '@/components/home/category-highlights';
import Newsletter from '@/components/home/newsletter';
import { getFeaturedContent } from '@/lib/sanity';

export default async function Home() {
  const heroContent = await getFeaturedContent('hero');
  const categoryContent = await getFeaturedContent('categories');
  
  return (
    <div className="flex flex-col gap-12 pb-12">
      <Hero content={heroContent} />
      <FeaturedProducts />
      <CategoryHighlights content={categoryContent} />
      <Newsletter />
    </div>
  );
}