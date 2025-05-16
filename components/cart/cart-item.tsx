'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import { formatCurrency } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleIncrease = () => {
    setIsUpdating(true);
    updateQuantity(item.id, item.quantity + 1, item.selectedSize);
    setTimeout(() => setIsUpdating(false), 300);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      setIsUpdating(true);
      updateQuantity(item.id, item.quantity - 1, item.selectedSize);
      setTimeout(() => setIsUpdating(false), 300);
    }
  };
  
  const handleRemove = () => {
    removeItem(item.id, item.selectedSize);
  };
  
  const itemPrice = item.salePrice || item.price;
  const itemTotal = itemPrice * item.quantity;
  
  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <div className="w-24 h-24 relative flex-shrink-0 bg-muted rounded overflow-hidden">
        <Link href={`/products/${item.id}`}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link 
              href={`/products/${item.id}`}
              className="font-medium hover:underline line-clamp-1"
            >
              {item.name}
            </Link>
            
            {item.selectedSize && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Size: {item.selectedSize}
              </p>
            )}
          </div>
          
          <div className="mt-1 sm:mt-0 sm:text-right">
            <p className="font-medium">{formatCurrency(itemTotal)}</p>
            <p className="text-sm text-muted-foreground">
              {item.quantity} × {formatCurrency(itemPrice)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrease}
              disabled={item.quantity <= 1 || isUpdating}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrease}
              disabled={isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Remove button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}