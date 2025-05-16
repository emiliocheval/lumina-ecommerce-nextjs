'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { formatCurrency, cn } from '@/lib/utils';
import { Star, Minus, Plus, ChevronDown, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  
  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addItem({
      ...product,
      quantity,
      selectedSize
    });
    
    toast.success(`${product.name} added to cart!`);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Product Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        
        {/* Sale Badge */}
        {product.salePrice && (
          <Badge 
            variant="destructive"
            className="absolute top-4 left-4"
          >
            Sale
          </Badge>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4", 
                    i < product.rating 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-muted-foreground"
                  )} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {product.reviewCount} reviews
            </span>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline">
          {product.salePrice ? (
            <>
              <span className="text-2xl font-bold">{formatCurrency(product.salePrice)}</span>
              <span className="ml-2 text-lg text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <p className="font-medium mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={selectedSize === size ? "default" : "outline"}
                  className="h-10 px-3"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Quantity */}
        <div>
          <p className="font-medium mb-3">Quantity</p>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          className="w-full h-12 text-base"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        
        {/* Product Info Sections */}
        <div className="pt-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>Free standard shipping on orders over $100</p>
                  </div>
                  <div className="flex items-start">
                    <RotateCcw className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p>Free returns within 30 days</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Trust Badges */}
        <div className="border rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm">Secure Checkout</span>
            </div>
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center">
              <RotateCcw className="h-5 w-5 mr-2" />
              <span className="text-sm">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}