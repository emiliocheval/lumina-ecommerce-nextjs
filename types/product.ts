export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: {
    id: string;
    name: string;
  };
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviewCount: number;
  details?: string[];
}