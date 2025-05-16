import { Product } from '@/types/product';
import { supabase } from './supabase';

// This would fetch from a database in a real application
export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Fetch products from Supabase
  let query = supabase
    .from('products')
    .select(`*, category:categories(name, id)`);

  if (filters?.category) {
    if (filters.category === 'sale') {
      query = query.not('sale_price', 'is', null);
    } else if (/^[0-9a-fA-F-]{36}$/.test(filters.category)) {
      query = query.eq('category_id', filters.category);
    } else {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name');
      const category = categories?.find(
        (cat) => cat.name.toLowerCase() === filters.category?.toLowerCase()
      );
      if (category) {
        query = query.eq('category_id', category.id);
      }
    }
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  // Sorting (optional, simple example)
  if (filters?.sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (filters?.sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as any[]).map((product) => ({
    ...product,
    salePrice: product.sale_price,
  })) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  
  return product || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const products = await getProducts();
  return products.slice(0, 4);
}

export async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const products = await getProducts();
  
  // Filter products by category and exclude current product
  const relatedProducts = products
    .filter(product => product.category.id === categoryId && product.id !== currentProductId)
    .slice(0, 4); // Limit to 4 products
  
  return relatedProducts;
}

export async function getAllProductIds(): Promise<string[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const products = await getProducts();
  return products.map(product => product.id);
}