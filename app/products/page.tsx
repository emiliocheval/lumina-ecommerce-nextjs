import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import Breadcrumb from '@/components/ui/breadcrumb';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products', isCurrentPage: true }
        ]}
      />
      
      <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}