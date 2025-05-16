import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getAllProductIds } from '@/lib/products';
import Breadcrumb from '@/components/ui/breadcrumb';
import ProductDetail from '@/components/products/product-detail';
import RelatedProducts from '@/components/products/related-products';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const productIds = await getAllProductIds();
  return productIds.map((id) => ({
    id: id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name, href: `/products/${product.id}`, isCurrentPage: true }
        ]}
      />
      
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>
      
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts 
            categoryId={product.category.id} 
            currentProductId={product.id} 
          />
        </Suspense>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}