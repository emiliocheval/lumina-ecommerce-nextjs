'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!product.sizes || product.sizes.length === 0) {
      addItem({
        ...product,
        quantity: 1,
        selectedSize: undefined
      });
      toast.success(`${product.name} added to cart!`);
      return;
    }
    
    // If product has sizes, redirect to product page
    // The click event will bubble up to the Link
  };
  
  return (
    <Link 
      href={`/products/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-muted/50">
        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Sale Badge */}
        {product.salePrice && (
          <Badge 
            variant="destructive"
            className="absolute top-2 left-2 z-10"
          >
            Sale
          </Badge>
        )}
        
        {/* Action Buttons (visible on hover) */}
        <motion.div
          className="absolute bottom-2 inset-x-2 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <Button 
            variant="secondary" 
            size="sm"
            className="rounded-full w-10 h-10 p-0 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Added to favorites!");
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm"
            className={cn(
              "rounded-full bg-primary/90 hover:bg-primary",
              product.sizes && product.sizes.length > 0 
                ? "pr-4 pl-3" 
                : "w-10 h-10 p-0"
            )}
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
            {product.sizes && product.sizes.length > 0 && (
              <span className="ml-1 text-xs">View</span>
            )}
          </Button>
        </motion.div>
      </div>
      
      <div className="mt-3">
        <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
        
        <div className="flex items-center mt-1">
          {product.salePrice ? (
            <>
              <p className="font-semibold">{formatCurrency(product.salePrice)}</p>
              <p className="ml-2 text-sm text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </p>
            </>
          ) : (
            <p className="font-semibold">{formatCurrency(product.price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}